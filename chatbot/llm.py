"""Génération de la réponse (la partie « G » du RAG) avec des modèles gratuits.

LLM_PROVIDER donne les fournisseurs, dans l'ordre d'essai, séparés par des virgules :
  - groq       : API gratuite de Groq (GPT-OSS, Qwen…) ;
  - gemini     : API gratuite de Google Gemini ;
  - openrouter : modèles gratuits d'OpenRouter (suffixe « :free ») ;
  - nvidia     : modèles gratuits de NVIDIA (build.nvidia.com) ;
  - extractif  : aucun modèle de langage, on renvoie le passage le plus pertinent (dernier secours).
Chaque fournisseur peut avoir plusieurs modèles (GROQ_MODEL, OPENROUTER_MODEL… séparés par des virgules) : on essaie
tous les modèles du premier fournisseur, puis ceux du suivant, etc. Un modèle qui atteint son quota gratuit ou tombe en
panne est mis en pause quelques minutes, et le suivant prend le relais. Groq, Gemini, OpenRouter et NVIDIA parlent tous
le format d'API d'OpenAI.
"""

import logging
import time

import httpx

import config

log = logging.getLogger(__name__)


class LLMError(RuntimeError):
    pass


class _Pause(LLMError):
    """Échec qui met le modèle (ou tout le fournisseur) en pause pendant `seconds`."""

    def __init__(self, message, seconds, whole_provider=False):
        super().__init__(message)
        self.seconds = seconds
        self.whole_provider = whole_provider


# nom : (adresse de l'API, clé, modèles)
OPENAI_COMPATIBLES = {
    "groq": ("https://api.groq.com/openai/v1/chat/completions", config.GROQ_API_KEY, config.GROQ_MODEL),
    "gemini": (
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        config.GEMINI_API_KEY,
        config.GEMINI_MODEL,
    ),
    "openrouter": ("https://openrouter.ai/api/v1/chat/completions", config.OPENROUTER_API_KEY, config.OPENROUTER_MODEL),
    "nvidia": ("https://integrate.api.nvidia.com/v1/chat/completions", config.NVIDIA_API_KEY, config.NVIDIA_MODEL),
}
HOUR = 3600

# (fournisseur, modèle ou None pour tout le fournisseur) → instant de fin de pause
_paused: dict[tuple[str, str | None], float] = {}


def chain():
    """Liste ordonnée des (fournisseur, modèle) à essayer."""
    out = []
    for provider in config.LLM_PROVIDERS:
        if provider in OPENAI_COMPATIBLES:
            out += [(provider, m.strip()) for m in OPENAI_COMPATIBLES[provider][2].split(",") if m.strip()]
        else:
            out.append((provider, None))
    return out


def _is_paused(provider, model, now):
    return max(_paused.get((provider, model), 0), _paused.get((provider, None), 0)) > now


def status():
    """État de chaque modèle, pour /api/health."""
    now = time.time()
    return [
        {"provider": p, "model": m, "paused": round(max(_paused.get((p, m), 0), _paused.get((p, None), 0)) - now)}
        if _is_paused(p, m, now)
        else {"provider": p, "model": m}
        for p, m in chain()
    ]


async def _openai_compatible(name, model, messages, timeout, max_tokens=1500):
    url, key, _ = OPENAI_COMPATIBLES[name]
    if not key:
        raise _Pause(f"{name.upper()}_API_KEY manquante dans .env", HOUR, whole_provider=True)
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            r = await client.post(
                url,
                headers={"Authorization": f"Bearer {key}"},
                json={"model": model, "messages": messages, "temperature": 0.2, "max_tokens": max_tokens},
            )
    except httpx.HTTPError as e:
        raise _Pause(f"injoignable : {type(e).__name__} {e}".rstrip(), config.LLM_COOLDOWN) from e
    if r.status_code == 429:
        retry = r.headers.get("retry-after", "")
        raise _Pause("quota gratuit atteint", float(retry) if retry.isdigit() else config.LLM_COOLDOWN)
    if r.status_code in (401, 402, 403):
        raise _Pause(f"accès refusé ({r.status_code}) : {r.text[:150]}", HOUR, whole_provider=True)
    if r.status_code in (400, 404):
        raise _Pause(f"modèle refusé ({r.status_code}) : {r.text[:150]}", HOUR)
    if r.status_code >= 400:
        raise _Pause(f"a répondu {r.status_code} : {r.text[:150]}", config.LLM_COOLDOWN)
    try:
        answer = (r.json()["choices"][0]["message"]["content"] or "").strip()
    except (KeyError, IndexError, TypeError, ValueError) as e:
        raise _Pause(f"réponse inattendue : {r.text[:150]}", config.LLM_COOLDOWN) from e
    # Un modèle « qui réfléchit » peut épuiser max_tokens avant d'écrire sa réponse
    if not answer:
        raise _Pause("réponse vide", config.LLM_COOLDOWN)
    return answer


