"""Détection de la langue de la question, pour imposer la langue de la réponse et traduire les messages fixes.

Simple et sans dépendance : écriture arabe, mots outils de chaque langue, marqueurs de la derja tunisienne
écrite en lettres latines (chnowa, mta3, 3andkom…). Si rien n'est sûr, le modèle reprend la langue de la question
et les messages fixes prennent la langue du navigateur envoyée par le site.
"""

import re

import config

# code : (nom donné au modèle, mots outils)
LANGUES = {
    "fr": (
        "français",
        "le la les des un une est et pour que quel quelle quels comment combien vous avec sur dans qui quoi il elle ils "
        "peut peux puis plusieurs mon ma mes notre nos votre vos ne pas du au aux ce cette ces faire fait je j nous "
        "est-ce estce avez avoir sont mais ou où entre logiciel société entreprise",
    ),
    "en": ("English", "the is are what which how does do you your can for with and of to my much price"),
    "es": ("español", "el los las es qué cuál cómo cuánto usted para con una por precio hola"),
    "de": ("Deutsch", "der die das ist was wie welche sie und für mit ein eine kostet ich"),
    "it": ("italiano", "il lo gli è che cosa come quanto quale quali voi per con una sono prezzo offre"),
}
DERJA = re.compile(
    r"\b(chnowa|chnoua|chniya|chnia|chneya|chbih|chbik|kifech|kifeh|nheb|famma|fama|barcha|bech|chkoun|kima|yesser|behi|"
    r"ahla|aslema|mochkla|mouchkla|mochkel|mafamech|mta3|mte3|nsit|nsitt|n7eb|ena|enti|yezzi|tawa|taw)\b",
    re.I,
)
# Derja écrite avec des chiffres (3 = ع, 5 = خ, 7 = ح, 9 = ق) : 3andi, y7elech, mta3, ma ye5demch, 9adech…
# En minuscules seulement (pas de sigles comme W3C), et au moins deux lettres avant le chiffre (pas « i7 », « i5 »)
DERJA_CHIFFRES = re.compile(r"\b(?:[a-z]{2,}[3579][a-z0-9]*|[3579][a-z]{2,}[a-z0-9]*)\b")
ARABE = re.compile(r"[؀-ۿ]")
MOTS = re.compile(r"[a-zà-ÿñß]+", re.I)

NOMS = {code: nom for code, (nom, _) in LANGUES.items()} | {
    "ar": "arabe (en derja tunisienne si la question est en derja ; jamais en darija marocaine ni en dialecte du Golfe)",
    "tn": "derja TUNISIENNE écrite en lettres latines comme la question (mots tunisiens : « mta3 », « barcha », "
    "« chnowa », « tnajem », « yelzmek » ; jamais de darija marocaine comme « dyal », « bghiti », « wakha »)",
}
INCONNUE = "la langue exacte de la QUESTION, pas celle du contexte"


def detecter(question: str) -> str:
    """Code de langue de la question : fr, en, es, de, it, ar (écriture arabe), tn (derja en lettres latines), ou "" si incertain."""
    if ARABE.search(question):
        return "ar"
    if DERJA.search(question) or DERJA_CHIFFRES.search(question):
        return "tn"
    mots = [m.lower() for m in MOTS.findall(question)]
    scores = {code: sum(m in set(liste.split()) for m in mots) for code, (_, liste) in LANGUES.items()}
    code, score = max(scores.items(), key=lambda kv: kv[1])
    return code if score and list(scores.values()).count(score) == 1 else ""


def nom(code: str, navigateur: str = "") -> str:
    """Langue de réponse donnée au modèle ; si la question n'en a pas (« Sage 100 ? »), celle du navigateur."""
    if code:
        return NOMS[code]
    nav = (navigateur or "").lower()[:2]
    return f"{INCONNUE} ; si la question n'a pas de langue claire (un simple nom de produit), {NOMS.get(nav, 'français')}"


def interface(code: str, navigateur: str = "") -> str:
    """Langue des messages fixes : celle de la question, sinon celle du navigateur, sinon le français."""
    nav = (navigateur or "").lower()[:2]
    return code or (nav if nav in NOMS else "fr")


