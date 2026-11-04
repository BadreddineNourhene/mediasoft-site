"""Texte des fichiers joints par le visiteur (PDF, Word, Excel, CSV, texte), pour répondre à partir du document.

Le fichier n'est pas conservé : son texte complet est renvoyé au site, qui le joint ensuite aux questions de la
conversation ; à chaque question, seuls les passages du document utiles à la question sont donnés au modèle (extraits).
"""

import csv
import io
import math
import re
import unicodedata
from collections import Counter
from pathlib import Path

TAILLE_MAX = 10 * 1024 * 1024  # 10 Mo
TEXTE_MAX = 400_000  # caractères gardés : tout le document en pratique (environ 200 pages de texte)
EXTRAIT_MAX = 7000  # caractères du document donnés au modèle pour une question
PASSAGE = 900  # taille d'un passage du document
EXTENSIONS = {".pdf", ".docx", ".xlsx", ".xlsm", ".csv", ".txt", ".md"}


class FichierInvalide(ValueError):
    pass


def _pdf(data: bytes) -> str:
    from pypdf import PdfReader

    reader = PdfReader(io.BytesIO(data))
    return "\n\n".join((page.extract_text() or "").strip() for page in reader.pages)


def _docx(data: bytes) -> str:
    import docx

    d = docx.Document(io.BytesIO(data))
    lignes = [p.text for p in d.paragraphs if p.text.strip()]
    for table in d.tables:
        for row in table.rows:
            lignes.append(" | ".join(c.text.strip() for c in row.cells))
    return "\n".join(lignes)


def _xlsx(data: bytes) -> str:
    import openpyxl

    wb = openpyxl.load_workbook(io.BytesIO(data), read_only=True, data_only=True)
    lignes, n = [], 0
    for ws in wb.worksheets:
        lignes.append(f"## Feuille {ws.title}")
        for row in ws.iter_rows(values_only=True):
            if any(v is not None for v in row):
                lignes.append(" | ".join("" if v is None else str(v) for v in row))
                n += len(lignes[-1])
                if n > TEXTE_MAX:  # très grand classeur : le texte gardé est atteint
                    return "\n".join(lignes)
    return "\n".join(lignes)


def _texte(data: bytes) -> str:
    for enc in ("utf-8-sig", "cp1252"):
        try:
            return data.decode(enc)
        except UnicodeDecodeError:
            continue
    return data.decode("utf-8", errors="ignore")


def _csv(data: bytes) -> str:
    rows = csv.reader(io.StringIO(_texte(data)), delimiter=";" if b";" in data[:2000] else ",")
    return "\n".join(" | ".join(r) for r in rows)


LECTEURS = {".pdf": _pdf, ".docx": _docx, ".xlsx": _xlsx, ".xlsm": _xlsx, ".csv": _csv, ".txt": _texte, ".md": _texte}


def extraire(nom: str, data: bytes) -> dict:
    """{"nom", "texte", "tronque"} ; lève FichierInvalide si le format, la taille ou le contenu ne conviennent pas."""
    ext = Path(nom).suffix.lower()
    if ext not in EXTENSIONS:
        raise FichierInvalide("format")
    if len(data) > TAILLE_MAX:
        raise FichierInvalide("taille")
    try:
        texte = LECTEURS[ext](data)
    except Exception as e:
        raise FichierInvalide("lecture") from e
    texte = "\n".join(l.rstrip() for l in texte.splitlines() if l.strip())
    if len(texte) < 20:  # PDF scanné (image) ou fichier vide
        raise FichierInvalide("vide")
    return {"nom": nom, "texte": texte[:TEXTE_MAX], "tronque": len(texte) > TEXTE_MAX}


# Demande portant sur tout le document (résumé, synthèse…) : passages répartis du début à la fin
_GLOBAL = re.compile(
    r"r[ée]sum|synth[eè]s|global|ensemble|tout le (document|fichier)|de quoi (parle|s.agit)|summar|overview|"
    r"what is (this|it) about|analys|plan du|structure|points? (cl[ée]s|principaux)|لخص|ملخص",
    re.I,
)


def _mots(texte: str) -> list[str]:
    t = unicodedata.normalize("NFKD", texte.lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    return [m for m in re.findall(r"\w{3,}", t)]


def _passages(texte: str) -> list[str]:
    out, cur = [], ""
    for ligne in texte.splitlines():
        while len(ligne) > PASSAGE:  # très longue ligne (PDF sans retours à la ligne)
            if cur:
                out.append(cur)
                cur = ""
            out.append(ligne[:PASSAGE])
            ligne = ligne[PASSAGE:]
        if cur and len(cur) + len(ligne) > PASSAGE:
            out.append(cur)
            cur = ""
        cur = f"{cur}\n{ligne}" if cur else ligne
    return out + ([cur] if cur else [])


def extraits(texte: str, question: str) -> str:
    """Partie du document donnée au modèle : tout le document s'il est court ; sinon les passages qui répondent à la
    question (mots de la question, les plus rares d'abord), ou des passages répartis sur tout le document pour un
    résumé. Les passages gardent l'ordre du document, séparés par « […] »."""
    if len(texte) <= EXTRAIT_MAX:
        return texte
    passages = _passages(texte)
    nb = max(1, EXTRAIT_MAX // PASSAGE)
    termes = set(_mots(question))
    sacs = [Counter(_mots(p)) for p in passages]
    df = Counter(m for s in sacs for m in set(s) if m in termes)
    scores = [sum(math.log(1 + len(passages) / df[m]) * (1 + math.log(s[m])) for m in termes if s[m]) for s in sacs]
    if _GLOBAL.search(question) or not any(scores):
        # Début du document (titre, introduction) puis passages à intervalles réguliers jusqu'à la fin
        choisis = {round(i * (len(passages) - 1) / (nb - 1)) for i in range(nb)} if nb > 1 else {0}
    else:
        choisis = {0} | {i for i in sorted(range(len(passages)), key=lambda i: -scores[i])[: nb - 1] if scores[i]}
    return "\n[…]\n".join(passages[i] for i in sorted(choisis))