def _extractif(hits):
    if not hits:
        return None
    text = hits[0]["text"].split("\n", 1)[-1]
    return text if len(text) < 700 else text[:700].rsplit(" ", 1)[0] + "…"


async def translate_query(text):
    """Traduit une question (derja en lettres latines…) en français pour la recherche ; en cas d'échec, la renvoie telle quelle."""
    messages = [
        {
            "role": "system",
            "content": "Traduis la question de l'utilisateur en français standard, en une seule phrase. "
            "Garde les noms de produits (Sage, Divalto, Bitrix24, Outlook…). Réponds uniquement par la traduction.",
        },
        {"role": "user", "content": text},
    ]
    try:
        out = await generate(messages, [])
    except LLMError:
        return text
    return out if out and len(out) < 500 else text


async def search_query(question, context=""):
    """Transforme une question de visiteur (formules de politesse, fautes, autre langue) en requête de recherche web
    courte et précise, en français, avec le nom du logiciel. En cas d'échec, renvoie la question telle quelle."""
    messages = [
        {
            "role": "system",
            "content": "Écris une requête de recherche web de 4 à 8 mots, en français, pour trouver la réponse à la question "
            "dans l'aide en ligne du logiciel. Commence par le nom exact du logiciel (Sage 100, Sage 50, Divalto "
            "Infinity, Bitrix24, Outlook, Teams, Power BI…), puis l'action et l'objet avec le vocabulaire du logiciel "
            "(dans un ERP : « fiche article » pour un produit, « fiche client », « pièce de vente », « devis »…). "
            "Retire les formules de politesse, corrige les fautes, n'ajoute pas de mots comme « documentation », "
            "« officielle », « tutoriel » ou « guide ». Exemple : « bonjour aidez-moi à créer un article sur divalto » → "
            "« Divalto Infinity créer une fiche article ». Réponds uniquement par la requête, sans guillemets.",
        },
        {"role": "user", "content": f"{context}\nQuestion : {question}".strip()},
    ]
    try:
        out = await generate(messages, [])
    except LLMError:
        return question
    out = (out or "").strip().strip('"«» ').splitlines()[0] if out else ""
    return out if 3 <= len(out) <= 200 else question


async def generate(messages, hits, max_tokens=1500):
    errors = []
    start = time.time()
    for provider, model in chain():
        if provider == "extractif":
            return _extractif(hits)
        if provider not in OPENAI_COMPATIBLES:
            raise LLMError(f"LLM_PROVIDER inconnu : {provider} ({', '.join([*OPENAI_COMPATIBLES, 'extractif'])})")
        now = time.time()
        # Au-delà du temps maximal par question, on ne tente plus de modèle (on passe au secours extractif s'il y en a un)
        remaining = config.LLM_DEADLINE - (now - start)
        if _is_paused(provider, model, now) or remaining < 3:
            continue
        try:
            return await _openai_compatible(provider, model, messages, timeout=min(60, remaining), max_tokens=max_tokens)
        except _Pause as e:
            _paused[(provider, None if e.whole_provider else model)] = time.time() + e.seconds
            log.warning("Modèle %s/%s mis en pause %ds : %s", provider, model, e.seconds, e)
            errors.append(f"{provider}/{model} : {e}")
    raise LLMError(" | ".join(errors) or "Tous les modèles sont en pause (quotas gratuits atteints)")
