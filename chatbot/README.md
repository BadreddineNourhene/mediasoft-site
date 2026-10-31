# Chatbot Mediasoft (RAG, Python)

Assistant qui répond aux questions des visiteurs du site sur Mediasoft et ses solutions (Sage, Divalto, Bitrix24,
Microsoft 365, Power BI, solutions web et agents IA), uniquement à partir du contenu du site et des fichiers
du dossier `base-rag/connaissances/`.

## Fonctionnement

1. **Indexation** (`ingest.py`) : les pages du site (`../out`, export du site) et les fichiers `base-rag/connaissances/*.md`
   sont découpés en passages, puis transformés en vecteurs par un modèle d'embeddings **gratuit et local**
   (`paraphrase-multilingual-MiniLM-L12-v2`, sans GPU). Résultat : `base-rag/index/index.npz` et `base-rag/index/chunks.json`.
   Le modèle est découpé par `base-rag/export_model.py` (`base-rag/model/`) et exécuté par `embedder.py` : sa table de
   vocabulaire reste sur le disque et le découpage en mots passe par SentencePiece, si bien que le chatbot complet
   tient en ~210 Mo de mémoire (au lieu de ~630 Mo avec fastembed), sous la limite de 512 Mo de Render gratuit.
2. **Recherche** (`rag.py`) : pour chaque question, les 8 passages les plus utiles sont retrouvés en combinant le sens
   (embeddings) et les mots-clés (BM25), qui rattrapent les mots précis (« bureaux », « Gabès », « TeamViewer »).
   Hors français, la question est d'abord traduite en français, car la base est en français.
3. **Réponse** (`llm.py`) : un modèle de langage **gratuit** rédige la réponse à partir de ces passages seulement.
4. **API** (`app.py`, FastAPI) : `POST /api/chat`, appelée par la bulle « Une question ? » du site
   (`../src/components/ChatBot.tsx`).

## Choix du modèle de langage (`LLM_PROVIDER` dans `.env`)

| Valeur | Modèle | Ce qu'il faut |
|---|---|---|
| `groq` | GPT-OSS 120B via l'API gratuite de Groq | Une clé gratuite sur https://console.groq.com/keys, à mettre dans `GROQ_API_KEY` |
| `gemini` | Gemini Flash (dernière version) via l'API gratuite de Google | Une clé gratuite sur https://aistudio.google.com/apikey, dans `GEMINI_API_KEY` |
| `openrouter` | Nemotron 3 Ultra 550B, gratuit sur OpenRouter (suffixe `:free`) | Une clé gratuite sur https://openrouter.ai/keys, dans `OPENROUTER_API_KEY` |
| `nvidia` | MiniMax M3.1 Flash, gratuit sur NVIDIA (~20 s par réponse) | Une clé gratuite sur https://build.nvidia.com, dans `NVIDIA_API_KEY` |
| `extractif` | Aucun : renvoie le passage le plus pertinent | Rien (tests, ou secours si le modèle est indisponible) |

Passer de l'un à l'autre : changer `LLM_PROVIDER` dans `.env`, puis redémarrer l'API. Plusieurs valeurs séparées
par des virgules (ex. `groq,openrouter,nvidia,extractif`) sont essayées dans l'ordre : si un modèle atteint son
quota gratuit ou tombe en panne, le suivant répond. Un fournisseur sans clé est simplement sauté.

`GROQ_MODEL`, `GEMINI_MODEL`, `OPENROUTER_MODEL` et `NVIDIA_MODEL` acceptent chacun plusieurs modèles séparés par des
virgules (13 modèles gratuits configurés, du plus rapide au plus lent). Un modèle qui atteint son quota ou échoue est mis
en pause `LLM_COOLDOWN` secondes (120 par défaut ; 1 h si le modèle n'existe plus ou si la clé est refusée), puis
réessayé. Une question n'attend jamais plus de `LLM_DEADLINE` secondes (60) avant le secours `extractif`.
`/api/health` liste les modèles et ceux en pause.

Quotas gratuits : chez Groq, chaque modèle a son propre quota (3 modèles = 3 quotas) ; chez OpenRouter, la limite
(~50 questions par jour sans crédit acheté) est commune à tous les modèles `:free` du compte ; chez NVIDIA, la limite
(~40 questions par minute) est commune au compte.

## Recherche web de secours (`websearch.py`)

Quand la base ne contient pas la réponse (le modèle commence par `[INCONNU]` ou écrit « je n'ai pas cette
information »), l'API lance une recherche web **limitée aux sites officiels** (`WEB_SEARCH_DOMAINS` : Mediasoft, Sage,
Divalto, Bitrix24, Microsoft), puis le modèle répond à partir des pages trouvées en citant leur lien ; elles s'affichent
sous la réponse. Si rien n'est trouvé, le visiteur reçoit le message de contact (`CONTACT_MESSAGE` dans `config.py`).

