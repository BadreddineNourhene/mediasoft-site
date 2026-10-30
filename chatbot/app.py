"""API du chatbot Mediasoft (FastAPI).

  GET  /api/health  : état du service (modèles et ceux en pause, nombre de passages indexés)
  POST /api/chat    : {"question": "...", "history": [{"role": "user"|"assistant", "content": "..."}], "lang": "fr"}
                      → {"answer": "...", "sources": [{"title", "url"}], "lang": "fr"}
                      La réponse suit la langue de la question ; « lang » (langue du navigateur) sert si elle est ambiguë.

Lancement local :  uvicorn app:app --port 8000
"""

import re
import time
from collections import defaultdict, deque

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import config
import langue
import llm
import rag
import websearch

app = FastAPI(title="Chatbot Mediasoft", docs_url="/api/docs", openapi_url="/api/openapi.json")
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

kb = rag.KnowledgeBase()

# Limite simple par adresse IP (mémoire du processus)
_calls: dict[str, deque] = defaultdict(deque)


def _rate_limited(ip: str) -> bool:
    now, q = time.time(), _calls[ip]
    while q and now - q[0] > 60:
        q.popleft()
    if len(q) >= config.RATE_LIMIT_PER_MINUTE:
        return True
    q.append(now)
    return False


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=config.MAX_QUESTION_CHARS)
    history: list[Message] = []
    lang: str = Field("", max_length=12)


# « Je n'ai pas cette information » dans les langues courantes : le modèle oublie parfois le code [INCONNU]
_INCONNU = re.compile(
    r"n.ai pas cette information|ne dispose pas de cette information|"
    r"(contexte|extraits|informations fournies).{0,30}ne (contien|mentionn|précis|donn)|"
    r"(don.t|do not) have (this|that|the|any) information|"
    r"(context|information provided|provided information).{0,30}(does not|doesn.t|do not) (contain|mention|include|provide)|"
    r"no (dispongo|tengo) de esta información|"
    r"ليس لدي[ي]? هذه المعلومة|لا (أملك|تتوفر لدي)|ma 3andich (el )?ma3louma",
    re.I,
)


def _inconnu(answer: str) -> bool:
    """La réponse dit que la base n'a pas l'information (code [INCONNU] ou formule « je n'ai pas cette information »)."""
    debut = (answer or "").lstrip()[:200]
    return debut.startswith(rag.UNKNOWN) or bool(_INCONNU.search(debut))


def _sans_contact_final(answer: str) -> str:
    """Retire le dernier paragraphe s'il s'agit du message de contact (lien de la page Contact)."""
    parts = re.split(r"\n\s*\n", (answer or "").strip())
    if len(parts) > 1 and config.CONTACT["formulaire"] in parts[-1]:
        return "\n\n".join(parts[:-1])
    return answer


def _sans_double_contact(answer: str) -> str:
    """Retire le bloc de contact final quand la réponse donnait déjà le lien de la page Contact (ex. « comment demander
    un devis ? ») : le modèle l'ajoute parfois malgré la consigne."""
    url = config.CONTACT["formulaire"]
    parts = re.split(r"\n\s*\n", (answer or "").strip())
    if len(parts) > 1 and url in parts[-1] and any(url in p for p in parts[:-1]):
        return "\n\n".join(parts[:-1])
    return answer


@app.get("/api/health")
def health():
    return {"status": "ok", "provider": config.LLM_PROVIDER, "passages": len(kb.chunks), "models": llm.status()}


@app.post("/api/chat")
async def chat(body: ChatRequest, request: Request):
    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "?").split(",")[0].strip()
    question = body.question.strip()
    detectee = langue.detecter(question)
    lang = langue.interface(detectee, body.lang)
    if _rate_limited(ip):
        raise HTTPException(429, langue.message("trop", lang))

    # La recherche tient compte de la question précédente (questions de suivi : « et son prix ? »)
    previous = next((m.content for m in reversed(body.history) if m.role == "user"), "")
    query = f"{previous} {question}".strip() if len(question) < 40 and previous else question
    # La base est en français et le modèle de recherche comprend mal les dialectes (derja, arabe tunisien) :
    # hors français, on cherche aussi avec une traduction française de la question
    queries = [query]
    if detectee != "fr":
        queries.append(await llm.translate_query(query))
    hits = kb.search(queries)

    history = [m.model_dump() for m in body.history]
    nom_langue = langue.nom(detectee, body.lang)
    fallback = langue.message("introuvable", lang)
    try:
        answer = await llm.generate(rag.build_messages(question, history, hits, nom_langue), hits)
        sources = rag.sources(hits)
        unknown = _inconnu(answer)
        # La base n'a pas la réponse : recherche web sur les sites officiels, puis nouvelle réponse à partir des pages
        if unknown and websearch.enabled():
            results = await websearch.search(queries[-1])
            if results:
                web_answer = await llm.generate(rag.build_messages(question, history, results, nom_langue, web=True), [])
                if web_answer and not _inconnu(web_answer):
                    answer, unknown = web_answer, False
                    # Réponse trouvée sur le web : le message de contact final n'est pas utile
                    answer = _sans_contact_final(answer)
                    sources = [{"title": r["title"], "url": r["url"]} for r in results[:3]]
    except llm.LLMError as e:
        print(f"[chatbot] erreur du modèle : {e}")
        raise HTTPException(503, langue.message("indisponible", lang) + fallback)
    answer = _sans_double_contact((answer or "").replace(rag.UNKNOWN, "").strip())
    # Réponse « je n'ai pas cette information » : les pages trouvées ne sont pas pertinentes, on ne les affiche pas
    return {"answer": answer or fallback, "sources": [] if unknown or not answer else sources, "lang": lang}
