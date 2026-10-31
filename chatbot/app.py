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


# Demande d'assistance (bug, problème, « qui contacter ») : la fiche des consultants du logiciel est ajoutée d'office
ASSISTANCE = re.compile(
    r"bug|probl[eè]me|erreur|panne|bloqu|ne (marche|fonctionne)|assistance|support|aide|contacter|consultant|qui (dois|peut|peux)|"
    r"issue|error|problem|help|contact|who |mochkla|mouchkla|ma ye5dem|ma y7el|t3atl|مشكل|خطأ|مساعدة|اتصل|عطل",
    re.I,
)
# Logiciel cité dans la question → intitulé de sa section dans consultants-mediasoft.md (Sage 50 avant Sage)
LOGICIELS = [
    (r"divalto", "Divalto Infinity"),
    (r"sage ?50|ciel", "Sage 50 (Ciel)"),
    (r"sage", "Sage (Sage 100)"),
    (r"bitrix", "Bitrix24"),
    (r"power ?bi", "Power BI"),
    (r"microsoft|office|outlook|teams|excel|word|onedrive|sharepoint|365", "Microsoft 365"),
]


def _consultants(question: str, hits: list[dict]) -> list[dict]:
    """Pour une demande d'assistance sur un logiciel nommé, place en tête la fiche de ses consultants Mediasoft."""
    if not ASSISTANCE.search(question):
        return hits
    for motif, label in LOGICIELS:
        if re.search(motif, question, re.I):
            fiche = [
                {**c, "score": 1.0}
                for c in kb.chunks
                if c["text"].startswith("Consultants Mediasoft à contacter") and f"Consultants à contacter pour {label}" in c["text"]
            ]
            return fiche + [h for h in hits if h["text"] not in {f["text"] for f in fiche}]
    return hits


# Question « comment faire » (procédure) : la réponse est souvent dans l'aide en ligne de l'éditeur
PROCEDURE = re.compile(
    r"comment|cr[ée]er|cr[ée]ation|param[ée]tr|configur|ajouter|modifier|supprimer|installer|[ée]tapes?|proc[ée]dure|"
    r"how (do|to|can)|create|set ?up|configure|install|steps?|kifech|kifeh|كيف|طريقة|خطوات",
    re.I,
)

# Logiciel nommé dans une réponse : sert à préciser la recherche web des questions de suivi
PRODUIT = re.compile(r"Sage \d+\w*(?: Ciel)?|Sage [A-Z][\w-]+|Divalto(?: Infinity| weavy)?|Bitrix24|Microsoft 365|Power BI")


def _inconnu(answer: str) -> bool:
    """La réponse dit que la base n'a pas l'information (code [INCONNU] ou formule « je n'ai pas cette information »)."""
    debut = (answer or "").lstrip()[:200]
    return debut.startswith(rag.UNKNOWN) or bool(_INCONNU.search(debut))


# Espaces seulement autour du renvoi (pas de saut de ligne) : sinon l'étape suivante d'une liste se colle au lien
_REF = re.compile(
    r"[ \t]*\(?[ \t]*(?:(?:voir|cf\.?|see)[ \t]+)?(?:(?:la|the)[ \t]+)?(?:sources?[ \t]*:?[ \t]*)?"
    r"[\[【][ \t]*(W?\d+(?:[ \t]*[,;][ \t]*W?\d+)*)[ \t]*[\]】][ \t]*\)?",
    re.I,
)


