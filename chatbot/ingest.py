"""Construit la base de connaissances du chatbot (index RAG).

Sources :
  1. les pages du nouveau site (dossier out/ exporté par Next.js) : société, Sage, Divalto, Bitrix24,
     Microsoft 365, Power BI, solutions par secteur… ;
  2. les fichiers Markdown du dossier base-rag/connaissances/ (faits rédigés à la main : coordonnées, services…) ;
  3. la base des documentations officielles des éditeurs (base-rag/rag_knowledge_base.jsonl, produite par
     base-rag/build_base.py) : Sage, Divalto, Bitrix24, Microsoft 365 ;
  4. l'aide en ligne officielle Divalto (base-rag/divalto_wiki.jsonl, produite par base-rag/import_divalto_wiki.py).

Chaque page est découpée en passages (environ 900 caractères, rattachés à leur titre), puis chaque
passage est transformé en vecteur par un modèle d'embeddings gratuit exécuté en local.
Résultat : base-rag/index/index.npz (vecteurs) et base-rag/index/chunks.json (textes, titres, liens).

Usage :  python ingest.py
À relancer après chaque modification du site ou des fichiers de connaissances.
"""

import hashlib
import json
import os
import re
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import numpy as np
from bs4 import BeautifulSoup

import config
from embedder import Embedder

PUBLIC_SITE = "https://www.mediasoft.tn"
RAG_BASE = config.BASE_DIR / "rag_knowledge_base.jsonl"
DIVALTO_WIKI = config.BASE_DIR / "divalto_wiki.jsonl"
CHUNK_CHARS = 900
SKIP_FILES = {"404.html", "_not-found.html", "login.html", "politique-de-confidentialite.html", "assistance.html"}
# Textes d'interface sans intérêt pour répondre aux clients
NOISE = re.compile(
    r"^(Découvrir|Demander une démo|Contactez-nous|Télécharger|En savoir plus|Voir|Fermer|Agrandir|Accueil)\b.{0,40}$",
    re.I,
)


def page_url(rel: Path) -> str:
    """Chemin d'un fichier de out/ → adresse publique de la page."""
    p = rel.as_posix()
    if p == "index.html":
        return PUBLIC_SITE + "/"
    if p == "contact.html":
        return config.CONTACT["formulaire"]
    stem = p[: -len(".html")]
    # Les pages des dossiers produits sont servies en dossier (/divalto.tn/wms/), les autres en .html
    if stem.split("/")[0] in {"divalto.tn", "sage.tn", "bitrix24.tn"}:
        return f"{PUBLIC_SITE}/{stem}/"
    return f"{PUBLIC_SITE}/{p}"


def site_pages(out_dir: Path):
    for f in sorted(out_dir.rglob("*.html")):
        rel = f.relative_to(out_dir)
        # Chaque page existe en double (x.html et x/index.html) : on garde x.html
        if f.name == "index.html" and rel.as_posix() != "index.html":
            continue
        if f.name in SKIP_FILES or rel.parts[0].startswith("_"):
            continue
        yield rel, f.read_text(encoding="utf-8", errors="ignore")


def html_sections(html: str):
    """Renvoie (titre de la page, [(intertitre, texte)]) à partir du contenu principal."""
    soup = BeautifulSoup(html, "html.parser")
    title = (soup.title.get_text(" ", strip=True) if soup.title else "").split("|")[0].strip()
    main = soup.find("main") or soup.body or soup
    for tag in main.find_all(["script", "style", "noscript", "svg", "nav", "header", "footer", "form", "button"]):
        tag.decompose()

    sections, heading, buf = [], title, []
    for el in main.find_all(["h1", "h2", "h3", "h4", "p", "li", "dt", "dd", "figcaption", "blockquote"]):
        if el.find(["p", "li", "h2", "h3"]):  # conteneur : ses enfants seront lus séparément
            continue
        text = re.sub(r"\s+", " ", el.get_text(" ", strip=True)).strip()
        if len(text) < 3 or NOISE.match(text):
            continue
        if el.name in {"h1", "h2", "h3"}:
            if buf:
                sections.append((heading, buf))
            heading, buf = text, []
        else:
            buf.append(text)
    if buf:
        sections.append((heading, buf))
    return title, sections


def markdown_sections(md: str):
    title, sections, heading, buf = "", [], "", []
    for line in md.splitlines():
        s = line.strip()
        if s.startswith("#"):
            if buf:
                sections.append((heading, buf))
            heading, buf = s.lstrip("#").strip(), []
            title = title or heading
        elif s:
            buf.append(s)
    if buf:
        sections.append((heading, buf))
    return title, sections


