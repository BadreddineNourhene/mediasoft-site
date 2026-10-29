/* Page Bitrix24 (/bitrix24.tn/) : contenu repris de https://mediasoft.tn/bitrix24.tn/ (6 univers et leurs fonctions,
   2 versions, avantages, rôle de Mediasoft), réécrit en phrases courtes. Les pages détaillées restent celles du site WordPress. */

export const B24_CYAN = "#2fc6f6";
export const B24_BLUE = "#0b6fd6";
export const B24_NIGHT = "#071a33";

// Pages des univers dans le nouveau site (app/bitrix24.tn/[slug])
const WP = "/bitrix24.tn";

export const b24caps = {
  // Captures fournies par Mediasoft (oct. 2026), noms des clients et contacts floutés
  crm: { src: "/img/produits/b24-transactions-1.webp", alt: "Bitrix24 : pipeline des transactions du CRM" },
  crm2: { src: "/img/produits/b24-transactions-2.webp", alt: "Bitrix24 : transactions en Kanban" },
  contact: { src: "/img/produits/b24-centre-contact.webp", alt: "Bitrix24 : centre de contact (WhatsApp, Facebook, Instagram, chat du site…)" },
  funnel: { src: "/img/produits/b24-funnel.webp", alt: "Bitrix24 : funnel de vente avec conversions" },
  mobile: { src: "/img/produits/b24-crm-mobile.webp", alt: "Bitrix24 : catalogue et application mobile" },
};

export type B24Tool = {
  key: string;
  name: string;
  line: string;
  features: string[];
  href: string;
  visual: "crm" | "crm2" | "contact" | "funnel" | "mobile" | "chat" | "kanban" | "team" | "site";
};

export const b24tools: B24Tool[] = [
  { key: "crm", name: "CRM", line: "Chaque prospect suivi, chaque vente relancée au bon moment.", features: ["Gestion de la relation client", "Devis et factures", "Paiements en ligne", "Automatisation des ventes", "Règles et déclencheurs", "Marketing"], href: `${WP}/crm/`, visual: "crm" },
  { key: "contact", name: "Centre de contact", line: "WhatsApp, Instagram, Facebook, e-mail, téléphone : une seule boîte de réception.", features: ["Réseaux sociaux et messageries", "Chat en direct sur votre site", "E-mails, SMS et appels", "Téléphonie", "Instagram relié au CRM"], href: `${WP}/centre-de-contact/`, visual: "contact" },
  { key: "taches", name: "Tâches et projets", line: "Des projets qui avancent, et tout le monde sait qui fait quoi.", features: ["Tâches et projets", "Diagramme de Gantt", "Tableau Kanban", "Gestion du temps", "Modèles de tâches", "Automatisation des tâches"], href: `${WP}/taches-et-projets/`, visual: "kanban" },
  { key: "collab", name: "Collaboration", line: "Discuter, se réunir et partager ses documents, sans changer d’outil.", features: ["Chats et visioconférences", "Réunions en ligne", "Actualités", "Calendrier", "Documents et Drive", "Groupes de travail"], href: `${WP}/collaboration/`, visual: "chat" },
  { key: "rh", name: "RH et automatisation", line: "Les demandes internes se traitent toutes seules.", features: ["Répertoire des employés", "Suivi du temps de travail", "Gestion des absences", "Workflows sans code (RPA)", "Processus d’entreprise", "Bases de connaissances"], href: `${WP}/rh-et-automatisation/`, visual: "team" },
  { key: "sites", name: "Sites et boutiques", line: "Votre site et votre boutique, reliés directement au CRM.", features: ["Créateur de sites", "Boutique en ligne", "Modèles prêts à l’emploi", "Adapté au mobile et au SEO", "Formulaires et widgets", "Google Analytics"], href: `${WP}/sites-et-boutiques/`, visual: "site" },
];

export const b24benefits = [
  { t: "Un seul outil à la place de dix", d: "CRM, tâches, messagerie, documents, site web : Bitrix24 remplace les abonnements qui s’empilent.", visual: "crm" as const },
  { t: "Commencez gratuitement", d: "Une offre gratuite existe, pour un nombre illimité d’utilisateurs. Vous montez en gamme quand vous en avez besoin.", visual: "crm2" as const },
  { t: "Des coûts prévisibles", d: "Des forfaits à prix fixe, sans facturation par utilisateur : votre équipe grandit, pas votre facture.", visual: "mobile" as const },
  { t: "Vos données vous suivent", d: "La migration depuis vos outils actuels est simple, et Bitrix24 s’intègre aux services que vous utilisez déjà.", visual: "contact" as const },
];

export const b24editions = [
  {
    key: "cloud",
    name: "Cloud",
    img: "/img/bitrix24/edition-cloud.png",
    line: "Prêt en quelques minutes, hébergé par Bitrix24.",
    points: ["Aucun serveur à gérer", "Accessible partout, sur ordinateur et mobile", "Mises à jour automatiques", "Une offre gratuite pour démarrer"],
  },
  {
    key: "onpremise",
    name: "Auto-hébergé",
    img: "/img/bitrix24/edition-auto-hebergee.png",
    line: "Installé sur vos serveurs, entièrement à vous.",
    points: ["Hébergé chez vous ou chez votre hébergeur", "Accès au code source et à l’API", "Entièrement personnalisable", "Idéal pour les grandes entreprises"],
  },
];

export const b24services = [
  { t: "Analyse de vos processus", d: "Nous étudions comment vous vendez et travaillez avant de paramétrer quoi que ce soit." },
  { t: "Mise en œuvre", d: "Configuration du CRM, des pipelines, des automatisations et des intégrations." },
  { t: "Formation", d: "Vos équipes sont formées pour adopter Bitrix24 dès le premier jour." },
  { t: "Support et site web", d: "Support technique, création de votre site et accompagnement marketing." },
];