# Messages fixes (le modèle n'intervient pas) : français pour le français et la derja, anglais pour les langues sans traduction
_C = config.CONTACT
# Bloc de contact ajouté par le code (jamais par le modèle) : réponse inconnue, prix, devis, délai, intégration
_CONTACT = {
    "fr": config.CONTACT_MESSAGE,
    "en": "Please contact the Mediasoft team for more details:\n"
    f"- by e-mail: {_C['email']}\n- on WhatsApp: {_C['whatsapp_num']} ({_C['whatsapp']})\n"
    f"- through the Contact us page: {_C['formulaire']}",
    "ar": "يرجى التواصل مع فريق ميدياسوفت لمزيد من المعلومات:\n"
    f"- عبر البريد الإلكتروني: {_C['email']}\n- عبر واتساب: {_C['whatsapp_num']} ({_C['whatsapp']})\n"
    f"- عبر صفحة اتصل بنا: {_C['formulaire']}",
}
MESSAGES = {
    "fr": {
        "contact": _CONTACT["fr"],
        "quel_logiciel": "Avec plaisir ! Sur quel logiciel souhaitez-vous le faire : {logiciels} ? "
        "La manipulation est différente dans chacun.",
        "introuvable": "Je n'ai pas trouvé cette information. " + _CONTACT["fr"],
        "indisponible": "L'assistant est momentanément indisponible. ",
        "trop": "Trop de questions en peu de temps, merci de patienter une minute.",
    },
    "en": {
        "contact": _CONTACT["en"],
        "quel_logiciel": "Happy to help! In which software do you want to do it: {logiciels}? The steps differ in each one.",
        "introuvable": "I couldn't find this information. " + _CONTACT["en"],
        "indisponible": "The assistant is temporarily unavailable. ",
        "trop": "Too many questions in a short time, please wait a minute.",
    },
    "ar": {
        "contact": _CONTACT["ar"],
        "quel_logiciel": "بكل سرور! في أي برنامج تريد القيام بذلك: {logiciels}؟ تختلف الخطوات من برنامج إلى آخر.",
        "introuvable": "لم أجد هذه المعلومة. " + _CONTACT["ar"],
        "indisponible": "المساعد غير متاح حاليًا. ",
        "trop": "عدد كبير من الأسئلة في وقت قصير، يرجى الانتظار دقيقة.",
    },
}

# Questions commerciales (prix, devis, délai, intégration) : recherche web systématique et bloc de contact en fin de
# réponse. Français, anglais, arabe, derja.
COMMERCIAL = re.compile(
    r"prix|tarif|co[uû]t|combien|budget|devis|abonnement|licen[cs]e|d[ée]lai|dur[ée]e|int[ée]gr|connect|relier|"
    r"price|pricing|cost|how much|quote|budget|subscription|deadline|how long|integrat|"
    r"9adech|9addech|9adeh|thaman|soum|"
    r"سعر|أسعار|ثمن|تكلفة|بكم|كم يكلف|عرض سعر|مدة|ربط|تكامل",
    re.I,
)


_OU = {"fr": " ou ", "en": " or ", "ar": " أو "}
# Objets que Bitrix24 sait aussi créer dans son CRM ; les autres (article, stock, écriture…) relèvent des ERP seulement
_CRM = re.compile(r"devis|facture|client|produit|quote|invoice|customer|product", re.I)


def quel_logiciel(question: str, code: str) -> tuple[str, dict]:
    """Question de précision « sur quel logiciel ? », avec seulement les logiciels où cette manipulation existe,
    et les mêmes logiciels en boutons (un clic envoie le nom du logiciel)."""
    logiciels = ["Sage 100", "Sage 50 (Ciel)", "Divalto Infinity"] + (["Bitrix24"] if _CRM.search(question) else [])
    code = "fr" if code == "tn" else code
    ou = _OU.get(code, _OU["en"])
    texte = ("، " if code == "ar" else ", ").join(logiciels[:-1]) + ou + logiciels[-1]
    return MESSAGES.get(code, MESSAGES["en"])["quel_logiciel"].format(logiciels=texte), {"questions": [{"options": logiciels}]}