def chunk(title: str, heading: str, lines: list[str]):
    """Regroupe les lignes d'une section en passages d'environ CHUNK_CHARS caractères."""
    out, cur = [], ""
    for line in lines:
        if cur and len(cur) + len(line) > CHUNK_CHARS:
            out.append(cur)
            cur = ""
        cur = f"{cur} {line}".strip()
    if cur:
        out.append(cur)
    prefix = title if heading in ("", title) else f"{title} — {heading}"
    return [f"{prefix}\n{c}" for c in out]


def _embed(textes):
    return Embedder().embed(textes, batch_size=32)


def main():
    chunks, seen = [], set()

    def add(text, title, url, source=None):
        key = hashlib.md5(text.split("\n", 1)[-1].lower().encode()).hexdigest()
        if key in seen or len(text) < 60:
            return
        seen.add(key)
        chunks.append({"text": text, "title": title, "url": url} | ({"source": source} if source else {}))

    n_pages = 0
    if config.SITE_OUT_DIR.exists():
        for rel, html in site_pages(config.SITE_OUT_DIR):
            title, sections = html_sections(html)
            for heading, lines in sections:
                for c in chunk(title, heading, lines):
                    add(c, title, page_url(rel))
            n_pages += 1
    else:
        print(f"Dossier du site introuvable : {config.SITE_OUT_DIR} (seuls les fichiers base-rag/connaissances/ seront indexés)")

    for md in sorted(config.KNOWLEDGE_DIR.glob("*.md")):
        title, sections = markdown_sections(md.read_text(encoding="utf-8"))
        for heading, lines in sections:
            for c in chunk(title, heading, lines):
                add(c, title, None)

    # Base RAG des éditeurs (base-rag/build_base.py) : une entrée = un passage complet, jamais coupé,
    # pour ne pas séparer une procédure de ses étapes. Les entrées Mediasoft viennent déjà de base-rag/connaissances/*.md.
    n_editeur = 0
    if RAG_BASE.exists():
        for line in RAG_BASE.read_text(encoding="utf-8").splitlines():
            e = json.loads(line)
            if e.get("origine") == "editeur" and not e.get("exclu"):
                before = len(chunks)
                add(e["chunk"], f"{e['logiciel']} : {e['titre']}", e.get("source_url"))
                n_editeur += len(chunks) - before

    # Aide en ligne officielle Divalto (base-rag/import_divalto_wiki.py) : chaque passage garde le chemin de sa page
    # (« Commerce > Fichiers > Article ») et le lien vers la page, cité dans les réponses
    n_wiki = 0
    if DIVALTO_WIKI.exists():
        for line in DIVALTO_WIKI.read_text(encoding="utf-8").splitlines():
            try:
                p = json.loads(line)
            except ValueError:  # dernière ligne incomplète pendant un import en cours
                continue
            title = f"Aide Divalto : {p['titre']}"
            chemin = " > ".join(p["chemin"] + [p["titre"]])
            for heading, lines in p["sections"]:
                for c in chunk(f"Aide officielle {p['espace']} — {chemin}", heading if heading != p["titre"] else "", lines):
                    before = len(chunks)
                    add(c, title, p["url"], source="divalto_wiki")
                    n_wiki += len(chunks) - before

    print(
        f"{n_pages} pages du site + {len(list(config.KNOWLEDGE_DIR.glob('*.md')))} fichier(s) de connaissances "
        f"+ {n_editeur} entrées des éditeurs + {n_wiki} passages de l'aide Divalto : {len(chunks)} passages"
    )
    # Le modèle tourne sur un seul cœur (pour garder peu de mémoire en service) : pour indexer des dizaines de
    # milliers de passages, on répartit le calcul sur plusieurs processus
    textes = [c["text"] for c in chunks]
    n = max(1, min(7, (os.cpu_count() or 2) - 1))
    parts = [textes[i::n] for i in range(n)]
    with ProcessPoolExecutor(n) as pool:
        res = list(pool.map(_embed, parts))
    vectors = np.empty((len(textes), res[0].shape[1]), dtype=res[0].dtype)
    for i, r in enumerate(res):
        vectors[i::n] = r

    config.INDEX_DIR.mkdir(exist_ok=True)
    np.savez_compressed(config.INDEX_DIR / "index.npz", vectors=vectors)
    (config.INDEX_DIR / "chunks.json").write_text(
        json.dumps({"model": config.EMBED_MODEL, "chunks": chunks}, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    print(f"Index enregistré dans {config.INDEX_DIR} ({vectors.shape[0]} × {vectors.shape[1]})")


if __name__ == "__main__":
    main()
