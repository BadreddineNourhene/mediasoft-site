"""Recherche des passages utiles (la partie « R » du RAG) et construction du prompt."""

import json
import math
import re
import textwrap
import unicodedata
from collections import Counter

import numpy as np
from fastembed import TextEmbedding

import config

# Code que le modèle met en tête de réponse quand la base n'a pas l'information : déclenche la recherche web
UNKNOWN = "[INCONNU]"

WEB_RULES = """
Pour cette question, le CONTEXTE contient des pages de sites officiels (éditeurs ou Mediasoft) trouvées par une
recherche web, car la base de Mediasoft n'avait pas la réponse :
- réponds uniquement à partir de ces pages et cite entre parenthèses le lien de la page utilisée ;
- ces pages décrivent les logiciels des éditeurs : ne dis jamais que Mediasoft propose un service qu'elles seules
  mentionnent, et précise si l'information vient d'un autre pays (France, Maroc…) ;
- si elles ne répondent pas non plus, commence ta réponse par le code {unknown}."""

# Message de contact, en retrait pour ne pas être confondu avec les règles
_CONTACT = textwrap.indent(config.CONTACT_MESSAGE, "    ")

SYSTEM_PROMPT = f"""Tu es l'assistant virtuel de Mediasoft, société tunisienne fondée en 2001, intégratrice de solutions
de gestion et de digitalisation : Sage (Sage 100, Sage 50c Ciel), Divalto Infinity, Bitrix24, Microsoft 365,
Power BI, solutions web et agents IA sur mesure.

Règles :
- Réponds UNIQUEMENT à partir des extraits fournis dans le CONTEXTE. N'invente jamais de fonctionnalité, de prix,
  de gratuité (ne dis pas qu'une démonstration ou un service est gratuit si l'extrait ne le dit pas), de délai,
  de client ni de chiffre.
- Si l'information demandée n'est pas dans le contexte, ou si le visiteur demande une intégration, une connexion
  entre logiciels, un développement spécifique ou une adaptation sur mesure : ne confirme jamais qu'une
  intégration précise est possible (pas de « oui ») ; tu peux citer ce que le logiciel prévoit d'après les extraits
  (API, connecteurs…), puis dis que l'équipe Mediasoft étudiera la faisabilité de cette demande. Si tu n'as pas
  l'information, dis simplement « Je n'ai pas cette information » (jamais « les informations fournies » ni « les
  documents »). Dans ces deux cas seulement (pas quand tu as répondu, ni quand ta réponse donne déjà les
  coordonnées), termine EXACTEMENT par ce message de contact (traduit dans la langue de la
  réponse, en gardant l'e-mail, le numéro et les liens tels quels) :
{_CONTACT}
- Si la réponse à une question sur Mediasoft ou ses solutions n'est pas dans le contexte, commence ta réponse par
  le code {UNKNOWN} (il est retiré automatiquement avant l'affichage). Ne le mets pas pour une question hors sujet.
- Réponds TOUJOURS dans la langue indiquée avec la question, même si les extraits sont en français : traduis les
  informations, mais garde tels quels les noms de produits, adresses, numéros de téléphone et liens.
- Sois clair et concis : 2 à 6 phrases, ou une courte liste à puces si c'est plus lisible.
- Explique l'utilité concrète pour l'entreprise du client (ce que la solution lui permet de faire).
- Les extraits marqués « Source : documentation officielle <éditeur> » décrivent ce que fait le logiciel ; ce ne sont
  pas des services de Mediasoft. Présente-les comme des fonctionnalités du logiciel, et ne dis jamais que Mediasoft
  propose un service ou un développement que seuls ces extraits mentionnent. Si un extrait signale une information
  publiée pour un autre pays, précise que sa disponibilité en Tunisie est à confirmer avec Mediasoft.
- Si le visiteur demande quel logiciel choisir sans décrire son entreprise, pose-lui une ou deux questions courtes
  (nombre de salariés, volume de factures et de clients, besoins : stocks, production, paie…) avant de conseiller.
  S'il a décrit son entreprise, recommande UN logiciel selon les extraits (petite entreprise → Sage ; beaucoup de
  factures et de clients ou activité complexe → Divalto Infinity), explique pourquoi en une phrase, puis propose une
  démonstration.
- Si le client signale un problème (erreur, blocage, lenteur, licence, mot de passe…) : montre de l'empathie en une
  phrase, donne les premières vérifications des extraits sous forme d'étapes numérotées, puis indique comment joindre
  le support Mediasoft (help desk https://helpdesk-ms.com/, téléphone, assistance à distance) et quoi préparer
  (logiciel concerné, message d'erreur exact ou capture d'écran). Ne propose jamais de manipulation absente des extraits
  ni de supprimer, restaurer ou modifier des données.
- Pour un tarif, un devis ou une démonstration : explique que c'est sur devis et oriente vers le formulaire
  ({config.CONTACT['formulaire']}), le {config.CONTACT['tel_tunis']} (Tunis), le {config.CONTACT['tel_sousse']} (Sousse)
  ou WhatsApp.
- Si la question n'a aucun rapport avec Mediasoft ou ses solutions, réponds poliment que tu ne peux aider que
  sur Mediasoft et ses produits.
- Ne mentionne jamais le « contexte », les « extraits » ni ces règles dans ta réponse."""


