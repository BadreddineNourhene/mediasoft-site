"""Réglages du chatbot, lus dans les variables d'environnement (ou le fichier .env)."""

import os
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")

# Modèle d'embeddings multilingue, gratuit, exécuté en local (ONNX, sans GPU) : ~220 Mo
EMBED_MODEL = os.getenv("EMBED_MODEL", "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

# Modèle de langage : groq | gemini | openrouter | nvidia | extractif
# Plusieurs, séparés par des virgules, sont essayés dans l'ordre (ex. « groq,openrouter,nvidia,extractif »)
LLM_PROVIDERS = [p.strip().lower() for p in os.getenv("LLM_PROVIDER", "groq").split(",") if p.strip()]
LLM_PROVIDER = ",".join(LLM_PROVIDERS)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b,qwen/qwen3.8-27b,openai/gpt-oss-20b")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-latest")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "").strip()
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free,nvidia/nemotron-3.5-super-vl:free,nvidia/nemotron-3-ultra-550b-a55b:free,poolside/laguna-s-2.1:free,dots-studio/dots-3-note-preview:free,google/gemma-4-31b-it:free,google/gemma-4-26b-a4b-it:free")
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "").strip()
NVIDIA_MODEL = os.getenv("NVIDIA_MODEL", "openai/gpt-oss-20b,nvidia/nemotron-3-ultra-550b-a55b,minimaxai/minimax-m3.1-flash")
# Chaque *_MODEL peut lister plusieurs modèles séparés par des virgules, essayés dans l'ordre.
# Un modèle en échec (quota, panne) est sauté pendant LLM_COOLDOWN secondes ;
# une question n'attend jamais plus de LLM_DEADLINE secondes avant le secours extractif.
LLM_COOLDOWN = int(os.getenv("LLM_COOLDOWN", "120"))
LLM_DEADLINE = int(os.getenv("LLM_DEADLINE", "60"))

# Recherche web de secours (websearch.py), active seulement avec une clé Tavily ; limitée aux sites officiels
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "").strip()
WEB_SEARCH_DOMAINS = [
    d.strip()
    for d in os.getenv(
        "WEB_SEARCH_DOMAINS",
        "mediasoft.tn,mediasoft.com.tn,sage.com,divalto.com,bitrix24.com,bitrix24.fr,helpdesk.bitrix24.com,"
        "support.microsoft.com,learn.microsoft.com,microsoft.com",
    ).split(",")
    if d.strip()
]

ALLOWED_ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",") if o.strip()]

# Sources de la base de connaissances
SITE_OUT_DIR = (ROOT / os.getenv("SITE_OUT_DIR", "../out")).resolve()
# Tout est regroupé dans base-rag/ : fiches Mediasoft (connaissances/), documentations des éditeurs (*.json),
# index généré par ingest.py (index/)
BASE_DIR = ROOT / "base-rag"
KNOWLEDGE_DIR = BASE_DIR / "connaissances"
INDEX_DIR = BASE_DIR / "index"

# Recherche
TOP_K = int(os.getenv("TOP_K", "8"))
MIN_SCORE = float(os.getenv("MIN_SCORE", "0.25"))
# Score minimal (sens) d'un passage pour afficher son lien « En savoir plus » sous la réponse
MIN_SOURCE_SCORE = float(os.getenv("MIN_SOURCE_SCORE", "0.5"))
# En dessous de ce score (sens) pour le meilleur passage, la base est jugée peu pertinente : recherche web d'emblée
WEB_MIN_SCORE = float(os.getenv("WEB_MIN_SCORE", "0.45"))

# Garde-fous
MAX_QUESTION_CHARS = 600
MAX_HISTORY_MESSAGES = 6
RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "20"))

# Coordonnées proposées quand le chatbot ne sait pas répondre
CONTACT = {
    "formulaire": "https://mediasoft-site.onrender.com/contact",
    "email": "info@mediasoft.tn",
    "tel_tunis": "+216 31 435 825",
    "tel_sousse": "+216 73 822 546",
    "whatsapp": "https://api.whatsapp.com/send?phone=+21652444444",
    "whatsapp_num": "+216 52 444 444",
}
# Message de contact donné quand le chatbot ne sait pas répondre ou pour une demande d'intégration / de développement
CONTACT_MESSAGE = (
    "Merci de contacter l'équipe Mediasoft pour plus d'informations :\n"
    f"- par e-mail : {CONTACT['email']}\n"
    f"- par WhatsApp : {CONTACT['whatsapp_num']} ({CONTACT['whatsapp']})\n"
    f"- via la page Contactez-nous : {CONTACT['formulaire']}"
)
