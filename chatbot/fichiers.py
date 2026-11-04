"""Texte des fichiers joints par le visiteur (PDF, Word, Excel, CSV, texte), pour répondre à partir du document.

Le fichier n'est pas conservé : son texte est renvoyé au site, qui le joint ensuite aux questions de la conversation.
"""

import csv
import io
from pathlib import Path

TAILLE_MAX = 10 * 1024 * 1024  # 10 Mo
TEXTE_MAX = 15000  # caractères gardés (le reste du document est ignoré)
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
    lignes = []
    for ws in wb.worksheets:
        lignes.append(f"## Feuille {ws.title}")
        for row in ws.iter_rows(values_only=True):
            if any(v is not None for v in row):
                lignes.append(" | ".join("" if v is None else str(v) for v in row))
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