# Assistant de rédaction (comme ChatGPT) : proposition de plan, puis type, public et objectif à choisir avant d'écrire
# Par solution : titre proposé et domaines fonctionnels du plan
_PLAN = {
    "Divalto Infinity": ("un ERP complet pour piloter et développer votre entreprise",
                         ["Gestion commerciale", "Gestion des stocks et des achats", "Comptabilité et finance",
                          "Production et GPAO", "CRM et relation client", "Reporting et tableaux de bord"]),
    "Sage (Sage 100)": ("une gestion complète pour piloter votre entreprise en toute sérénité",
                        ["Gestion commerciale", "Comptabilité", "Trésorerie et moyens de paiement",
                         "Immobilisations", "Reporting et tableaux de bord"]),
    "Sage 50 (Ciel)": ("la gestion et la comptabilité simplifiées pour les petites entreprises",
                       ["Comptabilité", "Devis et factures", "Suivi des règlements et trésorerie", "Tableaux de bord"]),
    "Bitrix24": ("le CRM et l'espace collaboratif pour vendre et travailler ensemble",
                 ["CRM et pipeline commercial", "Tâches et projets", "Communication (chat, visioconférence)",
                  "Automatisation des processus", "Sites et formulaires"]),
    "Microsoft 365": ("les outils de travail et de collaboration de l'entreprise moderne",
                      ["Messagerie Outlook", "Microsoft Teams", "OneDrive et SharePoint",
                       "Word, Excel et PowerPoint", "Sécurité et administration"]),
    "Power BI": ("transformer les données de votre entreprise en décisions",
                 ["Connexion à vos sources de données", "Tableaux de bord interactifs", "Rapports et indicateurs",
                  "Partage et collaboration"]),
    "Mediasoft": ("votre partenaire pour digitaliser la gestion de votre entreprise",
                  ["Solutions de gestion Sage et Divalto", "CRM et collaboration (Bitrix24, Microsoft 365)",
                   "Business intelligence avec Power BI", "Applications web et agents IA"]),
}
_SUJETS = ["Divalto Infinity", "Sage 100", "Sage 50 (Ciel)", "Bitrix24", "Microsoft 365", "Power BI", "Mediasoft"]
_ASSISTANT = {
    "fr": {
        "sujet": "Avec plaisir ! Sur quelle solution souhaitez-vous l'article ?",
        "plan": "Bien sûr ! Je peux vous accompagner dans la création d'un article professionnel et marketing sur "
        "**{l}**, destiné au site web de Mediasoft.\n\n"
        "L'objectif sera de présenter {l} de manière attractive, d'expliquer ses avantages pour les entreprises et "
        "de valoriser l'expertise de Mediasoft dans son intégration.\n\n"
        "### Proposition de structure de l'article\n"
        "**Titre principal :** {l} : {titre}\n\n"
        "1. **Introduction** – Les enjeux de la gestion d'entreprise et la nécessité d'un outil intégré.\n"
        "2. **Qu'est-ce que {l} ?** – Présentation de la solution.\n"
        "3. **Les fonctionnalités principales**\n{domaines}\n"
        "4. **Les avantages de {l}** – Centralisation des données, automatisation, productivité et visibilité.\n"
        "5. **À quelles entreprises s'adresse {l} ?**\n"
        "6. **Pourquoi choisir Mediasoft pour intégrer {l} ?** – Conseil, paramétrage, déploiement, formation et "
        "accompagnement.\n"
        "7. **Conclusion et appel à l'action** – Demander une démonstration ou un devis.\n\n"
        "Pour commencer, j'aimerais préciser votre objectif.",
        "questions": [
            ("1. Quel type d'article souhaitez-vous ?", ["Article marketing pour le blog Mediasoft", "Article technique détaillé",
                                                        "Article SEO pour Google", "Présentation commerciale"]),
            ("2. Public cible", ["Entreprises tunisiennes (PME et grandes entreprises)", "Dirigeants et directeurs généraux",
                                 "Responsables financiers et informatiques", "Tous les professionnels"]),
            ("3. Objectif principal", ["Présenter {l} et générer des demandes de devis", "Améliorer le référencement Google (SEO)",
                                       "Expliquer les fonctionnalités et les avantages"]),
        ],
        "conseil": "**Mon conseil :** créer un article qui combine marketing, expertise métier et SEO, avec un contenu "
        "original, des illustrations et des appels à l'action pour transformer les visiteurs du site Mediasoft en prospects.",
        "submit": "Créer mon article",
        "template": "Créons l'article {l} pour Mediasoft. Type : {{0}}. Public : {{1}}. Objectif : {{2}}. "
        "Rédige un article professionnel, original et optimisé SEO.",
    },
    "en": {
        "sujet": "Happy to help! Which solution should the article be about?",
        "plan": "Of course! I can help you create a professional marketing article about **{l}** for the Mediasoft "
        "website.\n\nThe goal is to present {l} attractively, explain its benefits for companies and highlight "
        "Mediasoft's integration expertise.\n\n"
        "### Suggested article structure\n"
        "**Main title:** {l}: {titre}\n\n"
        "1. **Introduction** – Business management challenges and the need for an integrated tool.\n"
        "2. **What is {l}?** – Presentation of the solution.\n"
        "3. **Main features**\n{domaines}\n"
        "4. **Benefits of {l}** – Centralised data, automation, productivity and visibility.\n"
        "5. **Which companies is {l} for?**\n"
        "6. **Why choose Mediasoft to implement {l}?** – Consulting, set-up, deployment, training and support.\n"
        "7. **Conclusion and call to action** – Request a demo or a quote.\n\n"
        "To start, I'd like to clarify your goal.",
        "questions": [
            ("1. What type of article do you want?", ["Marketing article for the Mediasoft blog", "Detailed technical article",
                                                     "SEO article for Google", "Sales presentation"]),
            ("2. Target audience", ["Tunisian companies (SMEs and large companies)", "Executives and managing directors",
                                    "Finance and IT managers", "All professionals"]),
            ("3. Main goal", ["Present {l} and generate quote requests", "Improve Google ranking (SEO)",
                              "Explain the features and benefits"]),
        ],
        "conseil": "**My advice:** create an article that combines marketing, business expertise and SEO, with original "
        "content, illustrations and calls to action to turn Mediasoft website visitors into prospects.",
        "submit": "Create my article",
        "template": "Let's create the {l} article for Mediasoft. Type: {{0}}. Audience: {{1}}. Goal: {{2}}. "
        "Write a professional, original, SEO-optimised article.",
    },
}
# Le message envoyé par le bouton « Créer mon article » : la rédaction peut commencer
ARTICLE_PRECISE = re.compile(r"\b(Type|Public|Audience|Objectif|Goal)\s*:", re.I)


