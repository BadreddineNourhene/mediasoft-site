"""Construit la base RAG consolidée à partir des fichiers par logiciel.

Entrées :
  - base-rag/sage_knowledge.json, divalto_knowledge.json, bitrix24_knowledge.json, microsoft_365_knowledge.json
    (recherche dans les documentations officielles des éditeurs) ;
  - base-rag/connaissances/*.md (contenu propre à Mediasoft), converti en base-rag/mediasoft_knowledge.json.
Sorties :
  - base-rag/mediasoft_knowledge.json
  - base-rag/rag_knowledge_base.jsonl : une entrée par ligne, avec le texte du passage à indexer (« chunk »)
  - base-rag/knowledge_base.csv : version consultable (Excel)
  - base-rag/sources.md : inventaire des sources
  - base-rag/controle_qualite.md : doublons, champs manquants, entrées à confirmer

Usage :  python base-rag/build_base.py   (puis python ingest.py)
"""

import csv
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
EDITEURS = ["sage_knowledge.json", "divalto_knowledge.json", "bitrix24_knowledge.json", "microsoft_365_knowledge.json"]
CHAMPS = ["id", "logiciel", "module", "categorie", "type_question", "titre", "question", "formulations", "reponse", "etapes",
          "cas_usage", "mots_cles", "nature", "source_url", "source_titre", "date_consultation", "langue", "fiabilite", "notes"]
NATURES = {
    "fonctionnalite_native": "fonctionnalité native du logiciel (documentation officielle de l'éditeur)",
    "necessite_configuration": "fonctionnalité du logiciel qui demande un paramétrage",
    "integration": "possibilité d'intégration documentée par l'éditeur",
    "prestation_mediasoft": "prestation de Mediasoft",
    "developpement_specifique": "développement spécifique, à étudier avec Mediasoft",
}
EDITEUR_DE = {"sage": "Sage", "divalto": "Divalto", "bitrix24": "Bitrix24", "m365": "Microsoft", "powerbi": "Microsoft"}
PRIX_ETRANGER = re.compile(r"\d\s?(€|euros?\b|EUR\b|\$|USD\b|dollars?\b)|\$\s?\d")

# Fichiers de connaissances/ → (logiciel, module, catégorie, source, fiabilité)
MD = {
    "mediasoft.md": ("Mediasoft", "Société", "Présentation et contact", "https://mediasoft.com.tn/", "officielle"),
    "questions-visiteurs.md": ("Mediasoft", "Questions des visiteurs", "Général", "https://www.mediasoft.tn/", "officielle"),
    "faq-clients.md": ("Mediasoft", "FAQ clients", "Commercial", "https://www.mediasoft.tn/", "officielle"),
    "conseil-choix-logiciel.md": ("Mediasoft", "Conseil", "Choix du logiciel", "Équipe Mediasoft", "source_mediasoft"),
    "support-et-assistance.md": ("Mediasoft", "Support", "Assistance", "https://www.mediasoft.tn/assistance.html", "officielle"),
    "problemes-frequents.md": ("Mediasoft", "Support", "Dépannage (premières vérifications)", "Rédaction Mediasoft", "a_confirmer_mediasoft"),
    "sage-choisir.md": ("Sage (gamme)", "Offres Sage", "Choix", "https://www.mediasoft.tn/sage.tn/", "officielle"),
    "sage-gamme.md": ("Sage (gamme)", "Gamme Sage", "Produits", "https://www.mediasoft.tn/sage.tn/", "officielle"),
    "complements-site.md": ("Mediasoft", "Produits et services", "Compléments", "https://mediasoft.com.tn/", "officielle"),
    "web-et-ia.md": ("Mediasoft", "Web et IA", "Développement sur mesure", "https://www.mediasoft.tn/", "officielle"),
}


CONTEXTE_PRIX = re.compile(r"prix|tarif|co[uû]t|abonnement|mois|\bHT\b|par utilisateur|licence|amende|sanction|plafond", re.I)


def prix_etranger(text):
    """Montant en devise étrangère présenté comme un prix, un tarif ou une amende (pas un simple exemple chiffré)."""
    return any(CONTEXTE_PRIX.search(text[max(0, m.start() - 60) : m.end() + 60]) for m in PRIX_ETRANGER.finditer(text))


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:40]


def mediasoft_entries():
    out, today = [], date.today().isoformat()
    for name, (logiciel, module, cat, source, fiab) in MD.items():
        path = HERE / "connaissances" / name
        if not path.exists():
            continue
        title, heading, buf, n = "", None, [], 0
        lines = path.read_text(encoding="utf-8").splitlines() + ["## "]
        for line in lines:
            if line.startswith("# ") and not title:
                title = line[2:].strip()
                heading = title
            elif line.startswith("## "):
                text = "\n".join(buf).strip()
                if heading and text:
                    n += 1
                    question = heading if heading.endswith("?") else heading
                    out.append({
                        "id": f"mediasoft-{slug(name[:-3])}-{n:03d}",
                        "logiciel": logiciel, "module": module, "categorie": cat,
                        "type_question": "depannage" if "probl" in name or "support" in name else "generale",
                        "titre": heading, "question": question, "formulations": [], "reponse": text, "etapes": [],
                        "cas_usage": "", "mots_cles": [],
                        "nature": "prestation_mediasoft" if logiciel == "Mediasoft" else "fonctionnalite_native",
                        "source_url": source, "source_titre": title or name, "date_consultation": today, "langue": "fr",
                        "fiabilite": fiab, "notes": f"Rédigé dans connaissances/{name}",
                    })
                heading, buf = line[3:].strip(), []
            elif line.strip():
                buf.append(line.strip())
    return out


