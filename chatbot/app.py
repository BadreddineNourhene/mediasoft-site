"""API du chatbot Mediasoft (FastAPI).

  GET  /api/health  : état du service (modèles et ceux en pause, nombre de passages indexés)
  POST /api/chat/stream : même requête ; réponse en streaming, une ligne JSON par événement :
                      {"t": "delta", "v": "texte"} au fil de la rédaction, {"t": "reset"} (texte déjà envoyé à effacer :
                      autre modèle ou nouvelle tentative), puis {"t": "done", "v": <réponse de /api/chat>} ou
                      {"t": "error", "v": {"status", "detail"}}
  POST /api/chat    : {"question": "...", "history": [{"role": "user"|"assistant", "content": "..."}], "lang": "fr"}
                      → {"answer": "...", "sources": [{"title", "url"}], "lang": "fr", "choices"?: {...}}
                      « choices » (facultatif) : boutons proposés sous la réponse, {"questions": [{"label"?, "options"}],
                      "submit"?, "template"?} ; une seule question sans « submit » : un clic envoie l'option (ou le
                      template avec {0}) ; sinon un choix par question, puis « submit » envoie le template rempli ({0}, {1}…).
                      La réponse suit la langue de la question ; « lang » (langue du navigateur) sert si elle est ambiguë.

Lancement local :  uvicorn app:app --port 8000
"""

import asyncio
import json
import re
import time
from collections import defaultdict, deque
from contextvars import ContextVar

from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

import config
import fichiers
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

# Requête en streaming (/api/chat/stream) : fonction qui envoie un événement au navigateur ; None pour /api/chat
_envoi: ContextVar = ContextVar("envoi", default=None)


def _flux() -> dict:
    """Paramètres de streaming de llm.generate pour la réponse au visiteur (rien hors streaming)."""
    envoyer = _envoi.get()
    if not envoyer:
        return {}

    async def morceau(texte):
        await envoyer("delta", texte)

    async def effacer():
        await envoyer("reset")

    return {"on_token": morceau, "on_reset": effacer}

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


class Document(BaseModel):
    nom: str = Field(max_length=200)
    texte: str = Field(max_length=fichiers.TEXTE_MAX)


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=config.MAX_QUESTION_CHARS)
    history: list[Message] = []
    lang: str = Field("", max_length=12)
    # Bouton « Recherche web » du site : recherche sur internet pour chaque question, en plus de la base
    web: bool = False
    # Mode « Réponse détaillée » du menu + : réponse longue et structurée
    detail: bool = False
    # Fichier joint (texte extrait par /api/fichier), renvoyé avec chaque question de la conversation
    document: Document | None = None


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
# Aide en ligne d'un éditeur (origine des passages dans l'index) → logiciel concerné : écartée des questions sur un
# autre logiciel
AIDES = {"divalto_wiki": "Divalto Infinity", "bitrix_helpdesk": "Bitrix24", "powerbi_learn": "Power BI"}

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

# Manipulation dans un logiciel de gestion (« créer un article », « saisir une facture »…) : sans logiciel nommé
# dans la conversation, le chatbot demande lequel au lieu de deviner (un article se crée différemment dans chacun)
ACTION_ERP = re.compile(
    r"(cr[ée]er|ajouter|saisir|modifier|supprimer|param[ée]trer|imprimer|annuler|valider|transformer|cl[ôo]turer|"
    r"create|add|edit|delete|print)\b.{0,40}\b(article|client|fournisseur|facture|devis|bon de|commande|[ée]criture|"
    r"journal|stock|inventaire|tiers|produit|pi[èe]ce|r[èe]glement|avoir|item|invoice|quote|customer|supplier|order)",
    re.I,
)

# Rédaction de contenu (article de blog, SEO, post LinkedIn…) plutôt qu'une réponse de support
REDACTION = re.compile(
    r"r[ée]dig|r[ée]daction|[ée]cri(re|s|vez)\b|article (de blog|marketing|seo|commercial|technique)|blog|\bseo\b|"
    r"linkedin|newsletter|write (an?|the|me an?) (article|blog|post)|blog post",
    re.I,
)
# « Article sur Divalto » : fiche article dans le logiciel, ou article rédigé à propos du logiciel ? On demande.
ARTICLE_SUR = re.compile(r"\barticles?\b[^.?!]{0,25}\b(sur|about|à propos|concernant)\b", re.I)
ARTICLE_CREER = re.compile(r"\b(cr[ée]er|faire|pr[ée]parer|create|make)\b.{0,30}\barticles?\b", re.I)
FICHE = re.compile(r"fiche|dans (le |l')?(logiciel|erp)|stock|r[ée]f[ée]rence|code article|famille|tarif", re.I)

