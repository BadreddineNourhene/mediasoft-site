# Base de connaissances RAG du chatbot Mediasoft

Base technique et fonctionnelle sur les logiciels intégrés par Mediasoft (Sage, Divalto, Bitrix24, Microsoft 365,
Power BI) et sur Mediasoft elle-même. Construite le 30/10/2026 à partir des documentations officielles des éditeurs et
des sites de Mediasoft. Elle alimente le chatbot du site (`../ingest.py` l'indexe avec les pages du site).

## Contenu

| Fichier | Entrées | Sources |
|---|---|---|
| `sage_knowledge.json` | 110 | sage.com/fr-ma, aide en ligne Sage 100 (sage100cloud.online-help.sage.fr), base de connaissances Sage (fr-kb.sage.com) |
| `divalto_knowledge.json` | 110 | divalto.com, aide en ligne officielle Divalto (divalto.atlassian.net) |
| `bitrix24_knowledge.json` | 120 | centre d'aide officiel en français (helpdesk.bitrix24.fr), documentation API (apidocs.bitrix24.com) |
| `microsoft_365_knowledge.json` | 111 | support.microsoft.com/fr-fr, learn.microsoft.com/fr-fr (Outlook, Teams, OneDrive, Excel, Word, SharePoint, Microsoft 365, Power BI) |
| `mediasoft_knowledge.json` | 176 | générée depuis `connaissances/*.md` (sites mediasoft.com.tn et mediasoft.tn, informations de l'équipe) |
| `rag_knowledge_base.jsonl` | 627 | base consolidée, une entrée par ligne, avec le texte du passage à indexer (`chunk`) |
| `knowledge_base.csv` | 627 | même contenu, consultable dans Excel (séparateur `;`, UTF-8) |
| `sources.md` | 339 pages | inventaire des sources par site |
| `controle_qualite.md` | | doublons, champs manquants, entrées exclues, entrées à confirmer |
| `test_32_questions.md` | | réponses du chatbot à 32 questions représentatives |
| `connaissances/` | 10 fichiers | fiches propres à Mediasoft, en Markdown, à modifier à la main |
| `index/` | 951 passages | index du chatbot, **généré** par `python ingest.py` (ne pas modifier à la main) |

Types de questions couverts : générale 203, fonctionnelle 188, configuration 70, dépannage 69, intégration 33,
technique 27, comparaison 20, commerciale 17.

## Structure d'une entrée

Voir `SCHEMA.md`. Champs : `id`, `logiciel`, `module`, `categorie`, `type_question`, `titre`, `question`,
`formulations` (3 à 6 variantes, dont du langage courant), `reponse`, `etapes` (seulement si la source documente une
procédure), `cas_usage`, `mots_cles`, `nature`, `source_url`, `source_titre`, `date_consultation`, `langue`,
`fiabilite`, `notes`. La base consolidée ajoute `origine` (`editeur` ou `mediasoft`), `chunk` et éventuellement `exclu`.

**`nature`** distingue ce que fait le logiciel de ce que fait Mediasoft :
`fonctionnalite_native`, `necessite_configuration`, `integration`, `prestation_mediasoft`, `developpement_specifique`.

**`fiabilite`** :
- `officielle` : page officielle de l'éditeur ou de Mediasoft ;
- `officielle_autre_marche` (35 entrées) : page officielle publiée pour la France ou le Maroc (fiscalité, paie,
  facturation électronique, hébergement, disponibilité) ; le chatbot précise que c'est à confirmer pour la Tunisie ;
- `source_mediasoft` : règle donnée par l'équipe Mediasoft (ex. conseil Sage ou Divalto selon la taille) ;
- `a_confirmer_mediasoft` (14 entrées) : premières vérifications de dépannage rédigées sans source éditeur.

## Chunks et indexation

- Une entrée = un passage (`chunk`) : jamais coupé, pour ne pas séparer une procédure de ses étapes.
- Chaque passage est autonome : il commence par `logiciel — module — titre`, puis la question, ses autres
  formulations, la réponse, les étapes, le cas d'usage, la nature et la source (« Source : documentation officielle
  Sage (URL) »). Les formulations servent à la recherche sémantique ; les mots exacts servent à la recherche par
  mots-clés (BM25) de `../rag.py`.
- Les entrées qui affichent un prix ou une amende en devise étrangère sont marquées `exclu` et ne sont pas indexées
  (4 entrées Divalto, tarifs France) : en Tunisie, les prix sont donnés sur devis par Mediasoft.
- Les entrées Mediasoft sont indexées depuis `connaissances/*.md` (pas de double indexation).

## Mettre à jour

```bash
python base-rag/build_base.py   # consolide les JSON + connaissances/*.md → jsonl, csv, sources, contrôle qualité
python ingest.py                # reconstruit l'index du chatbot (base-rag/index/)
```

- Corriger ou ajouter une information de l'éditeur : modifier le fichier `*_knowledge.json` concerné (même format),
  puis relancer les deux commandes.
- Information propre à Mediasoft : modifier `connaissances/*.md` (une section `##` par question).
- Relire `controle_qualite.md` après chaque construction.

## Ce que la base ne couvre pas encore

- **Spécificités tunisiennes** : localisation de Sage et Divalto pour la fiscalité, la paie et les formats bancaires
  tunisiens (seule la facturation électronique Sage E-Sign / El Fatoora est documentée).
- **Sage** : procédures Sage 50 de transformation devis → bon de livraison → facture, création d'un article et
  inventaire dans Sage 100, configuration matérielle requise, connecteur Power BI ou API publique.
- **Divalto** : dépannage (très peu de contenu public), BI, EDI, paie et RH détaillées, méthode de mise en œuvre,
  engagement de service (SLA) chiffré, mode hors connexion du CRM.
- **Bitrix24** : achat depuis la Tunisie, location de numéros, SMS et paiements en Tunisie, BI Builder, signature
  électronique.
- **Microsoft** : Microsoft Bookings, configuration d'Outlook mobile, problèmes de connexion à Teams, changement de
  mot de passe par l'utilisateur lui-même.
- **Mediasoft** : horaires, délai d'intervention du support, contrat de maintenance, références clients, description
  des applications de MediaSoft Hub (TEJ, Liasse fiscale, Déclaration Employeur, MSmart Facture), seuils de volume
  Sage → Divalto.
Pour ces questions, le chatbot lance une recherche web sur les sites officiels (`../websearch.py`), sinon il donne
le message de contact.

## Points à confirmer par Mediasoft

- Sage E-Sign (facture électronique en Tunisie) : la page Sage cite aussi « Discovery E-Sign certifié TunTrust » ;
  quel est le nom exact, et Mediasoft le propose-t-elle ?
- Divalto : hébergement SaaS sur Microsoft Azure en France annoncé pour les clients européens ; quelles conditions
  pour un client tunisien ?
- Bitrix24 : nouvelle gamme de forfaits « Essentials » / « Vibe+ » (septembre 2026) ; certaines limites (API, Market,
  IA) des anciennes offres peuvent être dépassées.
- Procédures Sage tirées de l'aide France : les libellés de menus peuvent varier selon la version installée.
