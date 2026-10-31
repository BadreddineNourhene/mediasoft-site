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


def quel_logiciel(question: str, code: str) -> str:
    """Question de précision « sur quel logiciel ? », avec seulement les logiciels où cette manipulation existe."""
    logiciels = ["Sage 100", "Sage 50 (Ciel)", "Divalto Infinity"] + (["Bitrix24"] if _CRM.search(question) else [])
    code = "fr" if code == "tn" else code
    ou = _OU.get(code, _OU["en"])
    texte = ("، " if code == "ar" else ", ").join(logiciels[:-1]) + ou + logiciels[-1]
    return MESSAGES.get(code, MESSAGES["en"])["quel_logiciel"].format(logiciels=texte)


_AMBIGU = {
    "fr": "Avec plaisir ! Pour {l}, souhaitez-vous :\n1. **Créer une fiche article** dans {l} (je vous donne les étapes) ;\n"
    "2. **Rédiger un article** sur {l} (article de blog, article SEO, post LinkedIn…) ?",
    "en": "Happy to help! For {l}, do you want to:\n1. **Create an item record** in {l} (I'll give you the steps);\n"
    "2. **Write an article** about {l} (blog post, SEO article, LinkedIn post…)?",
    "ar": "بكل سرور! بالنسبة إلى {l}، هل تريد:\n1. **إنشاء بطاقة صنف (article)** في {l} (أعطيك الخطوات)؛\n"
    "2. **كتابة مقال** عن {l} (مقال مدونة، مقال SEO، منشور LinkedIn…)؟",
}


def article_ambigu(logiciel: str, code: str) -> str:
    """« Créer un article sur Divalto » : fiche article dans le logiciel, ou article rédigé sur le logiciel ?"""
    code = "fr" if code == "tn" else code
    return _AMBIGU.get(code, _AMBIGU["en"]).format(l=logiciel)


def commerciale(question: str) -> bool:
    return bool(COMMERCIAL.search(question))


def message(cle: str, code: str) -> str:
    if code == "tn":
        code = "fr"
    return MESSAGES.get(code, MESSAGES["en"])[cle]
