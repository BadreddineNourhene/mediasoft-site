"""Importe l'aide en ligne officielle de Divalto (https://divalto.atlassian.net/wiki/) dans la base du chatbot.

Lit les pages publiques par l'API REST de Confluence (accès anonyme, lecture seule), garde les espaces des versions
actuelles et enregistre une page par ligne dans base-rag/divalto_wiki.jsonl :
  {"espace", "titre", "chemin" (pages parentes), "url", "maj", "sections": [[intertitre, [lignes]]]}
ingest.py découpe ensuite ces sections en passages indexés, chacun avec le lien de sa page.

Usage :  python base-rag/import_divalto_wiki.py            (tous les espaces de ESPACES)
         python base-rag/import_divalto_wiki.py UDI113     (un seul espace)
À relancer quand Divalto publie une nouvelle version (mettre alors ESPACES à jour).
"""

import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

from bs4 import BeautifulSoup

HERE = Path(__file__).resolve().parent
SORTIE = HERE / "divalto_wiki.jsonl"
BASE = "https://divalto.atlassian.net/wiki"
# Versions actuelles seulement (les anciennes versions et les notes de version donneraient des procédures périmées)
ESPACES = {
    "UDI113": "Divalto ERP 10.13 (aide utilisateur)",
    "PAI": "Divalto ERP : installer, paramétrer et administrer",
    "DO1": "Divalto one",
    "UDW63": "Divalto CRM 6.3 (weavy)",
    "MYD": "myDivalto",
    "DIVALTO": "Divalto : portail d'informations",
}
PAR_APPEL = 25


def get(url: str, essais: int = 4):
    for n in range(essais):
        try:
            req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "Mediasoft-chatbot-import"})
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.load(r)
        except Exception as e:  # réseau ou limite de débit : on patiente puis on réessaie
            if n == essais - 1:
                raise
            print(f"  nouvel essai ({e})")
            time.sleep(5 * (n + 1))


def texte(el) -> str:
    return re.sub(r"\s+", " ", el.get_text(" ", strip=True)).strip()


def sections(html: str, titre: str):
    """HTML d'une page → [(intertitre, lignes)] : paragraphes, puces, étapes numérotées, lignes de tableau, code court."""
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup.find_all(["script", "style", "img", "svg"]):
        tag.decompose()
    for tag in soup.select(".toc-macro, .confluence-embedded-file-wrapper"):
        tag.decompose()
    out, heading, buf = [], titre, []
    for el in soup.find_all(["h1", "h2", "h3", "h4", "h5", "p", "li", "tr", "pre"]):
        if el.name in ("p", "li") and el.find_parent(["li", "tr"]) and el.name == "p":
            continue  # paragraphe à l'intérieur d'une puce ou d'une cellule : lu avec elle
        if el.name == "li" and el.find(["ul", "ol"]):
            # puce qui contient une sous-liste : seulement son propre texte
            p = el.find("p", recursive=False)
            t = texte(p) if p else re.sub(r"\s+", " ", "".join(el.find_all(string=True, recursive=False))).strip()
        elif el.name == "tr":
            cells = [texte(c) for c in el.find_all(["th", "td"], recursive=False)]
            t = " | ".join(c for c in cells if c)
        elif el.name == "pre":
            t = el.get_text("\n", strip=True)
            t = "Exemple : " + re.sub(r"\s+", " ", t)[:400]
        else:
            t = texte(el)
        if len(t) < 3:
            continue
        if el.name.startswith("h"):
            if buf:
                out.append([heading, buf])
            heading, buf = t, []
        else:
            if el.name == "li" and el.find_parent("ol"):
                t = f"{len(el.find_previous_siblings('li')) + 1}. {t}"
            elif el.name == "li":
                t = f"- {t}"
            buf.append(t)
    if buf:
        out.append([heading, buf])
    return out


def importer(espace: str, f):
    start, n = 0, 0
    while True:
        q = urllib.parse.urlencode(
            {"spaceKey": espace, "type": "page", "status": "current", "limit": PAR_APPEL, "start": start,
             "expand": "body.view,ancestors,version"}
        )
        d = get(f"{BASE}/rest/api/content?{q}")
        for p in d.get("results", []):
            chemin = [a["title"] for a in p.get("ancestors", [])[1:]]  # sans la page d'accueil de l'espace
            secs = sections(p["body"]["view"]["value"], p["title"])
            if not secs:
                continue
            f.write(json.dumps({
                "espace": ESPACES[espace], "titre": p["title"], "chemin": chemin,
                "url": BASE + p["_links"]["webui"], "maj": p.get("version", {}).get("when", "")[:10],
                "sections": secs,
            }, ensure_ascii=False) + "\n")
            n += 1
        if len(d.get("results", [])) < PAR_APPEL:
            break
        start += PAR_APPEL
        if start % 250 == 0:
            print(f"  {espace} : {start} pages lues")
        time.sleep(0.3)
    print(f"{espace} ({ESPACES[espace]}) : {n} pages")
    return n


def main():
    choisis = sys.argv[1:] or list(ESPACES)
    # Un espace relancé seul remplace ses anciennes lignes, les autres sont conservées
    garder = []
    if SORTIE.exists() and sys.argv[1:]:
        noms = {ESPACES[e] for e in choisis}
        garder = [l for l in SORTIE.read_text(encoding="utf-8").splitlines() if json.loads(l)["espace"] not in noms]
    total = 0
    with open(SORTIE, "w", encoding="utf-8") as f:
        for l in garder:
            f.write(l + "\n")
        for e in choisis:
            total += importer(e, f)
    print(f"{total} pages importées dans {SORTIE.name}")


if __name__ == "__main__":
    main()
