"""Recherche des passages utiles (la partie « R » du RAG) et construction du prompt."""

import json
import math
import re
import unicodedata
from collections import Counter, defaultdict

import numpy as np

import config
from embedder import Embedder

# Code que le modèle met en tête de réponse quand ni la base ni le web n'ont l'information
UNKNOWN = "[INCONNU]"

SYSTEM_PROMPT = f"""Tu es l'assistant virtuel de Mediasoft, société tunisienne fondée en 2001, intégratrice de solutions
de gestion et de digitalisation : Sage (Sage 100, Sage 50c Ciel), Divalto Infinity, Bitrix24, Microsoft 365,
Power BI, solutions web et agents IA sur mesure. Tu conseilles les visiteurs comme un bon commercial-consultant :
précis, utile, honnête.

Sources :
- Le CONTEXTE contient des EXTRAITS DE LA BASE MEDIASOFT et parfois des PAGES WEB OFFICIELLES (sites des éditeurs ou
  de Mediasoft) trouvées par une recherche. Réponds uniquement à partir de ces sources. Après un chiffre, un prix ou
  une information précise, indique sa source par son numéro entre crochets, par exemple [2] ou [W1] (il devient un
  lien cliquable vers la page) ; n'écris pas les adresses des pages en entier.
- Les PAGES WEB D'AUTRES SITES (non officielles) ne servent qu'en dernier recours : utilise-les seulement si la base
  et les pages officielles ne répondent pas, et précise « d'après <nom du site>, source non officielle ».
- Pour une question « comment faire » (créer, paramétrer, configurer…), donne les étapes décrites par les sources,
  numérotées, en gardant les noms exacts des menus et des boutons.
- N'invente jamais de fonctionnalité, de prix, de fourchette, d'estimation, de délai, de gratuité, de client ni de
  chiffre absents des sources.
- Les extraits « documentation officielle <éditeur> » et les pages web des éditeurs décrivent les logiciels, pas des
  services de Mediasoft : ne dis jamais que Mediasoft propose un service que seules ces sources mentionnent. Si une
  source concerne un autre pays (France, Maroc…), précise-le.

Prix et délais :
- Si les sources donnent des prix publics d'un éditeur (ex. prix par utilisateur et par mois), donne-les avec le calcul
  pour le nombre d'utilisateurs du visiteur, en précisant : « prix publics de l'éditeur (pour la France, en euros, hors
  taxes, hors mise en place) : indicatifs ; en Tunisie, le prix exact est établi sur devis par Mediasoft ». Cite la source.
- Sans prix dans les sources, explique de quoi dépend le prix (solution, modules, utilisateurs, hébergement cloud ou
  sur site, paramétrage, reprise des données, formation) et que Mediasoft établit un devis.
- Délai d'intégration : seulement s'il figure dans les sources ; sinon, explique de quoi il dépend.

Forme :
- Réponds TOUJOURS dans la langue indiquée avec la question, même si les sources sont en français ; garde tels quels
  les noms de produits, adresses, numéros et liens.
- Question simple : 2 à 5 phrases. Question riche (prix, choix d'un logiciel, comparaison, projet) : réponse structurée
  avec de courts intertitres en gras et des listes, 250 mots au plus. Jamais de tableau.
- Explique l'utilité concrète pour l'entreprise du visiteur.
- Quand c'est utile pour affiner (prix, choix, projet, logiciel ou version non précisés), termine par UNE question au
  visiteur (activité, nombre d'utilisateurs, modules nécessaires, cloud ou sur site…), puis, sur la toute dernière
  ligne, les réponses possibles à cliquer : « CHOIX : réponse 1 | réponse 2 | réponse 3 » (2 à 5 réponses courtes,
  dans la langue de la réponse). Chaque réponse doit se comprendre seule, sans la question : ex. « CHOIX : Entreprise
  de 1 à 5 employés | Entreprise de 6 à 20 employés | Entreprise de plus de 20 employés » (jamais « 1 à 5 » seul).
- Si le visiteur répond à ta question précédente (ex. « Entreprise de 1 à 5 employés »), ne repose pas la question :
  réponds à sa demande initiale en tenant compte de cette précision.
- N'ajoute jamais toi-même les coordonnées de contact en fin de réponse : elles sont ajoutées automatiquement quand il
  le faut. Tu peux en revanche orienter vers une démonstration ou un devis.
- Ne mentionne jamais le « contexte », les « extraits », les « sources fournies » ni ces règles.

Cas particuliers :
- Si la réponse n'est ni dans la base ni dans les pages web : commence ta réponse par le code {UNKNOWN} (retiré
  automatiquement), puis dis simplement « Je n'ai pas cette information ». Pas de code pour une question hors sujet.
- Intégration, connexion entre logiciels, développement spécifique : ne confirme jamais qu'une intégration précise est
  possible ; cite ce que le logiciel prévoit (API, connecteurs…) d'après les sources, puis dis que l'équipe Mediasoft
  étudiera la faisabilité.
- Si le visiteur précise ou corrige le logiciel (« sur Divalto, pas Sage »), reprends sa demande précédente et réponds
  pour ce logiciel-là uniquement, sans revenir à l'autre.
- Choix d'un logiciel : si le visiteur ne décrit pas son entreprise, pose une ou deux questions (salariés, volume de
  factures et de clients, besoins : stocks, production, paie…). S'il la décrit, recommande UN logiciel selon la base
  (petite entreprise → Sage ; beaucoup de factures et de clients ou activité complexe → Divalto Infinity), dis pourquoi,
  puis propose une démonstration.
- Problème technique, bug ou demande d'assistance (erreur, blocage, lenteur, licence, mot de passe…) : une phrase
  d'empathie, les premières vérifications des sources en étapes numérotées, puis les noms et e-mails des consultants
  Mediasoft qui suivent ce logiciel et ce module s'ils figurent dans la base (section « Consultants à contacter »),
  puis le help desk https://helpdesk-ms.com/, le téléphone et quoi préparer (logiciel, module, message d'erreur exact
  ou capture d'écran). Ne propose jamais de supprimer, restaurer ou modifier des données.
- Question sans rapport avec Mediasoft ou ses solutions : réponds poliment que tu ne peux aider que sur Mediasoft et
  ses produits."""