- Service : Tavily, 1 000 recherches gratuites par mois. Clé sur https://app.tavily.com, dans `TAVILY_API_KEY`.
  Sans clé, la recherche web est désactivée et rien d'autre ne change.
- Une même question ne consomme le quota qu'une fois par jour (cache en mémoire).
- Les réponses venues du web décrivent les logiciels des éditeurs : le chatbot ne les présente pas comme des services
  de Mediasoft et signale les informations publiées pour un autre pays.

## Langues

Le chatbot répond dans la langue de chaque question (français, anglais, arabe, derja tunisienne en lettres arabes ou
latines, espagnol, allemand, italien, turc…), même si la base de connaissances est en français. `langue.py` détecte la
langue et l'impose au modèle ; pour une question sans langue claire (« Sage 100 ? »), il suit la langue du navigateur
envoyée par le site (`lang`). Les messages fixes (information introuvable, assistant indisponible) existent en français,
anglais et arabe. La bulle du site s'affiche en français, anglais ou arabe (de droite à gauche) selon le navigateur.

## Installation et lancement (Windows)

```bash
cd chatbot
python -m pip install -r requirements.txt
copy .env.example .env          # puis renseigner LLM_PROVIDER et GROQ_API_KEY (et les autres clés)
python ingest.py                # (re)construit la base de connaissances
python -m uvicorn app:app --port 8010
```

- Test : http://127.0.0.1:8010/api/health et la documentation interactive http://127.0.0.1:8010/api/docs
- Côté site : `.env.local` (à la racine du site) contient `NEXT_PUBLIC_CHATBOT_URL=http://127.0.0.1:8010`,
  puis `npm run build`. Sans cette variable, la bulle n'apparaît pas.

## Mettre à jour les connaissances

- Documentations officielles des éditeurs (Sage, Divalto, Bitrix24, Microsoft 365, Power BI) : base structurée dans
  `base-rag/` (voir `base-rag/README.md`). Après modification : `python base-rag/build_base.py` puis `python ingest.py`.

- Le site change : `npm run build` à la racine du site, puis `python ingest.py` ici, puis redémarrer l'API.
- Ajouter une information (offre, FAQ, horaires…) : écrire un fichier `.md` dans `base-rag/connaissances/`
  (titres `#` et `##`, phrases complètes), puis `python ingest.py`.
- Écrire de préférence une section `##` par question, formulée comme un visiteur la poserait (« Où se trouvent vos
  bureaux ? »), avec une réponse courte et complète : c'est ce qui se retrouve le mieux.
- Fichiers actuels : `mediasoft.md` (société, coordonnées), `questions-visiteurs.md` (questions générales sur la société
  et chaque produit), `faq-clients.md` (choix, démo, devis, déplacements), `sage-choisir.md` (offres Sage),
  `support-et-assistance.md` (help desk, TeamViewer, formation), `problemes-frequents.md` (premières vérifications par
  logiciel), `web-et-ia.md` (sites, applications, agents IA).

## Mise en ligne

- **Aujourd'hui : en local seulement.** Le chatbot tourne sur le poste (`Lancer le chatbot et le site.bat`, port 8010) ;
  le site publié sur Render (mediasoft-site.onrender.com) n'affiche pas la bulle : `ChatBot.tsx` ne l'affiche que si
  `NEXT_PUBLIC_CHATBOT_URL` pointe vers 127.0.0.1 / localhost.
- **Pour le remettre en ligne plus tard** (Render gratuit ou autre hébergeur) : créer un service web Python, dossier
  `chatbot/`, commande `uvicorn app:app --host 0.0.0.0 --port $PORT`, variables du fichier `.env` ; puis, dans le service
  du site, mettre `NEXT_PUBLIC_CHATBOT_URL=https://<adresse-de-l-api>` et `NEXT_PUBLIC_CHATBOT_ONLINE=1`, et relancer
  son déploiement. Le service gratuit de Render s'endort après 15 min sans visite (première question ~1 minute).
- **Serveur Mediasoft** : lancer `uvicorn app:app --host 0.0.0.0 --port 8000` (service Windows ou tâche planifiée),
  exposé en HTTPS (proxy inverse IIS), et ajouter le domaine du site dans `ALLOWED_ORIGINS`.

## Garde-fous

- Réponses limitées au contenu de Mediasoft ; pas de prix inventés (renvoi vers un devis).
- Questions de 600 caractères au plus ; 20 questions par minute et par adresse IP.
- La bulle indique que les réponses sont générées par IA.
- Avec Groq, Gemini, OpenRouter ou NVIDIA, les questions des visiteurs sont envoyées à ce service.
