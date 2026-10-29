/* Pages des six univers Bitrix24 (/bitrix24.tn/crm/, …) : un cas concret en quatre étapes, raconté au défilement,
   avec une fenêtre Bitrix24 dessinée (données d'exemple). Les fonctions citées viennent des pages d'origine de bitrix24.tn. */

export type Scene =
  | { type: "inbox"; items: { ch: string; from: string; text: string; isNew?: boolean }[] }
  | { type: "card"; title: string; badge?: string; fields: [string, string][]; timeline?: string[] }
  | { type: "kanban"; cols: string[]; card: string; at: number; won?: boolean }
  | { type: "doc"; title: string; lines: [string, string][]; total: string; status: string }
  | { type: "chat"; title: string; msgs: { me?: boolean; text: string }[] }
  | { type: "call"; who: string; status: string; video?: boolean; people?: number }
  | { type: "tasks"; items: { t: string; who: string; done?: boolean; late?: boolean }[] }
  | { type: "gantt"; bars: { t: string; start: number; len: number }[] }
  | { type: "flow"; steps: string[]; active: number }
  | { type: "clock"; time: string; label: string; rows: [string, string][] }
  | { type: "site"; blocks: string[]; shop?: boolean }
  | { type: "result"; big: string; label: string; rows: [string, string][] };

export type Step = { t: string; d: string; scene: Scene };
export type Univers = { slug: string; name: string; title: string; accent: string; lead: string; features: string[]; steps: Step[] };