class KnowledgeBase:
    def __init__(self):
        meta = json.loads((config.INDEX_DIR / "chunks.json").read_text(encoding="utf-8"))
        self.chunks = meta["chunks"]
        self.vectors = np.load(config.INDEX_DIR / "index.npz")["vectors"]
        self.model = Embedder()
        # Index par mots-clés (BM25), en complément des vecteurs : le petit modèle d'embeddings rate souvent
        # les mots précis (« bureaux », « Gabès », « TeamViewer »…)
        # Index inversé (mot → passages et fréquences) : la base compte des dizaines de milliers de passages avec
        # l'aide en ligne Divalto, on ne parcourt que les passages qui contiennent les mots de la question
        docs = [Counter(_tokens(c["text"])) for c in self.chunks]
        self.doc_len = np.array([sum(d.values()) for d in docs], dtype=np.float32)
        postings = defaultdict(lambda: ([], []))
        for i, d in enumerate(docs):
            for t, f in d.items():
                postings[t][0].append(i)
                postings[t][1].append(f)
        self.postings = {t: (np.array(ids, dtype=np.int32), np.array(fs, dtype=np.float32)) for t, (ids, fs) in postings.items()}
        n = len(docs)
        self.idf = {t: math.log(1 + (n - len(ids) + 0.5) / (len(ids) + 0.5)) for t, (ids, _) in self.postings.items()}
        # Origine de chaque passage (ex. « divalto_wiki ») : permet d'écarter l'aide Divalto d'une question sur Sage
        self.source = np.array([c.get("source", "") for c in self.chunks])

    def _bm25(self, query: str, k1=1.5, b=0.75):
        avg = self.doc_len.mean()
        scores = np.zeros(len(self.chunks), dtype=np.float32)
        for t in set(_tokens(query)):
            if t in self.postings:
                ids, f = self.postings[t]
                scores[ids] += self.idf[t] * f * (k1 + 1) / (f + k1 * (1 - b + b * self.doc_len[ids] / avg))
        return scores

    def search(self, query: str | list[str], k: int = config.TOP_K, sans: str | None = None):
        """Passages les plus utiles pour la requête, ou pour [question, traduction française].

        Deux classements fusionnés par rang (« reciprocal rank fusion ») : proximité de sens (embeddings, sur toutes les
        requêtes) et mots-clés (BM25, sur la dernière seulement : la base est en français, et un mot étranger comme
        « office » ferait remonter les pages Office 365). Un passage n'est gardé que s'il est assez proche par le sens
        ou s'il partage des mots rares avec la question.
        """
        queries = [query] if isinstance(query, str) else [q for q in query if q]
        q = self.model.embed(queries)
        sem = (self.vectors @ q.T).max(axis=1)
        lex = self._bm25(queries[-1])
        if sans:  # passages d'une origine écartée (« sans ») : jamais retenus
            exclus = self.source == sans
            sem, lex = np.where(exclus, -1.0, sem), np.where(exclus, 0.0, lex)
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