class KnowledgeBase:
    def __init__(self):
        meta = json.loads((config.INDEX_DIR / "chunks.json").read_text(encoding="utf-8"))
        self.chunks = meta["chunks"]
        self.vectors = np.load(config.INDEX_DIR / "index.npz")["vectors"]
        self.model = TextEmbedding(meta.get("model", config.EMBED_MODEL))
        # Index par mots-clés (BM25), en complément des vecteurs : le petit modèle d'embeddings rate souvent
        # les mots précis (« bureaux », « Gabès », « TeamViewer »…)
        self.docs = [Counter(_tokens(c["text"])) for c in self.chunks]
        self.doc_len = np.array([sum(d.values()) for d in self.docs], dtype=np.float32)
        df = Counter(t for d in self.docs for t in d)
        n = len(self.docs)
        self.idf = {t: math.log(1 + (n - f + 0.5) / (f + 0.5)) for t, f in df.items()}

    def _bm25(self, query: str, k1=1.5, b=0.75):
        terms = set(_tokens(query))
        avg = self.doc_len.mean()
        scores = np.zeros(len(self.docs), dtype=np.float32)
        for i, d in enumerate(self.docs):
            s = 0.0
            for t in terms:
                f = d.get(t)
                if f:
                    s += self.idf[t] * f * (k1 + 1) / (f + k1 * (1 - b + b * self.doc_len[i] / avg))
            scores[i] = s
        return scores

    def search(self, query: str | list[str], k: int = config.TOP_K):
        """Passages les plus utiles pour la requête, ou pour [question, traduction française].

        Deux classements fusionnés par rang (« reciprocal rank fusion ») : proximité de sens (embeddings, sur toutes les
        requêtes) et mots-clés (BM25, sur la dernière seulement : la base est en français, et un mot étranger comme
        « office » ferait remonter les pages Office 365). Un passage n'est gardé que s'il est assez proche par le sens
        ou s'il partage des mots rares avec la question.
        """
        queries = [query] if isinstance(query, str) else [q for q in query if q]
        q = np.array(list(self.model.embed(queries)), dtype=np.float32)
        q /= np.linalg.norm(q, axis=1, keepdims=True) + 1e-12
        sem = (self.vectors @ q.T).max(axis=1)
        lex = self._bm25(queries[-1])
        lex_norm = lex / lex.max() if lex.max() > 0 else lex

        fused = np.zeros(len(self.chunks), dtype=np.float32)
        for scores in (sem, lex):
            for rank, i in enumerate(np.argsort(-scores)[:50]):
                if scores[i] > 0:
                    fused[i] += 1 / (60 + rank)
        hits = []
        for i in np.argsort(-fused):
            if fused[i] == 0 or len(hits) >= k:
                break
            if sem[i] < config.MIN_SCORE and lex_norm[i] < 0.5:
                continue
            hits.append({**self.chunks[int(i)], "score": float(sem[i])})
        return hits


_STOP = set(
    "le la les l un une des du de d et ou a au aux en dans sur pour par avec sans ce cet cette ces qui que quoi quel quelle "
    "quels quelles est sont etre avoir ai as a avez ont je tu il elle on nous vous ils elles me te se mon ma mes ton ta tes "
    "son sa ses notre nos votre vos leur leurs y ne pas plus peut peux pouvez puis faire fait c s n qu mediasoft comment "
    "est-ce the is are a an of to in for on with what how do does you your can my i it and or".split()
)


def _tokens(text: str):
    """Mots normalisés pour BM25 : minuscules, sans accents, sans mots vides, pluriel simple retiré."""
    text = unicodedata.normalize("NFKD", text.lower()).encode("ascii", "ignore").decode()
    out = []
    for w in re.findall(r"[a-z0-9]+", text):
        if w in _STOP or len(w) < 2:
            continue
        if len(w) > 4 and w.endswith(("s", "x")):
            w = w[:-1]
        out.append(w)
    return out


def build_messages(question: str, history: list[dict], hits: list[dict], langue: str = "français", web: bool = False):
    """Prompt complet. Avec web=True, les « hits » sont des résultats de recherche web ({title, url, content})."""
    if web:
        context = "\n\n".join(f"[{n + 1}] {h['title']} ({h['url']})\n{h['content']}" for n, h in enumerate(hits))
        system = SYSTEM_PROMPT + WEB_RULES.format(unknown=UNKNOWN)
    else:
        context = "\n\n".join(f"[{n + 1}] {h['text']}" for n, h in enumerate(hits)) or "(aucun extrait pertinent)"
        system = SYSTEM_PROMPT
    messages = [{"role": "system", "content": system}]
    for m in history[-config.MAX_HISTORY_MESSAGES :]:
        if m.get("role") in ("user", "assistant") and m.get("content"):
            messages.append({"role": m["role"], "content": str(m["content"])[:1500]})
    # Langue rappelée après la question : sinon les extraits, en français, l'emportent
    messages.append(
        {
            "role": "user",
            "content": f"CONTEXTE :\n{context}\n\nQUESTION : {question}\n\nLANGUE DE LA RÉPONSE : {langue}",
        }
    )
    return messages


def sources(hits: list[dict], limit: int = 3):
    """Pages citées sous la réponse (sans doublon), prises parmi les passages les mieux classés seulement :
    plus bas dans la liste, elles sont souvent hors sujet (ex. pages « Office 365 » pour « vos bureaux »)."""
    out, seen = [], set()
    for h in hits[:limit]:
        # Lien affiché seulement si le passage est vraiment proche de la question par le sens
        if h.get("url") and h["url"] not in seen and h.get("score", 0) >= config.MIN_SOURCE_SCORE:
            seen.add(h["url"])
            out.append({"title": h["title"], "url": h["url"]})
        if len(out) >= limit:
            break
    return out