def assistant_article(logiciel: str | None, code: str) -> tuple[str, dict]:
    """Avant de rédiger : demande la solution si besoin, sinon propose un plan et les choix type / public / objectif."""
    en = code in ("en", "es", "de", "it")
    t = _ASSISTANT["en" if en else "fr"]
    if not logiciel:
        # Un clic sur une solution envoie « Rédiger un article sur … » : on revient ici avec le logiciel connu
        return t["sujet"], {"questions": [{"options": _SUJETS}],
                            "template": "Write an article about {0}" if en else "Rédiger un article sur {0}"}
    nom = "Sage 100" if logiciel == "Sage (Sage 100)" else logiciel
    titre, domaines = _PLAN.get(logiciel, ("la solution au service de votre croissance", []))
    choix = {
        "questions": [{"label": label, "options": [o.format(l=nom) for o in options]} for label, options in t["questions"]],
        "note": t["conseil"],
        "submit": t["submit"],
        "template": t["template"].format(l=nom),
    }
    return t["plan"].format(l=nom, titre=titre, domaines="\n".join(f"- {d}" for d in domaines)), choix


def commerciale(question: str) -> bool:
    return bool(COMMERCIAL.search(question))


def message(cle: str, code: str) -> str:
    if code == "tn":
        code = "fr"
    return MESSAGES.get(code, MESSAGES["en"])[cle]