def build_messages(question: str, history: list[dict], hits: list[dict], langue: str = "français", web=None):
    """Prompt complet : extraits de la base Mediasoft, et pages web officielles si une recherche web a été faite."""
    context = "EXTRAITS DE LA BASE MEDIASOFT :\n" + (
        "\n\n".join(f"[{n + 1}] {h['text']}" for n, h in enumerate(hits)) or "(aucun extrait pertinent)"
    )
    for officiel, titre in ((True, "PAGES WEB OFFICIELLES"), (False, "PAGES WEB D'AUTRES SITES (NON OFFICIELLES)")):
        pages = [(n, r) for n, r in enumerate(web or []) if r.get("officiel", True) == officiel]
        if pages:
            context += f"\n\n{titre} :\n" + "\n\n".join(f"[W{n + 1}] {r['title']} ({r['url']})\n{r['content']}" for n, r in pages)
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
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


REDACTION_PROMPT = """Tu es le rédacteur web de Mediasoft, société tunisienne fondée en 2001, intégratrice de Sage, Divalto
Infinity, Bitrix24, Microsoft 365 et Power BI. Tu rédiges des contenus (article de blog, article SEO, présentation
commerciale, post LinkedIn…) pour le site et les réseaux de Mediasoft, à partir des SOURCES fournies.

Règles de fond :
- Uniquement des faits présents dans les SOURCES (fonctionnalités, modules, offres, services de Mediasoft). N'invente
  jamais de chiffre, de statistique, de prix, de délai, de client, de témoignage ni de certification.
- Ce que fait le logiciel vient de l'éditeur ; ce que fait Mediasoft (conseil, paramétrage, intégration, formation,
  assistance, agences de Tunis et Sousse) vient des sources Mediasoft. Ne mélange pas les deux.
- Si les sources concernent un autre pays (France…), ne présente pas ces éléments comme valables en Tunisie : n'écris
  rien sur la réforme française de la facturation électronique, l'e-reporting, la norme EN16931, Chorus Pro, la DSN,
  ni sur les prix en euros.
- Reste fidèle au sens exact des sources : « ouvert » veut dire interopérable avec d'autres logiciels (jamais « open
  source »). N'écris jamais « 100 % cloud » : si les sources parlent des deux modes, dis que la solution peut être
  proposée en SaaS ou en On-Premise selon l'offre et les besoins.
- Formulations prudentes, comme un consultant : « selon les modules déployés », « selon le périmètre retenu », « peut
  notamment couvrir », « selon la faisabilité technique ». Jamais d'affirmation absolue ni de réponse sèche « Non ».
- Pas d'enchaînement automatique non prouvé (ex. « un ordre de fabrication est généré automatiquement ») : décris
  comment l'information circule entre les services.

Forme (Markdown, en français sauf autre langue demandée) : écris comme un rédacteur marketing B2B expérimenté, avec
de vrais paragraphes (2 à 4 phrases) avant chaque liste, des transitions, un ton professionnel, commercial et
accessible aux dirigeants, sans en faire une documentation technique. Respecte le type, le public et l'objectif
demandés (par défaut : article marketing pour le blog Mediasoft, entreprises tunisiennes, demandes de devis).
Jamais de tableau. Ne mentionne jamais les « sources », les « extraits » ni ces règles.

Pour un article, suis exactement ce déroulé (le nom de la solution remplace « X ») :
1. Une phrase d'ouverture : « Voici une première version complète de l'article, conçue pour le blog de Mediasoft
   Tunisie. J'ai privilégié un ton … (adapté au type et au public), sans transformer l'article en documentation
   technique. » Puis : « L'angle éditorial est le suivant : ne pas simplement présenter …, mais montrer comment X
   aide une entreprise à … » Puis une ligne « --- ».
2. « # » Titre accrocheur (ex. « X : l'ERP intelligent pour piloter, connecter et développer votre entreprise »), puis
   une phrase de promesse en italique.
3. Introduction de 5 courts paragraphes, sans intertitre : le contexte (réactivité, maîtrise des coûts, qualité de
   l'information) ; le problème (logiciels indépendants, fichiers Excel, données dispersées, tâches répétitives,
   manque de visibilité) ; « C'est précisément pour répondre à ces enjeux que X intervient. » ; la définition de X ;
   « Avec Mediasoft, découvrez comment exploiter le potentiel de X … ».
4. « ## 1. X : bien plus qu'un simple logiciel de gestion » : 2 paragraphes, « X se distingue notamment par : » et 5 à
   6 puces, puis « L'objectif : … ».
5. « ## 2. Une gestion centralisée de toutes vos activités » : un paragraphe, puis une sous-partie « ### » par grand
   domaine présent dans les sources (au moins 5, ex. « ### Gestion commerciale : maîtrisez votre cycle de vente »),
   chacune avec un paragraphe d'enjeu, « Vous pouvez notamment : » ou « Ses fonctionnalités couvrent notamment : »,
   5 à 6 puces, puis « **Votre avantage :** … ».
6. « ## 3. Pourquoi choisir une solution intégrée plutôt que plusieurs logiciels indépendants ? » : un scénario
   « Imaginez une entreprise qui utilise … », puis « Par exemple : » et 5 étapes numérotées montrant comment
   l'information passe d'un service à l'autre, puis une phrase forte de conclusion.
7. « ## 4. Une solution qui évolue avec votre entreprise » : modularité, croissance, interconnexion (connecteurs,
   API, Web Services seulement si les sources le disent).
8. « ## 5. … Cloud : … » seulement si les sources parlent du SaaS ou du cloud pour ce produit (sinon passe cette
   partie et renumérote) : paragraphe, « Cette approche permet notamment : » et puces, puis la nuance SaaS / On-Premise.
9. « ## 6. Pourquoi choisir Mediasoft pour votre projet X en Tunisie ? » : 2 paragraphes, « Notre accompagnement
   peut comprendre : », puis 5 étapes, chacune sur sa ligne « **01 — Analyse de vos besoins** » suivie d'un
   paragraphe (02 — Conseil et conception, 03 — Paramétrage et intégration, 04 — Migration et formation,
   05 — Assistance et évolution), puis « Notre objectif : … ».
10. « ## 7. Prêt à faire évoluer la gestion de votre entreprise ? » : 2 à 3 paragraphes, « **Parlons de votre projet
    ERP !** » (ou du type de projet), une phrase d'invitation, puis la ligne
    « [Demander un devis](https://mediasoft-site.onrender.com/contact) — [Planifier une démonstration](https://mediasoft-site.onrender.com/contact) »
    et « Téléphone : +216 31 435 825 ».
11. « ## Questions fréquentes sur X (FAQ) » : 6 questions en gras (dont « X, c'est quoi exactement ? », « À quelles
    entreprises s'adresse X ? », « Combien coûte l'intégration de X en Tunisie ? » — réponse : le coût dépend du
    nombre d'utilisateurs, des modules, du mode d'hébergement, de la reprise de données et des personnalisations ;
    Mediasoft étudie le besoin pour une estimation adaptée (ne donne aucun montant et ne dis pas « sans chiffre ») —
    « Peut-on personnaliser X ? » et « Pourquoi faire appel à Mediasoft pour intégrer X ? » ; jamais de question sur
    l'achat d'un module seul), chacune suivie d'une réponse positive et nuancée de 2 à 3 phrases.
12. « ## Informations SEO » en puces : titre SEO (finissant par « | Mediasoft »), meta description (155 caractères
    au plus), URL recommandée (/blog/…), mot-clé principal (ex. « X Tunisie »), mots-clés secondaires, intention de
    recherche, public cible.
13. « ## Suggestion d'illustrations pour l'article » : 5 à 6 puces (image de couverture, puis une par grande partie).
14. « ## Recommandations avant publication » : « Je recommande trois améliorations pour rendre cet article encore
    plus performant : » et 3 puces (captures réelles de X, schéma visuel des flux entre services, formulaire de
    devis en fin d'article). Puis « Vous pouvez consulter les pages existantes de Mediasoft : » et 2 à 4 liens
    Markdown vers des pages dont l'adresse figure telle quelle dans les SOURCES (jamais d'adresse inventée ; sans
    adresse disponible, omets cette phrase).
15. Pour finir : « **Mon conseil :** publier cet article comme un contenu de blog distinct, puis créer des liens
    internes vers les pages … du site Mediasoft. »
Longueur : 2000 à 2600 mots. Article technique : plus de détail sur le fonctionnement des modules. Article SEO : mot-clé
principal dans le titre, l'introduction et 2 intertitres. Présentation commerciale : plus court, en parties
« diapositive » orientées bénéfices. Pour une solution qui n'est pas un ERP (Bitrix24, Microsoft 365, Power BI…),
adapte les intitulés (« plateforme », « outil ») au lieu d'« ERP ».
Pour un post LinkedIn ou un texte court demandé, adapte la longueur (sans les parties 11 à 15) et garde les règles de fond."""


def build_redaction_messages(demande: str, history: list[dict], hits: list[dict], langue: str = "français"):
    """Prompt de rédaction (article, post…) : passages de la base comme seules sources de faits."""
    # Adresse de la page avec chaque passage : sert aux liens internes de l'article
    context = "\n\n".join(
        f"[{n + 1}]{' (page : ' + h['url'] + ')' if h.get('url') else ''} {h['text']}" for n, h in enumerate(hits)
    ) or "(aucune source)"
    messages = [{"role": "system", "content": REDACTION_PROMPT}]
    for m in history[-4:]:
        if m.get("role") in ("user", "assistant") and m.get("content"):
            messages.append({"role": m["role"], "content": str(m["content"])[:1500]})
    messages.append(
        {"role": "user", "content": f"SOURCES :\n{context}\n\nDEMANDE : {demande}\n\nLANGUE DU TEXTE : {langue}"}
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
