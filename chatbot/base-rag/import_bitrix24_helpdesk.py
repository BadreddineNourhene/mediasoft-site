"""Importe l'aide en ligne officielle de Bitrix24 (helpdesk.bitrix24.fr et helpdesk.bitrix24.com) dans la base du chatbot.

Parcourt les rubriques (/section/N/) et les articles (/open/N/) de chaque site, en lecture seule, avec une pause entre
deux pages (chemins autorisés par le robots.txt des deux sites). Une page par ligne dans base-rag/bitrix24_helpdesk.jsonl,
au même format que l'aide Divalto (voir import_divalto_wiki.py), lu ensuite par ingest.py.

N.B. training.bitrix24.com (cours de formation) interdit la lecture automatique dans son robots.txt : il n'est pas
importé, la recherche web du chatbot peut toujours y trouver une page.

Usage :  python base-rag/import_bitrix24_helpdesk.py
"""

import json
import re
import time
import urllib.request
from collections import deque
from pathlib import Path

from bs4 import BeautifulSoup

from import_divalto_wiki import sections

HERE = Path(__file__).resolve().parent
SORTIE = HERE / "bitrix24_helpdesk.jsonl"
# Le français d'abord : l'anglais complète les articles non traduits
SITES = {
    "https://helpdesk.bitrix24.fr": "Bitrix24 : aide en ligne officielle (français)",
    "https://helpdesk.bitrix24.com": "Bitrix24 : aide en ligne officielle (anglais)",
}
DEPARTS = ["/", "/documentation.php"]
LIENS = re.compile(r'href="(/(?:section|open)/\d+/)"')
MAX_PAGES = 6000  # par site, garde-fou
PAUSE = 0.4
# Lignes d'en-tête d'article sans intérêt (auteur, date, partage)
BRUIT = re.compile(
    r"^(?:- |\d+\. )?(Author|Auteur|Last update|Dernière mise à jour|Share|Partager|Facebook|LinkedIn|Print|Imprimer|"
    r"Download|Télécharger|X|Twitter)\b",
    re.I,
)


def get(url: str):
    for n in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Mediasoft-chatbot-import)"})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read().decode("utf-8", errors="ignore")
        except Exception as e:
            if n == 2:
                print(f"  abandon {url} ({e})")
                return ""
            time.sleep(3 * (n + 1))


def article(html: str):
    soup = BeautifulSoup(html, "html.parser")
    corps = soup.select_one("div.article-wrap") or soup.select_one("div.detail-article")
    h1 = soup.find_all("h1")
    titre = (h1[-1].get_text(" ", strip=True) if h1 else "").strip()
    if not corps or not titre:
        return None, None
    for tag in corps.select(".navigation-right-container, .article-info, .share, script, style"):
        tag.decompose()
    secs = [[h, [l for l in lignes if not BRUIT.match(l)]] for h, lignes in sections(str(corps), titre)]
    secs = [s for s in secs if s[1] and s[0] != "Bitrix24 Helpdesk"]
    return titre, secs


def importer(base: str, espace: str, f, deja: set):
    file, vus, n = deque(DEPARTS), set(DEPARTS), 0
    while file and len(vus) < MAX_PAGES:
        chemin = file.popleft()
        html = get(base + chemin)
        time.sleep(PAUSE)
        for lien in LIENS.findall(html):
            if lien not in vus:
                vus.add(lien)
                file.append(lien)
        if not chemin.startswith("/open/"):
            continue
        titre, secs = article(html)
        if not secs or titre.lower() in deja:
            continue
        deja.add(titre.lower())
        f.write(json.dumps({"espace": espace, "titre": titre, "chemin": [], "url": base + chemin, "maj": "",
                            "sections": secs}, ensure_ascii=False) + "\n")
        f.flush()
        n += 1
        if n % 100 == 0:
            print(f"  {base} : {n} articles ({len(vus)} pages repérées)", flush=True)
    print(f"{base} : {n} articles", flush=True)
    return n


def main():
    total, deja = 0, set()
    with open(SORTIE, "w", encoding="utf-8") as f:
        for base, espace in SITES.items():
            total += importer(base, espace, f, deja)
    print(f"{total} articles importés dans {SORTIE.name}")


if __name__ == "__main__":
    main()