export const univers: Univers[] = [
  {
    slug: "crm",
    name: "CRM",
    title: "Vendez plus. Vendez mieux.",
    accent: "Vendez plus vite.",
    lead: "Prospects, clients et transactions dans une seule plateforme, de la première prise de contact jusqu’au SAV.",
    features: ["Pipeline des ventes", "Devis et factures", "Automatisation des ventes", "Stock et commandes", "CRM mobile", "Sales Intelligence"],
    steps: [
      { t: "Un prospect écrit sur WhatsApp", d: "Formulaires, chat du site, appels, réseaux sociaux : chaque demande arrive dans le CRM.", scene: { type: "inbox", items: [{ ch: "WhatsApp", from: "Nouveau prospect", text: "Bonjour, je souhaite un devis pour 20 postes.", isNew: true }, { ch: "Formulaire", from: "Site web", text: "Demande de rappel" }, { ch: "E-mail", from: "Client", text: "Suivi de commande" }] } },
      { t: "Sa fiche se crée toute seule", d: "Le prospect est enregistré et attribué automatiquement au bon commercial.", scene: { type: "card", title: "Nouveau prospect", badge: "Créé automatiquement", fields: [["Source", "WhatsApp"], ["Responsable", "Commercial 1"], ["Étape", "Nouveau"], ["Score", "★★★★☆"]] } },
      { t: "Le devis part en un clic", d: "Devis et factures sont créés depuis la transaction, avec paiement en ligne.", scene: { type: "doc", title: "Devis n° 2026-148", lines: [["Licences (20 postes)", "4 800 DT"], ["Mise en place", "1 200 DT"], ["Formation", "600 DT"]], total: "6 600 DT", status: "Envoyé au client" } },
      { t: "La vente est gagnée", d: "La transaction avance dans le pipeline jusqu’à « Gagnée », et vous suivez vos chiffres en temps réel.", scene: { type: "kanban", cols: ["Nouveau", "Devis envoyé", "Négociation", "Gagnée"], card: "20 postes · 6 600 DT", at: 3, won: true } },
    ],
  },
  {
    slug: "centre-de-contact",
    name: "Centre de contact",
    title: "Tous vos canaux clients,",
    accent: "une seule boîte de réception.",
    lead: "WhatsApp, Instagram, Facebook, chat du site, e-mails, SMS et téléphone, rassemblés et reliés au CRM.",
    features: ["Réseaux sociaux et messageries", "Chat en direct sur le site", "Téléphonie", "E-mails et SMS", "Instagram relié au CRM"],
    steps: [
      { t: "Les messages arrivent de partout", d: "Chaque canal se connecte au Centre de contact : plus besoin de jongler entre les applications.", scene: { type: "inbox", items: [{ ch: "Instagram", from: "Client", text: "Ce produit est-il disponible ?", isNew: true }, { ch: "Facebook", from: "Prospect", text: "Quels sont vos horaires ?" }, { ch: "WhatsApp", from: "Client", text: "Merci pour la livraison !" }, { ch: "Chat du site", from: "Visiteur", text: "Bonjour…" }] } },
      { t: "Vous répondez depuis le même écran", d: "Le chat en direct de votre site reconnaît les clients qui reviennent.", scene: { type: "chat", title: "Chat du site · Visiteur", msgs: [{ text: "Bonjour, je cherche une solution de gestion." }, { me: true, text: "Bonjour ! Nous pouvons vous montrer une démonstration." }, { text: "Avec plaisir, jeudi ?" }] } },
      { t: "Un appel ? Le client est reconnu", d: "La téléphonie affiche la fiche du client dès que son appel arrive.", scene: { type: "call", who: "Client connu · 3 commandes", status: "Appel entrant…" } },
      { t: "Tout l’historique au même endroit", d: "Messages, appels et e-mails sont enregistrés dans le CRM, avec des données marketing exploitables.", scene: { type: "card", title: "Fiche client", badge: "Historique complet", fields: [["Canal préféré", "WhatsApp"], ["Dernier contact", "Aujourd’hui"]], timeline: ["Message Instagram", "Appel entrant · 4 min", "E-mail : devis envoyé", "Chat du site"] } },
    ],
  },
  {
    slug: "taches-et-projets",
    name: "Tâches et projets",
    title: "Des projets qui avancent,",
    accent: "et chacun sait qui fait quoi.",
    lead: "Créez des tâches, gérez les délais, suivez l’avancement et les indicateurs, au bureau, à la maison ou en déplacement.",
    features: ["Tâches et sous-tâches", "Diagramme de Gantt", "Tableau Kanban", "Outils Scrum", "Suivi du temps", "Drive du projet"],
    steps: [
      { t: "Vous lancez le projet", d: "Créez un groupe de travail, ajoutez l’équipe et assignez les premières tâches : chacun est prévenu immédiatement.", scene: { type: "tasks", items: [{ t: "Recueillir les besoins", who: "Chef de projet" }, { t: "Préparer la maquette", who: "Designer" }, { t: "Planifier la formation", who: "Consultant" }] } },
      { t: "L’équipe avance en Kanban", d: "Les tâches glissent d’une colonne à l’autre au fil du travail.", scene: { type: "kanban", cols: ["À faire", "En cours", "En revue", "Terminé"], card: "Préparer la maquette", at: 2 } },
      { t: "Le planning est clair", d: "Diagramme de Gantt, calendrier ou planificateur : choisissez la vue qui vous convient.", scene: { type: "gantt", bars: [{ t: "Analyse", start: 0, len: 3 }, { t: "Paramétrage", start: 2, len: 4 }, { t: "Formation", start: 5, len: 2 }, { t: "Démarrage", start: 7, len: 1 }] } },
      { t: "Le projet est livré, et mesuré", d: "Temps passé, rapports et indicateurs clés : vous contrôlez la performance de l’équipe.", scene: { type: "result", big: "100 %", label: "Tâches terminées", rows: [["Dans les délais", "92 %"], ["Temps passé", "146 h"], ["Fichiers sur le Drive", "38"]] } },
    ],
  },
  {
    slug: "collaboration",
    name: "Collaboration",
    title: "Toute l’équipe",
    accent: "sur le même fil.",
    lead: "Actualités, chats, appels vidéo, documents et base de connaissances dans un seul espace de travail.",
    features: ["Chats et groupes", "Visioconférences", "Actualités", "Calendrier partagé", "Drive et documents", "Base de connaissances"],
    steps: [
      { t: "On en discute dans le groupe", d: "Chats d’équipe et commentaires : les échanges restent rattachés au bon sujet.", scene: { type: "chat", title: "Groupe · Équipe commerciale", msgs: [{ text: "Le client valide la proposition 👍" }, { me: true, text: "Super, je prépare le contrat." }, { text: "On fait un point à 15 h ?" }] } },
      { t: "Un appel vidéo, sans changer d’outil", d: "Réunions en ligne et appels vidéo directement depuis Bitrix24.", scene: { type: "call", who: "Point d’équipe", status: "Visioconférence · 4 participants", video: true, people: 4 } },
      { t: "Le document est partagé et modifié à plusieurs", d: "Créez, modifiez et partagez vos fichiers sur le Drive, avec des droits d’accès maîtrisés.", scene: { type: "doc", title: "Contrat client.docx", lines: [["Modifié par", "Commercial 1"], ["Partagé avec", "Équipe commerciale"], ["Version", "3"]], total: "Accès : équipe", status: "Enregistré sur le Drive" } },
      { t: "Le savoir de l’entreprise reste accessible", d: "La base de connaissances rassemble procédures et réponses pour toute l’équipe.", scene: { type: "tasks", items: [{ t: "Procédure de commande", who: "Base de connaissances", done: true }, { t: "Modèles de contrats", who: "Base de connaissances", done: true }, { t: "Accueil des nouveaux", who: "Base de connaissances", done: true }] } },
    ],
  },
  {
    slug: "rh-et-automatisation",
    name: "RH et automatisation",
    title: "Les demandes internes",
    accent: "se traitent toutes seules.",
    lead: "Suivi du temps, congés, documents RH et processus automatisés, pour une équipe sur site ou à distance.",
    features: ["Pointeuse en ligne", "Gestion des absences", "Répertoire des employés", "Workflows sans code", "Documents RH", "Rapports de travail"],
    steps: [
      { t: "Chacun pointe en ligne", d: "Début et fin de journée, pauses et rapports de travail, depuis l’ordinateur ou le mobile.", scene: { type: "clock", time: "08:58", label: "Journée commencée", rows: [["Pause", "0 h 45"], ["Temps travaillé hier", "8 h 10"]] } },
      { t: "Une demande de congé est créée", d: "Le formulaire part automatiquement au bon responsable.", scene: { type: "flow", steps: ["Demande", "Responsable", "RH", "Validée"], active: 1 } },
      { t: "Elle est validée sans papier", d: "L’automatisation fait avancer la demande et informe chacun, sans ressaisie.", scene: { type: "flow", steps: ["Demande", "Responsable", "RH", "Validée"], active: 3 } },
      { t: "Vous gardez une vue d’ensemble", d: "Données du personnel et rapports, à la maison, au bureau ou en déplacement.", scene: { type: "result", big: "18", label: "Demandes traitées ce mois", rows: [["Délai moyen", "4 h"], ["Présents aujourd’hui", "24 / 26"], ["Documents signés", "12"]] } },
    ],
  },
  {
    slug: "sites-et-boutiques",
    name: "Sites et boutiques",
    title: "Votre site et votre boutique,",
    accent: "reliés directement au CRM.",
    lead: "Un constructeur de sites par blocs pour créer pages de renvoi et boutiques en ligne, avec les outils marketing de Bitrix24.",
    features: ["Constructeur par blocs", "Boutique en ligne", "Pages de renvoi", "Modèles prêts à l’emploi", "Formulaires et widgets", "Adapté au mobile"],
    steps: [
      { t: "Vous assemblez le site en blocs", d: "Moins de 30 minutes pour adapter un modèle à votre charte graphique.", scene: { type: "site", blocks: ["En-tête", "Présentation", "Produits", "Formulaire"] } },
      { t: "La boutique est en ligne", d: "Catalogue, panier et paiement : vos premiers clients et commandes en un jour.", scene: { type: "site", blocks: ["Catalogue"], shop: true } },
      { t: "Chaque commande arrive dans le CRM", d: "Commandes et formulaires créent automatiquement des transactions.", scene: { type: "inbox", items: [{ ch: "Boutique", from: "Nouvelle commande", text: "3 articles · paiement en ligne", isNew: true }, { ch: "Formulaire", from: "Page de renvoi", text: "Demande de démonstration" }] } },
      { t: "Vous mesurez ce qui vend", d: "Chaque site est équipé d’outils marketing et d’intégrations.", scene: { type: "result", big: "+38 %", label: "Commandes en ligne", rows: [["Visiteurs", "2 410"], ["Formulaires envoyés", "64"], ["Paniers validés", "112"]] } },
    ],
  },
];

export const universBySlug = (slug: string) => univers.find((u) => u.slug === slug);