# Le visiteur nomme lui-même un logiciel dans sa question
NOMME = re.compile(r"sage|ciel|divalto|bitrix|outlook|teams|excel|word|onedrive|sharepoint|microsoft|office|power ?bi", re.I)

# Logiciel nommé dans une réponse : sert à préciser la recherche web des questions de suivi
PRODUIT = re.compile(r"Sage \d+\w*(?: Ciel)?|Sage [A-Z][\w-]+|Divalto(?: Infinity| weavy)?|Bitrix24|Microsoft 365|Power BI")


def _inconnu(answer: str) -> bool:
    """La réponse dit que la base n'a pas l'information (code [INCONNU] ou formule « je n'ai pas cette information »)."""
    debut = (answer or "").lstrip()[:200]
    return debut.startswith(rag.UNKNOWN) or bool(_INCONNU.search(debut))


# Espaces seulement autour du renvoi (pas de saut de ligne) : sinon l'étape suivante d'une liste se colle au lien
_REF = re.compile(
    r"[ \t]*\(?[ \t]*(?:(?:voir|cf\.?|see)[ \t]+)?(?:(?:la|the)[ \t]+)?(?:sources?[ \t]*:?[ \t]*)?"
    # « 【2†】 », « 【2†L3-L8】 » : forme de renvoi propre à gpt-oss (croix puis lignes citées), traitée comme « [2] »
    r"[\[【][ \t]*(W?\d+(?:[ \t]*[,;][ \t]*W?\d+)*)[ \t]*(?:†[^\]】\n]{0,40})?[\]】][ \t]*\)?",
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


async def _rediger(demande: str, body, logiciel: str | None, nom_langue: str, lang: str):
    """Rédige un article (ou un post) à partir de passages variés de la base sur le logiciel demandé."""
    sujet = logiciel or "Mediasoft"
    # Les aides en ligne (procédures, paramétrage) servent l'article technique sur leur logiciel ; un article
    # marketing s'appuie sur les pages de présentation
    sans = tuple(s for s in AIDES if not (re.search(r"technique", demande, re.I) and AIDES[s] == sujet))
    hits, vus = [], set()
    for q in (
        f"{sujet} présentation du logiciel",
        f"{sujet} fonctionnalités et modules",
        f"{sujet} avantages pour l'entreprise",
        f"{sujet} secteurs d'activité et à qui il s'adresse",
        f"{sujet} cloud SaaS hébergement mobilité",
        f"Mediasoft accompagnement intégration {sujet} conseil formation",
        "Mediasoft démarche projet analyse des besoins paramétrage reprise des données formation assistance",
        demande,
    ):
        for h in kb.search(q, k=5, sans=sans):
            if h["text"] not in vus:
                vus.add(h["text"])
                hits.append(h)
    hits = hits[:22]
    history = [m.model_dump() for m in body.history]
    try:
        # Article détaillé : plus de texte et plus de temps qu'une réponse courte
        answer = await llm.generate(
            rag.build_redaction_messages(demande, history, hits, nom_langue), hits, max_tokens=10000, deadline=120,
            **_flux(),
        )
    except llm.LLMError as e:
        print(f"[chatbot] erreur du modèle (rédaction) : {e}")
        raise HTTPException(503, langue.message("indisponible", lang) + langue.message("introuvable", lang))
    answer, _ = _citations((answer or "").replace(rag.UNKNOWN, "").strip(), hits, [])
    return {"answer": _deploiement(_liens_connus(answer), sujet), "sources": [], "lang": lang}


# Dernière ligne « CHOIX : a | b | c » écrite par le modèle quand une précision est utile → boutons sous la réponse
_CHOIX = re.compile(r"^\W*(?:CHOIX|CHOICES?|خيارات)\W*:\s*(.+)$", re.I | re.M)


def _choix(answer: str):
    """Retire les lignes « CHOIX : … » de la réponse et en fait des boutons (la dernière ligne trouvée)."""
    trouves = _CHOIX.findall(answer)
    if not trouves:
        return answer, None
    options = [o.strip(" *.«»\"") for o in trouves[-1].split("|")]
    options = list(dict.fromkeys(o for o in options if 0 < len(o) <= 80))[:5]
    answer = _CHOIX.sub("", answer).strip()
    return answer, ({"questions": [{"options": options}]} if len(options) >= 2 else None)


# Divalto Infinity s'installe aussi sur les serveurs du client (On-Premise) : jamais « 100 % cloud » (seule la
# plateforme Divalto one l'est), même si une page de présentation le dit
_CLOUD = re.compile(r"(?<!one )100\s?%\s?(?:cloud|en ligne|SaaS)", re.I)


def _deploiement(answer: str, sujet: str | None) -> str:
    if sujet and "divalto" in sujet.lower():
        return _CLOUD.sub("en cloud (SaaS) ou sur site (On-Premise)", answer)
    return answer


_LIEN = re.compile(r"\[([^\]\n]+)\]\((https?://[^)\s]+)\)")


def _liens_connus(answer: str) -> str:
    """Retire les liens vers des pages absentes de la base (le modèle invente parfois une adresse plausible) :
    une puce qui ne contenait que ce lien disparaît, ailleurs le texte du lien reste sans lien."""
    connues = {c.get("url") for c in kb.chunks} | {config.CONTACT["formulaire"]}

    def ligne(l: str) -> str | None:
        faux = [m for m in _LIEN.finditer(l) if m.group(2) not in connues]
        if faux and re.fullmatch(r"\s*[-*•]\s*" + re.escape(faux[0].group(0)) + r"\s*", l):
            return None
        return _LIEN.sub(lambda m: m.group(0) if m.group(2) in connues else m.group(1), l)

    return "\n".join(l for l in map(ligne, answer.split("\n")) if l is not None)


@app.get("/api/health")
def health():
    return {"status": "ok", "provider": config.LLM_PROVIDER, "passages": len(kb.chunks), "models": llm.status()}


@app.post("/api/fichier")
async def fichier(request: Request, file: UploadFile = File(...), lang: str = ""):
    """Texte d'un fichier joint (PDF, Word, Excel, CSV, texte) ; le fichier lui-même n'est pas conservé."""
    code = langue.interface("", lang)
    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "?").split(",")[0].strip()
    if _rate_limited(ip):
        raise HTTPException(429, langue.message("trop", code))
    data = await file.read(fichiers.TAILLE_MAX + 1)
    try:
        # Lecture dans un fil à part : un gros fichier ne bloque pas les questions des autres visiteurs
        return await asyncio.to_thread(fichiers.extraire, file.filename or "fichier", data)
    except fichiers.FichierInvalide as e:
        raise HTTPException(400, langue.message(f"fichier_{e}", code))


