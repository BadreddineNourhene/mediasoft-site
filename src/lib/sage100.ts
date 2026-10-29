/* Page Sage 100 (/sage.tn/sage-100/) : faits et liens.
   Toutes les fonctionnalités viennent de la page d'origine https://mediasoft.tn/sage.tn/sage-100/ ;
   les pages détaillées restent celles du site WordPress sage.tn. */

export const SAGE_GREEN = "#00d639";

export const sage100Links = {
  comptabilite: "/sage.tn/sage-100-comptabilite/",
  gestion: "/sage.tn/sage-100-gestion-commerciale/",
  entreprise: "/sage.tn/sage-100-entreprise/",
  // Petites / moyennes entreprises : pages du nouveau site ; les autres restent des pages WordPress de sage.tn
  tpe: "/sage.tn/petites-entreprises/",
  pme: "/sage.tn/moyennes-et-grandes-entreprises/",
  conseil: "https://mediasoft.tn/sage.tn/conseil-et-accompagnement/",
  assistance: "https://mediasoft.tn/sage.tn/assistance/",
  formation: "https://mediasoft.tn/sage.tn/formation/",
};

/* Vraies captures de Sage 100c */
export const caps = {
  laptop: { src: "/img/produits/s100-ecran.webp", alt: "Sage 100c Gestion commerciale : portefeuille d’encours, sur un ordinateur portable", w: 1105, h: 613 },
  ca: { src: "/img/produits/s100-ca.webp", alt: "Sage 100c : chiffre d’affaires comptable, graphique et tableau mensuel", w: 722, h: 461 },
  caCommercial: { src: "/img/produits/s100-ecran.webp", alt: "Sage 100c Gestion commerciale : chiffre d’affaires commercial comparé", w: 1102, h: 619 },
  portefeuille: { src: "/img/produits/s100-portefeuille.webp", alt: "Sage 100c : portefeuille d’encours (commandé, livré, facturé, comptabilisé)", w: 722, h: 427 },
};

export type Question = {
  q: string;
  answer: string;
  tags: string[];
  visual: keyof typeof caps | "rapprochement";
};

export const questions: Question[] = [
  {
    q: "Où en est notre chiffre d’affaires, ce matin ?",
    answer: "Le chiffre d’affaires et les tableaux de bord sont actualisés en temps réel. Vous suivez aussi votre trésorerie sans attendre la clôture.",
    tags: ["Tableaux de bord", "Suivi de trésorerie"],
    visual: "ca",
  },
  {
    q: "Qui nous doit encore de l’argent ?",
    answer: "Facturation, gestion des impayés et relances : les encours clients et fournisseurs sont suivis au même endroit.",
    tags: ["Impayés & relances", "Encours"],
    visual: "portefeuille",
  },
  {
    q: "Notre banque et notre comptabilité disent-elles la même chose ?",
    answer: "Le rapprochement bancaire se fait manuellement ou automatiquement, pour une situation de trésorerie que vous contrôlez.",
    tags: ["Rapprochement bancaire"],
    visual: "rapprochement",
  },
  {
    q: "Que reste-t-il en stock avant de commander ?",
    answer: "La gestion des stocks et un processus d’achat intelligent vous aident à commander au bon moment.",
    tags: ["Stocks", "Achats"],
    visual: "laptop",
  },
];

export const chain = [
  { k: "Devis", t: "Vos données clients sont centralisées et personnalisées : chaque devis part sur de bonnes bases." },
  { k: "Achats", t: "Un processus d’achat intelligent, relié à vos besoins réels." },
  { k: "Stocks", t: "Les stocks sont suivis au fil des entrées et des sorties." },
  { k: "Facture", t: "Factures dématérialisées, envoyées rapidement et en sécurité, avec signature électronique et paiement en ligne." },
  { k: "Comptabilité", t: "Documents et factures archivés, traduits en écritures comptables automatisées." },
  { k: "Trésorerie", t: "Rapprochement bancaire et suivi de trésorerie bouclent le circuit." },
];

export type Formule = {
  key: string;
  name: string;
  tagline: string;
  points: string[];
  modules: string[];
  href: string;
  cta: string;
  popular?: boolean;
};

export const modules = ["Comptabilité", "Gestion commerciale", "Moyens de paiement", "Immobilisations", "Trésorerie"];

export const formules: Formule[] = [
  {
    key: "compta",
    name: "Comptabilité",
    tagline: "La solution pensée pour les PME.",
    points: [
      "Suivi de trésorerie, CA et tableaux de bord en temps réel",
      "Politiques de dépenses et flux de validation",
      "Facturation, impayés et relances",
      "Rapprochement bancaire manuel et automatisé",
      "Factures archivées et traduites en écritures automatisées",
    ],
    // La formule Comptabilité comprend aussi les moyens de paiement, les immobilisations et la trésorerie
    modules: ["Comptabilité", "Moyens de paiement", "Immobilisations", "Trésorerie"],
    href: sage100Links.comptabilite,
    cta: "Découvrir Sage 100 Comptabilité",
  },
  {
    key: "gc",
    name: "Gestion commerciale",
    tagline: "Une force de vente organisée et efficace.",
    points: [
      "Toute la chaîne commerciale, du devis à la facture",
      "Données clients centralisées et personnalisées",
      "Factures dématérialisées, signature électronique, paiement en ligne",
      "Stocks et processus d’achat intelligent",
      "Documents de facturation stockés et partagés en sécurité",
    ],
    modules: ["Gestion commerciale"],
    href: sage100Links.gestion,
    cta: "Découvrir Sage 100 Gestion commerciale",
  },
  {
    key: "entreprise",
    name: "Entreprise",
    tagline: "Toute la gestion de bout en bout, en une seule offre.",
    points: [
      "Sage 100 Comptabilité",
      "Sage 100 Gestion commerciale",
      "Sage 100 Moyens de paiement",
      "Sage 100 Immobilisations",
      "Sage 100 Trésorerie",
    ],
    modules,
    href: sage100Links.entreprise,
    cta: "Découvrir Sage 100 Entreprise",
    popular: true,
  },
];
