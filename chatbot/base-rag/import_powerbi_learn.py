"""Importe la documentation officielle Power BI de Microsoft Learn (learn.microsoft.com/fr-fr/power-bi/) dans la base du
chatbot.

Parcourt les tables des matières (toc.json) de chaque rubrique et les liens entre articles, en lecture seule, avec une
pause entre deux pages (chemins autorisés par le robots.txt de learn.microsoft.com). Une page par ligne dans
base-rag/powerbi_learn.jsonl, au même format que l'aide Divalto (voir import_divalto_wiki.py), lu ensuite par ingest.py.

Usage :  python base-rag/import_powerbi_learn.py
"""

import json
import re
import time
import urllib.request
from collections import deque
from pathlib import Path
from urllib.parse import urljoin, urlsplit

from bs4 import BeautifulSoup

from import_divalto_wiki import sections

HERE = Path(__file__).resolve().parent
SORTIE = HERE / "powerbi_learn.jsonl"
BASE = "https://learn.microsoft.com"
RACINE = "/fr-fr/power-bi/"
DEPARTS = [RACINE, RACINE + "fundamentals/power-bi-overview"]
ESPACE = "Power BI : documentation officielle Microsoft Learn"
MAX_PAGES = 5000  # garde-fou
PAUSE = 0.3


def get(url: str):
    for n in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Mediasoft-chatbot-import)"})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read().decode("utf-8", errors="ignore")
        except Exception as e:
            if getattr(e, "code", None) == 404 or n == 2:
                print(f"  abandon {url} ({e})")
                return ""
            time.sleep(3 * (n + 1))


def normaliser(url: str):
    """Lien → chemin d'un article Power BI en français (sans ancre ni paramètres), ou None."""
    p = urlsplit(url)
    if p.netloc not in ("", "learn.microsoft.com"):
        return None
    chemin = re.sub(r"^/(?:en-us|fr-fr)/", "/fr-fr/", p.path)
    if not chemin.startswith(RACINE) or re.search(r"\.(?:json|png|jpg|svg|gif|pdf|zip)$", chemin, re.I):
        return None
    return chemin


def liens_toc(url: str, tocs: dict):
    """Liens d'une table des matières (mise en cache : une par rubrique)."""
    if url not in tocs:
        tocs[url] = []
        texte = get(url)
        time.sleep(PAUSE)
        try:
            items = json.loads(texte)["items"] if texte else []
        except ValueError:
            items = []
        pile = list(items)
        while pile:
            i = pile.pop()
            pile.extend(i.get("children", []))
            if i.get("href"):
                tocs[url].append(urljoin(url, i["href"]))
    return tocs[url]


def article(html: str):
    soup = BeautifulSoup(html, "html.parser")
    h1 = soup.select_one("main h1")
    corps = max(soup.select("main div.content"), key=lambda d: len(d.get_text()), default=None)
    titre = h1.get_text(" ", strip=True) if h1 else ""
    if not corps or not titre:
        return None, None
    for tag in corps.select("#article-header, .page-metadata, .feedback-section, nav, script, style"):
        tag.decompose()
    secs = [s for s in sections(str(corps), titre) if s[1]]
    return titre, secs


def main():
    file, vus, tocs, n = deque(DEPARTS), set(DEPARTS), {}, 0
    with open(SORTIE, "w", encoding="utf-8") as f:
        while file and len(vus) < MAX_PAGES:
            chemin = file.popleft()
            url = BASE + chemin
            html = get(url)
            time.sleep(PAUSE)
            if not html:
                continue
            liens = re.findall(r'href="([^"#?]+)', html)
            toc = re.search(r'<meta name="toc_rel" content="([^"]+)"', html)
            if toc:
                liens += liens_toc(urljoin(url, toc.group(1)), tocs)
            for lien in liens:
                c = normaliser(urljoin(url, lien))
                if c and c not in vus:
                    vus.add(c)
                    file.append(c)
            titre, secs = article(html)
            if not secs or sum(len(l) for _, lignes in secs for l in lignes) < 300:
                continue  # page d'accueil de rubrique (tuiles de liens) : pas d'explication à retenir
            # Rubrique de la page (« create-reports » → « create reports ») : sert de chemin dans le titre des passages
            rubrique = chemin[len(RACINE):].split("/")[0].replace("-", " ") if "/" in chemin[len(RACINE):] else ""
            f.write(json.dumps({"espace": ESPACE, "titre": titre, "chemin": [rubrique] if rubrique else [],
                                "url": url, "maj": "", "sections": secs}, ensure_ascii=False) + "\n")
            f.flush()
            n += 1
            if n % 100 == 0:
                print(f"  {n} articles ({len(vus)} pages repérées)", flush=True)
    print(f"{n} articles importés dans {SORTIE.name}", flush=True)


if __name__ == "__main__":
    main()