# Réponses déjà données (même question, même conversation avant elle, mêmes options) : renvoyées aussitôt, sans
# modèle de langage ni quota consommé. Pas de mémoire avec un fichier joint ni pour une recherche web demandée
# (résultats du moment). Effacée au redémarrage du chatbot.
_DEJA: dict[str, tuple[float, dict]] = {}
DEJA_DUREE = 6 * 3600
DEJA_MAX = 500


def _cle(body) -> str | None:
    if body.document or body.web:
        return None
    question = re.sub(r"\s+", " ", body.question.strip().lower())
    avant = [(m.role, m.content) for m in body.history][-config.MAX_HISTORY_MESSAGES:]
    return json.dumps([question, avant, body.lang[:2].lower(), body.detail], ensure_ascii=False)


@app.post("/api/chat")
async def chat(body: ChatRequest, request: Request):
    cle = _cle(body)
    deja = _DEJA.get(cle) if cle else None
    if deja and time.time() - deja[0] < DEJA_DUREE:
        return deja[1]
    reponse = await _repondre(body, request)
    if cle:
        if len(_DEJA) >= DEJA_MAX:  # la plus ancienne s'en va
            _DEJA.pop(next(iter(_DEJA)))
        _DEJA[cle] = (time.time(), reponse)
    return reponse


