/* Pages des six univers Bitrix24 (/bitrix24.tn/crm/, …), reprises des pages WordPress d'origine de bitrix24.tn :
   mêmes titres, mêmes textes (raccourcis), mêmes visuels (copiés dans public/img/bitrix24-univers). */

export type UniversSection = { t: string; d: string; img: string };
export type Univers = {
  slug: string;
  name: string;
  title: string;
  lead: string;
  hero: string;
  sections: UniversSection[];
};

const img = (slug: string, i: number) => `/img/bitrix24-univers/${slug}-${i}.webp`;

export const univers: Univers[] = [
  {
    slug: "crm",
    name: "CRM",
    title: "Vendez plus. Vendez mieux. Vendez plus vite.",
    lead: "Une seule plateforme pour gérer les prospects, les clients et les transactions, de l’acquisition de prospects au SAV.",
    hero: img("crm", 0),
    sections: [
      { t: "Une seule plateforme pour vos ventes", d: "Bitrix24 est un outil CRM unique pour les entreprises qui cherchent à maîtriser leur processus de vente, de l’acquisition de prospects au SAV.", img: img("crm", 1) },
      { t: "Un CRM 100 % mobile", d: "Un CRM mobile simple et pratique pour gérer vos clients et vos ventes, que vous pouvez ranger dans votre poche.", img: img("crm", 2) },
      { t: "De la prise de contact à la vente", d: "Gérez vos prospects et vos transactions en faisant glisser les éléments, du moment où un prospect est ajouté à votre CRM jusqu’à la conclusion de la transaction.", img: img("crm", 3) },
      { t: "Marketing omnicanal", d: "Atteignez vos clients via le canal le plus efficace : Facebook, e-mails, appels, SMS, notifications push ou messageries. Suivez vos données marketing et de vente dans Sales Intelligence.", img: img("crm", 6) },
      { t: "Gestion de l’équipe de vente", d: "Suivez le temps de travail, attribuez des tâches, contrôlez les délais et surveillez les indicateurs clés de performance de chaque commercial.", img: img("crm", 7) },
      { t: "Gestion de l’inventaire", d: "Gérez votre stock, vos entrepôts et vos ventes directement depuis votre CRM, de la nouvelle commande jusqu’à la livraison du produit.", img: img("crm", 8) },
    ],
  },
  {
    slug: "centre-de-contact",
    name: "Centre de contact",
    title: "Tous vos canaux clients, sur un seul tableau de bord.",
    lead: "Intégré au CRM, le Centre de contact vous permet de suivre toutes les interactions avec vos clients et de récupérer des données marketing exploitables.",
    hero: img("centre-de-contact", 0),
    sections: [
      { t: "Une plateforme centrale pour vos réseaux sociaux", d: "Connectez vos profils d’entreprise sur les réseaux sociaux et les messageries pour gérer vos échanges clients plus facilement.", img: img("centre-de-contact", 1) },
      { t: "Bitrix24 + Instagram = plus de ventes", d: "Si vous vendez vos produits ou services sur Instagram, cette intégration fera passer vos ventes à un autre niveau.", img: img("centre-de-contact", 2) },
      { t: "Un chat en direct pour votre site web", d: "Un widget de chat placé sur votre site pour répondre instantanément à vos visiteurs. Tous les dialogues sont enregistrés dans votre CRM, et un client qui revient est reconnu.", img: img("centre-de-contact", 3) },
      { t: "Téléphonie", d: "Louez des numéros locaux, créez des extensions internes pour vos employés, mettez en place des files d’attente et des transferts d’appels.", img: img("centre-de-contact", 4) },
      { t: "E-mails, SMS et appels vocaux", d: "Les canaux qui ont fait leurs preuves sont eux aussi inclus dans votre Centre de contact omnicanal.", img: img("centre-de-contact", 6) },
    ],
  },
  {
    slug: "taches-et-projets",
    name: "Tâches et projets",
    title: "Des projets qui avancent, où que vous soyez.",
    lead: "Créez des tâches, gérez les délais, analysez des rapports et suivez les indicateurs clés, à la maison, au bureau ou en déplacement.",
    hero: img("taches-et-projets", 0),
    sections: [
      { t: "Rassemblez votre équipe", d: "Créez un groupe de travail, ajoutez des membres, définissez leurs rôles et commencez à assigner des tâches.", img: img("taches-et-projets", 2) },
      { t: "Définissez des tâches et gérez les délais", d: "Assignez des tâches à des personnes ou à des groupes : la personne concernée est informée immédiatement et peut commencer à travailler.", img: img("taches-et-projets", 3) },
      { t: "Visualisez vos projets", d: "Diagramme de Gantt, tableau Kanban, calendrier ou planificateur : choisissez la vue qui vous convient.", img: img("taches-et-projets", 4) },
      { t: "Stockez tous les fichiers d’un projet au même endroit", d: "Avec Bitrix24.Drive, créez, modifiez, stockez et partagez tous les documents liés à un projet.", img: img("taches-et-projets", 7) },
      { t: "Gérez des projets Scrum", d: "Backlog, sprints, story points : un ensemble complet d’outils Scrum, combiné aux chats et aux réunions en ligne.", img: img("taches-et-projets", 8) },
    ],
  },
  {
    slug: "collaboration",
    name: "Collaboration",
    title: "Toute l’équipe sur le même fil.",
    lead: "Bitrix24 améliore la communication interne de l’entreprise avec les outils de collaboration en ligne les plus utilisés.",
    hero: img("collaboration", 0),
    sections: [
      { t: "Espace de travail en ligne", d: "Actualités, réunions en ligne, chats, appels téléphoniques et vidéo : tous les outils de communication sur une seule interface.", img: img("collaboration", 1) },
      { t: "Collaboration", d: "Des outils de collaboration et de gestion de projet pour les équipes à distance comme pour les équipes en présentiel.", img: img("collaboration", 2) },
      { t: "Système de gestion RH", d: "Les informations de vos équipes, réunies au même endroit.", img: img("collaboration", 3) },
      { t: "Gestion sécurisée des documents", d: "Vos documents partagés avec les bonnes personnes, en toute sécurité.", img: img("collaboration", 4) },
      { t: "Groupes de travail et projets", d: "Chaque équipe dispose de son espace pour avancer sur ses projets.", img: img("collaboration", 5) },
      { t: "Base de connaissances", d: "Le savoir de l’entreprise, rassemblé et accessible à tous.", img: img("collaboration", 6) },
    ],
  },
  {
    slug: "rh-et-automatisation",
    name: "RH et automatisation",
    title: "Gérez votre équipe, automatisez vos processus.",
    lead: "Le logiciel RH et d’automatisation Bitrix24 améliore le rendement de chaque service de votre entreprise.",
    hero: img("rh-et-automatisation", 0),
    sections: [
      { t: "Suivi du temps et rapports de travail", d: "Tous les outils pour suivre votre équipe, qu’elle travaille sur site ou à distance.", img: img("rh-et-automatisation", 1) },
      { t: "Automatisation des processus RH", d: "Optimisez de nombreux processus grâce à l’automatisation RH : vous économisez du temps et des ressources.", img: img("rh-et-automatisation", 2) },
      { t: "Analytique et données du personnel", d: "Gérez votre équipe et vos données RH à la maison, au bureau ou en déplacement.", img: img("rh-et-automatisation", 3) },
      { t: "Gestion électronique des documents", d: "Créez, stockez et gérez vos fichiers RH sur le cloud Bitrix24, avec des accès contrôlés pour protéger les données de vos employés.", img: img("rh-et-automatisation", 4) },
      { t: "Culture d’entreprise", d: "Bitrix24 renforce naturellement les interactions professionnelles au sein d’une équipe.", img: img("rh-et-automatisation", 5) },
    ],
  },
  {
    slug: "sites-et-boutiques",
    name: "Sites et boutiques",
    title: "Votre site et votre boutique, reliés au CRM.",
    lead: "Un constructeur de sites intuitif, basé sur des blocs, pour créer des pages de renvoi et des boutiques en ligne intégrées au CRM et aux outils marketing de Bitrix24.",
    hero: img("sites-et-boutiques", 0),
    sections: [
      { t: "Constructeur visuel de sites web", d: "Moins de 30 minutes pour adapter un modèle à vos besoins marketing et à votre charte graphique : votre site est prêt.", img: img("sites-et-boutiques", 1) },
      { t: "Création d’un site de vente en ligne", d: "Concevez et lancez votre boutique en ligne, obtenez vos premiers clients et vos premières commandes, en un jour.", img: img("sites-et-boutiques", 2) },
      { t: "Constructeur de pages de renvoi", d: "Créez des pages de renvoi attrayantes et vendeuses.", img: img("sites-et-boutiques", 3) },
      { t: "Ventes et marketing", d: "Chaque site, page de renvoi ou boutique créé dans Bitrix24 est équipé d’outils marketing et d’intégrations.", img: img("sites-et-boutiques", 4) },
    ],
  },
];

export const universBySlug = (slug: string) => univers.find((u) => u.slug === slug);