def _citations(answer: str, hits: list[dict], web: list[dict]):
    """Remplace les renvois du modèle ([1], 【W2】, (source [3])) par des liens Markdown « [n](url) » numérotés dans
    l'ordre d'apparition ; un renvoi vers une fiche sans page web est retiré. Renvoie (réponse, pages citées)."""
    order: list[dict] = []

    def url_of(ref: str):
        i = int(ref.lstrip("Ww")) - 1
        items = web if ref[0] in "Ww" else hits
        if 0 <= i < len(items) and items[i].get("url"):
            return items[i]["url"], items[i].get("title") or items[i]["url"]
        return None

    def repl(m):
        links = []
        for ref in re.split(r"\s*[,;]\s*", m.group(1)):
            found = url_of(ref)
            if not found:
                continue
            url, title = found
            if url not in [o["url"] for o in order]:
                order.append({"title": title, "url": url})
            n = [o["url"] for o in order].index(url) + 1
            links.append(f"[{n}]({url})")
        # Le renvoi était entouré d'espaces (milieu de phrase) : on garde un espace après, sinon les mots se collent
        apres = " " if m.group(0)[-1:] in (" ", "\t") else ""
        if links:
            return " " + " ".join(dict.fromkeys(links)) + apres
        return " " if apres and m.group(0)[:1] in (" ", "\t") else ""

    return _REF.sub(repl, answer).strip(), order


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
    hits = _consultants(f"{question} {queries[-1]}", kb.search(queries))

    history = [m.model_dump() for m in body.history]
    nom_langue = langue.nom(detectee, body.lang)
    fallback = langue.message("introuvable", lang)
    # Prix, devis, délai, intégration (dans la question ou dans la précédente : « et ça coûte combien ? ») :
    # recherche web d'emblée sur les sites officiels, et coordonnées de contact en fin de réponse
    commerciale = langue.commerciale(f"{previous} {question}" if len(question) < 40 else question)
    # Base peu pertinente (meilleur score de sens faible) : recherche web d'emblée aussi
    base_faible = not hits or max(h.get("score", 0) for h in hits) < config.WEB_MIN_SCORE
    # Question de suivi (« et ça coûte combien ? ») : la recherche web reprend le logiciel cité dans la réponse précédente
    last = next((m.content for m in reversed(body.history) if m.role == "assistant"), "")
    produit = PRODUIT.search(last) if len(question) < 60 else None
    contexte = f"Logiciel dont il est question : {produit.group(0)}" if produit else ""
    # « Comment faire » (créer, configurer…) : la documentation des éditeurs est sur le web, recherche d'emblée
    procedure = bool(PROCEDURE.search(question))
    sq = None  # requête web, reformulée par le modèle (sans politesses, avec le nom du logiciel) au premier besoin

    async def requete():
        nonlocal sq
        if sq is None:
            sq = await llm.search_query(question, contexte)
        return sq

    web = []
    try:
        if websearch.enabled() and (commerciale or base_faible or procedure):
            web = await websearch.search(await requete())
        answer = await llm.generate(rag.build_messages(question, history, hits, nom_langue, web), hits)
        unknown = _inconnu(answer)
        # Toujours rien : sites officiels (si pas encore cherchés), puis tout le web en dernier recours
        if unknown and websearch.enabled():
            for officiel in (True, False):
                if officiel and web:
                    continue
                vus = {r["url"] for r in web}
                plus = [r for r in await websearch.search(await requete(), officiel=officiel) if r["url"] not in vus]
                if not plus:
                    continue
                web += plus
                retry = await llm.generate(rag.build_messages(question, history, hits, nom_langue, web), hits)
                if retry and not _inconnu(retry):
                    answer, unknown = retry, False
                    break
    except llm.LLMError as e:
        print(f"[chatbot] erreur du modèle : {e}")
        raise HTTPException(503, langue.message("indisponible", lang) + fallback)

    answer = _sans_contact_final((answer or "").replace(rag.UNKNOWN, "").strip())
    # Renvois aux passages (« [3] », « 【W1】 », « (source [2]) ») → petits liens numérotés vers la page source
    answer, refs = _citations(answer, hits, web)
    if not answer:
        return {"answer": fallback, "sources": [], "lang": lang}
    # Le modèle écrit parfois « Je n'ai pas cette information. » puis répond quand même en détail (avec les pages web) :
    # on retire cette première phrase et la réponse est traitée comme trouvée
    first, _, rest = answer.partition("\n")
    if unknown and _INCONNU.search(first) and len(rest.strip()) > 300:
        answer, unknown = rest.strip(), False
    # Coordonnées ajoutées par le code (le modèle ne les écrit plus) : information introuvable ou question commerciale
    if (unknown or commerciale) and config.CONTACT["formulaire"] not in answer:
        answer += "\n\n" + langue.message("contact", lang)
    # Liens sous la réponse : pages web réellement citées dans la réponse, puis pages du site ; aucun si introuvable
    cited = refs + [
        {"title": r["title"], "url": r["url"]} for r in web if r["url"].rstrip("/") in answer and r["url"] not in {c["url"] for c in refs}
    ]
    sources, vus = [], set()
    for s in [] if unknown else cited + rag.sources(hits):
        # Même page avec ou sans « / » final : un seul lien
        if s["url"].rstrip("/") not in vus:
            vus.add(s["url"].rstrip("/"))
            sources.append(s)
    sources = sources[:4]
    return {"answer": answer, "sources": sources, "lang": lang}