async def _repondre(body: ChatRequest, request: Request):
    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "?").split(",")[0].strip()
    question = body.question.strip()
    detectee = langue.detecter(question)
    lang = langue.interface(detectee, body.lang)
    if _rate_limited(ip):
        raise HTTPException(429, langue.message("trop", lang))
    # « Bonjour », « hello » : réponse immédiate avec les choix habituels, sans modèle de langage
    if langue.SALUT.match(question) and not body.document:
        answer, choices = langue.salutation(lang)
        return {"answer": answer, "sources": [], "lang": lang, "choices": choices}

    # La recherche tient compte de la question précédente (questions de suivi : « et son prix ? »)
    previous = next((m.content for m in reversed(body.history) if m.role == "user"), "")
    query = f"{previous} {question}".strip() if len(question) < 40 and previous else question
    dernier = next((m.content for m in reversed(body.history) if m.role == "assistant"), "")
    logiciel = next((label for motif, label in LOGICIELS if re.search(motif, query, re.I)), None)
    # Document long : seuls ses passages utiles à la question vont au modèle (réponse plus rapide, tout le fichier lu)
    doc = {"nom": body.document.nom, "texte": fichiers.extraits(body.document.texte, query)} if body.document else None
    # Avec un fichier joint, la question porte sur le document : pas d'aiguillage vers l'assistant d'article ni vers
    # « sur quel logiciel ? »
    if REDACTION.search(query) and not doc:
        sujet = logiciel or ("Mediasoft" if re.search(r"mediasoft", question, re.I) else None)
        # Article sans précision : comme ChatGPT, plan proposé et choix (type, public, objectif) avant de rédiger ;
        # un post LinkedIn, une newsletter ou une demande déjà précisée sont rédigés directement
        if not langue.ARTICLE_PRECISE.search(question) and not re.search(r"linkedin|newsletter|post\b", question, re.I):
            answer, choices = langue.assistant_article(sujet, lang)
            return {"answer": answer, "sources": [], "lang": lang, "choices": choices}
        return await _rediger(query, body, sujet, langue.nom(detectee, body.lang), lang)
    # « Créer un article sur Divalto » : comme ChatGPT, on part sur un article rédigé (une fiche article se crée
    # « dans » le logiciel, cas traité plus bas avec la procédure)
    # « Créer un article » sans logiciel ni « comment » : rédaction (plan et formulaire, solution en 1re question)
    if (not doc and ARTICLE_CREER.search(question) and not FICHE.search(question) and not NOMME.search(question)
            and not re.search(r"comment|[ée]tapes?|proc[ée]dure|how", question, re.I)):
        answer, choices = langue.assistant_article(None, lang)
        return {"answer": answer, "sources": [], "lang": lang, "choices": choices}
    if not doc and ARTICLE_SUR.search(question) and logiciel and not FICHE.search(question):
        answer, choices = langue.assistant_article(logiciel, lang)
        return {"answer": answer, "sources": [], "lang": lang, "choices": choices}
    if not doc and ACTION_ERP.search(query) and not NOMME.search(query) and not NOMME.search(dernier):
        answer, choices = langue.quel_logiciel(query, lang)
        return {"answer": answer, "sources": [], "lang": lang, "choices": choices}
    # La base est en français et le modèle de recherche comprend mal les dialectes (derja, arabe tunisien) :
    # hors français, on cherche aussi avec une traduction française de la question
    queries = [query]
    if detectee != "fr":
        queries.append(await llm.translate_query(query))
    # Question sur un autre logiciel que Divalto : l'aide en ligne Divalto est écartée
    sans = tuple(s for s, lui in AIDES.items() if logiciel and logiciel != lui)
    hits = _consultants(f"{question} {queries[-1]}", kb.search(queries, sans=sans))

    history = [m.model_dump() for m in body.history]
    nom_langue = langue.nom(detectee, body.lang)
    fallback = langue.message("introuvable", lang)
    # Prix, devis, délai, intégration (dans la question ou dans la précédente : « et ça coûte combien ? ») :
    # recherche web d'emblée sur les sites officiels, et coordonnées de contact en fin de réponse
    commerciale = langue.commerciale(f"{previous} {question}" if len(question) < 40 else question)
    # Base peu pertinente (meilleur score de sens faible) : recherche web d'emblée aussi
    base_faible = not hits or max(h.get("score", 0) for h in hits) < config.WEB_MIN_SCORE
    # Question de suivi (« et ça coûte combien ? ») : la recherche web reprend le logiciel cité dans la réponse précédente
    # Le logiciel nommé par le visiteur l'emporte (« sur Divalto, pas Sage ») ; sinon celui de la réponse précédente
    last = next((m.content for m in reversed(body.history) if m.role == "assistant"), "")
    produit = None if NOMME.search(question) else (PRODUIT.search(last) if len(question) < 60 else None)
    contexte = f"Logiciel dont il est question : {produit.group(0)}" if produit else ""
    # « Comment faire » (créer, configurer…) : la documentation des éditeurs est sur le web, recherche d'emblée.
    # Question de suivi courte (« sur Divalto ») : on tient compte de la question précédente (« créer un article »)
    procedure = bool(PROCEDURE.search(query))
    sq = None  # requête web, reformulée par le modèle (sans politesses, avec le nom du logiciel) au premier besoin

    async def requete():
        nonlocal sq
        if sq is None:
            sq = await llm.search_query(query, contexte)
        return sq

    web = []
    try:
        # « Comment faire » : l'aide officielle de l'éditeur est dans la base ; le web seulement si elle répond mal
        procedure_web = procedure and max((h.get("score", 0) for h in hits), default=0) < config.PROCEDURE_WEB_SCORE
        if websearch.enabled() and (body.web or ((commerciale or base_faible or procedure_web) and not doc)):
            web = await websearch.search(await requete())
            # Recherche web demandée par le visiteur : tout le web aussi, pas seulement les sites officiels
            if body.web:
                vus = {r["url"] for r in web}
                web += [r for r in await websearch.search(await requete(), officiel=False) if r["url"] not in vus]
        answer = await llm.generate(
            rag.build_messages(question, history, hits, nom_langue, web, doc, body.detail), hits,
            max_tokens=4000 if body.detail else 1000, **_flux(),
        )
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
                # Nouvelle tentative avec les pages web : la première réponse (« je n'ai pas cette information »)
                # s'efface à l'écran
                if (flux := _flux()):
                    await flux["on_reset"]()
                retry = await llm.generate(
                    rag.build_messages(question, history, hits, nom_langue, web, doc, body.detail), hits,
                    max_tokens=4000 if body.detail else 1000, **flux,
                )
                if retry and not _inconnu(retry):
                    answer, unknown = retry, False
                    break
    except llm.LLMError as e:
        print(f"[chatbot] erreur du modèle : {e}")
        raise HTTPException(503, langue.message("indisponible", lang) + fallback)

    answer = _sans_contact_final((answer or "").replace(rag.UNKNOWN, "").strip())
    # Renvois aux passages (« [3] », « 【W1】 », « (source [2]) ») → petits liens numérotés vers la page source
    answer, refs = _citations(answer, hits, web)
    answer, choices = _choix(_deploiement(answer, logiciel or (re.search(r"divalto", query, re.I) and "divalto")))
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
    return {"answer": answer, "sources": sources, "lang": lang} | ({"choices": choices} if choices else {})


@app.post("/api/chat/stream")
async def chat_stream(body: ChatRequest, request: Request):
    """Même réponse que /api/chat, envoyée au fil de la rédaction (une ligne JSON par événement, voir en tête)."""
    file: asyncio.Queue = asyncio.Queue()

    async def envoyer(t, v=None):
        await file.put({"t": t, "v": v})

    async def repondre():
        _envoi.set(envoyer)  # contexte propre à cette tâche
        try:
            await envoyer("done", await chat(body, request))
        except HTTPException as e:
            await envoyer("error", {"status": e.status_code, "detail": e.detail})
        except Exception as e:  # erreur imprévue : le visiteur voit le message d'indisponibilité
            print(f"[chatbot] erreur (streaming) : {type(e).__name__} {e}")
            await envoyer("error", {"status": 500, "detail": ""})
        finally:
            await file.put(None)

    tache = asyncio.create_task(repondre())

    async def lignes():
        while (evenement := await file.get()) is not None:
            yield json.dumps(evenement, ensure_ascii=False) + "\n"
        await tache

    # no-cache / X-Accel-Buffering : aucun intermédiaire ne doit garder la réponse avant de la transmettre
    return StreamingResponse(lignes(), media_type="application/x-ndjson",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
