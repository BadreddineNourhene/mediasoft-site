"""Génère connaissances/consultants-mediasoft.md : les consultants Mediasoft à contacter pour chaque logiciel et module.

Source : la base Divalto de Mediasoft (LECTURE SEULE). Pour chaque produit et module, les 3 consultants qui ont traité le
plus de tickets du help desk ces 2 dernières années, parmi ceux qui ont une adresse @mediasoft, au moins un ticket ces
6 derniers mois et pas de date de sortie (HSDT) passée dans les utilisateurs Divalto (MUSER).

Identifiants lus dans les variables d'environnement (jamais écrits dans un fichier) :
  MS_DB_SERVER (adresse\\INSTANCE du serveur SQL Divalto), MS_DB_NAME (MEDIASOFT), MS_DB_USER, MS_DB_PWD
  (utiliser de préférence un compte SQL en lecture seule)
Usage :  python base-rag/import_consultants.py   puis   python base-rag/build_base.py   et   python ingest.py
"""

import os
from datetime import date
from pathlib import Path

import pymssql

OUT = Path(__file__).resolve().parent / "connaissances" / "consultants-mediasoft.md"
PRODUITS = {
    "Divalto": "Divalto Infinity",
    "SAGE": "Sage (Sage 100)",
    "Ciel": "Sage 50 (Ciel)",
    "Bitrix": "Bitrix24",
    "Microsoft": "Microsoft 365",
    "BI": "Power BI (Business Intelligence)",
    "Technique": "l'informatique technique (serveurs, réseau, installation)",
    "Web": "les sites et applications web",
}
MODULES = {
    "Gestion": "Gestion commerciale",
    "Règlement": "Règlements",
    "Régelement": "Règlements",
    "ERP": "ERP (paramétrage général)",
    "Affaire": "Gestion à l'affaire",
    "Administration": "Administration (installation, utilisateurs, serveur)",
}
SUPPORT = (
    "Le support Mediasoft reste joignable par le help desk (https://helpdesk-ms.com/), au +216 31 435 825 (Tunis), "
    "au +216 73 822 546 (Sousse), sur WhatsApp au +216 52 444 444 ou à info@mediasoft.tn."
)


def fetch():
    conn = pymssql.connect(
        server=os.environ["MS_DB_SERVER"], database=os.environ.get("MS_DB_NAME", "MEDIASOFT"),
        user=os.environ["MS_DB_USER"], password=os.environ["MS_DB_PWD"], login_timeout=30, timeout=60,
    )
    cur = conn.cursor(as_dict=True)
    cur.execute("SELECT NOM, EMAIL, HSDT FROM MUSER WHERE EMAIL LIKE '%mediasoft%'")
    users = {}
    for r in cur.fetchall():
        for e in str(r["EMAIL"] or "").replace(";", "/").split("/"):
            if e.strip():
                users[e.strip().lower()] = {"nom": str(r["NOM"] or "").strip(), "hsdt": r["HSDT"]}
    cur.execute(
        """
        SELECT Produit, Module, LOWER(LTRIM(RTRIM(Collaborateur))) email, COUNT(*) n
        FROM TICKET_LIST
        WHERE Date_demande >= DATEADD(year, -2, GETDATE()) AND Collaborateur LIKE '%mediasoft%'
        GROUP BY Produit, Module, LOWER(LTRIM(RTRIM(Collaborateur)))
        HAVING MAX(Date_demande) >= DATEADD(month, -6, GETDATE())
        ORDER BY Produit, Module, n DESC
        """
    )
    rows = cur.fetchall()
    conn.close()

    out = {}
    for r in rows:
        u = users.get(r["email"], {})
        if u.get("hsdt") and str(u["hsdt"])[:10] <= date.today().isoformat():
            continue  # a quitté Mediasoft
        produit, module = str(r["Produit"]).strip(), MODULES.get(str(r["Module"]).strip(), str(r["Module"]).strip())
        if produit not in PRODUITS:
            continue
        lst = out.setdefault(produit, {}).setdefault(module, [])
        if all(c["email"] != r["email"] for c in lst) and len(lst) < 3:
            nom = (u.get("nom") or r["email"].split("@")[0].replace(".", " ")).title()
            lst.append({"nom": nom, "email": r["email"], "n": r["n"]})
    return out


def write(data):
    lines = [
        "# Consultants Mediasoft à contacter par logiciel et par module",
        "",
        "Pour un problème, un bug ou une question sur un module précis, le client peut écrire directement aux consultants "
        "Mediasoft qui suivent ce module (les plus sollicités sur le help desk ces derniers mois), en précisant le "
        "logiciel, le module, le message d'erreur exact (capture d'écran) et ce qui était en cours. " + SUPPORT,
        "",
    ]
    # Une section par logiciel, une ligne par module : le modèle ne confond plus des sections presque identiques
    for produit, label in PRODUITS.items():
        mods = {m: c for m, c in data.get(produit, {}).items() if sum(x["n"] for x in c) >= 3}
        if not mods:
            continue
        lines += [
            f"## Consultants à contacter pour {label} : bug, problème ou assistance, par module",
            "",
            f"Consultants Mediasoft de {label}, par module (écrire au(x) consultant(s) de la ligne du module concerné) :",
        ]
        lines += [f"- {module} : " + ", ".join(f"{c['nom']} ({c['email']})" for c in cs) for module, cs in mods.items()]
        lines.append("")
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"{OUT.name} : {sum(len(m) for m in data.values())} modules, écrit dans {OUT.parent}")


if __name__ == "__main__":
    write(fetch())