def chunk_text(e):
    """Texte indexé : autonome, avec le contexte logiciel/module, la question, ses variantes, la réponse et la source."""
    parts = [f"{e['logiciel']} — {e['module']} — {e['titre']}", f"Question : {e['question']}"]
    if e.get("formulations"):
        parts.append("Autres formulations : " + " ; ".join(e["formulations"]))
    parts.append(e["reponse"])
    if e.get("etapes"):
        parts.append("Étapes : " + " ".join(f"{i}. {s}" for i, s in enumerate(e["etapes"], 1)))
    if e.get("cas_usage"):
        parts.append(f"Cas d'usage : {e['cas_usage']}")
    nature = NATURES.get(e.get("nature"), "")
    editeur = EDITEUR_DE.get(e["id"].split("-")[0])
    if editeur:
        parts.append(f"Nature : {nature}. Source : documentation officielle {editeur} ({e['source_url']}).")
        if e.get("fiabilite") == "officielle_autre_marche":
            parts.append("Attention : information publiée pour un autre pays ; disponibilité ou conformité en Tunisie à confirmer avec Mediasoft.")
    return "\n".join(parts)


def main():
    entries, problems = [], []
    for f in EDITEURS:
        p = HERE / f
        if not p.exists():
            problems.append(f"Fichier absent : {f}")
            continue
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
        except json.JSONDecodeError as ex:
            sys.exit(f"JSON invalide dans {f} : {ex}")
        for e in data:
            e["origine"] = "editeur"
        entries += data
    ms = mediasoft_entries()
    (HERE / "mediasoft_knowledge.json").write_text(json.dumps(ms, ensure_ascii=False, indent=1), encoding="utf-8")
    for e in ms:
        e["origine"] = "mediasoft"
    entries += ms

    # Contrôle qualité
    ids = Counter(e.get("id") for e in entries)
    problems += [f"Identifiant en double : {i}" for i, n in ids.items() if n > 1]
    seen_q = {}
    for e in entries:
        miss = [c for c in ("id", "logiciel", "module", "question", "reponse", "source_url") if not e.get(c)]
        if miss:
            problems.append(f"{e.get('id')} : champs manquants {miss}")
        if e["origine"] == "editeur" and not str(e.get("source_url", "")).startswith("http"):
            problems.append(f"{e.get('id')} : source non vérifiable ({e.get('source_url')})")
        key = re.sub(r"\W+", " ", e.get("question", "").lower()).strip()
        if key in seen_q:
            problems.append(f"Question en double : « {e['question']} » ({seen_q[key]} / {e['id']})")
        seen_q[key] = e.get("id")
        e["chunk"] = chunk_text(e)
        # Prix publics d'un éditeur (euros, dollars) : gardés, mais présentés comme indicatifs, le prix en Tunisie étant
        # établi sur devis par Mediasoft
        if e["origine"] == "editeur" and prix_etranger(e.get("reponse", "")):
            e["chunk"] += (
                "\nPrix : prix publics de l'éditeur, publiés pour un autre pays (en devise étrangère, hors taxes, hors mise "
                "en place) ; indicatifs seulement. En Tunisie, le prix exact est établi sur devis par Mediasoft."
            )
            problems.append(f"{e['id']} : prix publics d'éditeur (affichés comme indicatifs)")

    with open(HERE / "rag_knowledge_base.jsonl", "w", encoding="utf-8") as f:
        for e in entries:
            f.write(json.dumps(e, ensure_ascii=False) + "\n")

    with open(HERE / "knowledge_base.csv", "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(CHAMPS + ["origine"])
        for e in entries:
            w.writerow([" | ".join(e.get(c) or []) if isinstance(e.get(c), list) else e.get(c, "") for c in CHAMPS] + [e["origine"]])

    by_domain = defaultdict(set)
    for e in entries:
        u = e.get("source_url", "")
        by_domain[urlparse(u).netloc or u].add((u, e.get("source_titre", "")))
    lines = ["# Inventaire des sources", "", f"Généré le {date.today().isoformat()} par `build_base.py`.", ""]
    for dom in sorted(by_domain):
        lines.append(f"## {dom}  ({len(by_domain[dom])} pages)")
        lines += [f"- [{t or u}]({u})" if u.startswith("http") else f"- {u}" for u, t in sorted(by_domain[dom])]
        lines.append("")
    (HERE / "sources.md").write_text("\n".join(lines), encoding="utf-8")

    stats = Counter((e["logiciel"], e.get("fiabilite")) for e in entries)
    qc = ["# Contrôle qualité de la base", "", f"{len(entries)} entrées.", "", "## Entrées par logiciel et fiabilité", ""]
    qc += [f"- {l} — {fi} : {n}" for (l, fi), n in sorted(stats.items())]
    qc += ["", "## Problèmes détectés", ""] + ([f"- {p}" for p in problems] or ["Aucun."])
    qc += ["", "## Entrées à confirmer avec Mediasoft", ""]
    qc += [f"- {e['id']} : {e['question']} — {e.get('notes', '')}" for e in entries if e.get("fiabilite") != "officielle"]
    (HERE / "controle_qualite.md").write_text("\n".join(qc), encoding="utf-8")
    print(f"{len(entries)} entrées ({len(ms)} Mediasoft) ; {len(problems)} problème(s) — voir controle_qualite.md")


if __name__ == "__main__":
    main()
