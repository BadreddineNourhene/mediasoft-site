import type { ResourcePage } from "./types";

/* Dossiers de ressources. Réécrits à partir des pages d'origine de divalto.tn : plus courts, sans les statistiques
   d'études tierces ni les échéances réglementaires françaises (non applicables en Tunisie). */

export const resourcePages: ResourcePage[] = [
  {
    kind: "ressource",
    slug: "gestion-commerciale-comptabilite-et-erp",
    name: "Gestion commerciale, comptabilité et ERP",
    seoTitle: "Dossier ERP : gestion commerciale, comptabilité et logiciel ERP",
    description: "Comprendre ce qu’est un ERP, ce qu’il centralise et comment préparer un projet : notre dossier sur la gestion commerciale, la comptabilité et l’ERP.",
    title: "L’ERP, la gestion commerciale et la comptabilité, enfin clairs.",
    lead: "Un ERP gère toutes les activités de l’entreprise dans une base de données unique. Ce dossier pose les bases avant de choisir.",
    minutes: 3,
    sections: [
      {
        id: "definition",
        h: "Un ERP, c’est quoi ?",
        p: [
          "ERP signifie Enterprise Resource Planning. C’est un logiciel qui gère l’ensemble des activités d’une entreprise au sein d’une base de données unique.",
          "Il centralise la comptabilité, les ventes et les achats, les prospects, les clients et les fournisseurs. Objectif : gagner en efficacité et éviter les erreurs humaines.",
        ],
      },
      {
        id: "sujets",
        h: "Les grands sujets autour de l’ERP",
        p: ["Quatre questions reviennent dans presque tous les projets :"],
        items: ["Gestion commerciale : quels avantages ?", "Comptabilité : trouver la solution adaptée à votre entreprise", "Pourquoi choisir une solution de gestion intégrée ?", "Gestion de maintenance : de quoi parle-t-on ?"],
      },
      {
        id: "cahier",
        h: "Bien préparer son projet",
        p: [
          "Un projet ERP réussi commence par un cahier des charges : les modules nécessaires, les processus à couvrir et les questions à poser à votre futur partenaire.",
          "Mediasoft vous aide à le formaliser avant de vous présenter la solution Divalto adaptée.",
        ],
      },
    ],
    takeaways: ["Un ERP réunit toutes les fonctions dans une seule base de données", "Il évite les doubles saisies et les erreurs", "Un cahier des charges précis sécurise le projet"],
    related: ["logiciel-erp", "logiciel-crm", "dematerialisation"],
  },
  {
    kind: "ressource",
    slug: "logiciel-erp",
    name: "Logiciel ERP",
    seoTitle: "Logiciel ERP : définition, avantages et comment le choisir",
    description: "Définition d’un logiciel ERP, ses particularités, pourquoi en avoir besoin, comment le choisir et ce qui détermine son coût.",
    title: "Logiciel ERP : l’outil central de l’entreprise.",
    lead: "Comptabilité, gestion commerciale, production, CRM : l’ERP réunit les outils de gestion pour améliorer les performances et maîtriser les coûts.",
    minutes: 5,
    sections: [
      {
        id: "definition",
        h: "Qu’est-ce qu’un ERP ?",
        p: [
          "Un logiciel ERP pilote l’entreprise. Sa particularité : réunir, dans un même logiciel et une seule base de données, toutes les fonctions de gestion — comptabilité, gestion commerciale, stocks…",
          "Sa mission : optimiser les coûts (stocks, fournisseurs) et améliorer le rendement (planification, workflows, automatismes).",
        ],
      },
      {
        id: "particularites",
        h: "Ce qui fait un bon ERP",
        p: ["Trois critères reviennent pour juger un ERP de qualité :"],
        items: ["Unique : une information modifiée est mise à jour en temps réel dans tous les modules", "Traçable : des pistes d’audit fiables", "Couvrant : une large couverture des besoins de l’entreprise"],
      },
      {
        id: "pourquoi",
        h: "Pourquoi en avoir besoin ?",
        p: [
          "L’ERP remplace la multitude de logiciels et évite que vos équipes passent leur temps à échanger des fichiers entre services.",
          "Vous y modélisez vos flux — qui valide, qui vérifie, qui réalise — et automatisez actions et alertes.",
        ],
      },
      {
        id: "choisir",
        h: "Comment le choisir ?",
        p: ["Commencez par un cahier des charges précis, puis demandez des démonstrations. Quatre questions pour démarrer :"],
        items: ["Adaptée : la solution colle-t-elle à votre activité ?", "Ergonomique : vos équipes la prendront-elles en main ?", "Innovante : intègre-t-elle des innovations ?", "Flexible : suivra-t-elle votre croissance ?"],
      },
      {
        id: "avantages",
        h: "Les avantages",
        p: [
          "L’information circule plus vite, les coûts et les ressources sont mieux gérés, et le traitement des données prend moins de temps. Les fonctions de business intelligence donnent une vision claire de l’activité.",
        ],
      },
      {
        id: "prix",
        h: "Et le prix ?",
        p: [
          "Le coût dépend de la complexité, du mode d’hébergement (SaaS, cloud, sur site), des développements, du nombre d’utilisateurs et de l’infrastructure.",
          "Regardez le coût total sur la durée (TCO), pas seulement l’achat : c’est lui qui compte vraiment.",
        ],
      },
    ],
    takeaways: ["Une seule base de données pour tous les services", "Des flux modélisés et des alertes automatiques", "Un choix qui se prépare avec un cahier des charges", "Un coût qui s’évalue sur la durée (TCO)"],
    related: ["gestion-commerciale-comptabilite-et-erp", "logiciel-crm", "erp-divalto-infinity"],
  },
  {
    kind: "ressource",
    slug: "logiciel-crm",
    name: "Logiciel CRM",
    seoTitle: "Logiciel CRM : définition, avantages et comment bien le choisir",
    description: "Qu’est-ce qu’un CRM, pour qui, quels avantages et comment le choisir selon votre taille, votre secteur, vos fonctionnalités et votre hébergement.",
    title: "Le CRM : mieux connaître vos clients pour mieux vendre.",
    lead: "Le CRM gère la relation entre l’entreprise et ses clients : il facilite les échanges, solidifie la relation et favorise la fidélisation.",
    minutes: 5,
    sections: [
      {
        id: "definition",
        h: "Le CRM, c’est quoi ?",
        p: [
          "CRM signifie Customer Relationship Management. C’est à la fois une stratégie et une plateforme partagée par vos collaborateurs.",
          "Grâce au CRM, vous collectez les données de vos clients et maîtrisez tout le cycle de vente avec une information fiable et partagée.",
        ],
      },
      {
        id: "pour-qui",
        h: "Pour qui ?",
        p: ["Quel que soit le profil de votre entreprise, un CRM adapté existe. Le bon choix dépend de :"],
        items: ["La taille de votre entreprise", "Votre secteur d’activité", "Votre usage : prospection, gestion administrative des dossiers…"],
      },
      {
        id: "avantages",
        h: "Les avantages",
        p: [
          "Des données centralisées sont des données fiabilisées. Un CRM adapté crée une automatisation intelligente et fait gagner beaucoup de temps.",
        ],
        items: ["E-mailings personnalisés", "Devis et factures", "Intégration avec l’ERP"],
      },
      {
        id: "choisir",
        h: "Comment le choisir ?",
        p: ["Définissez d’abord vos bonnes pratiques et vos objectifs, puis comparez selon :"],
        items: ["La taille de l’entreprise", "Le secteur : géolocalisation pour les services, devis spécifiques pour le transport…", "Les fonctionnalités : tableau de bord, suivi des mails et appels, prospects, automatisation", "Le mode d’hébergement : SaaS ou cloud pour plus de mobilité", "Les objectifs de l’entreprise"],
      },
    ],
    takeaways: ["Une plateforme unique pour toute la relation client", "Des données fiabilisées et partagées", "Un choix guidé par vos objectifs, pas par le nombre de fonctions"],
    related: ["logiciel-erp", "gestion-commerciale-comptabilite-et-erp", "dematerialisation"],
  },
  {
    kind: "ressource",
    slug: "dematerialisation",
    name: "Dématérialisation",
    seoTitle: "Dématérialisation : définition, avantages et questions à se poser",
    description: "Définition de la dématérialisation, différence avec la numérisation, avantages pour l’entreprise, enjeux, impact écologique et questions avant de se lancer.",
    title: "La dématérialisation, au-delà du « zéro papier ».",
    lead: "Bien plus qu’une tendance, la dématérialisation est au cœur de la transformation digitale des entreprises : un enjeu économique et écologique.",
    minutes: 5,
    sections: [
      {
        id: "definition",
        h: "Définition",
        p: ["Dématérialiser, c’est transférer les données d’un support papier vers le numérique, avec un objectif : réduire drastiquement l’usage du papier dans tous les services."],
      },
      {
        id: "numerisation",
        h: "Dématérialisation ou numérisation ?",
        p: [
          "La numérisation est un acte isolé : scanner un document en PDF. La dématérialisation concerne tout le processus.",
          "Exemple : une facture PDF générée automatiquement par l’ERP, puis transmise et archivée sans jamais être imprimée.",
        ],
      },
      {
        id: "avantages",
        h: "Les avantages pour l’entreprise",
        p: ["Une information centralisée, accessible à tous les collaborateurs :"],
        items: ["Productivité : traitement automatisé des données", "Coûts réduits : moins de papier et d’encre", "Traçabilité : des échanges enregistrés électroniquement", "Espace gagné : plus de mètres carrés d’archives"],
      },
      {
        id: "enjeux",
        h: "Ce que cela transforme",
        p: ["La dématérialisation touche tous les aspects du travail :"],
        items: ["Les documents : contrats, bons de commande, bons d’intervention", "La comptabilité : factures clients et fournisseurs, documents fiscaux", "Les ressources humaines : congés, bulletins de paie", "Les procédures, les échanges et les outils"],
      },
      {
        id: "humain",
        h: "Un projet avant tout humain",
        p: ["Les outils comptent, mais ce sont vos équipes qui feront la réussite du projet. Avancez en douceur, en associant les collaborateurs les moins à l’aise avec l’informatique."],
      },
      {
        id: "questions",
        h: "Les questions à se poser",
        p: ["Avant de choisir un outil, posez-vous les bonnes questions, puis rédigez un cahier des charges :"],
        items: ["De quoi mon entreprise a-t-elle besoin ?", "Mon équipe est-elle prête à changer d’organisation ?", "Quel volume de données faut-il dématérialiser ?", "Quel budget pour la digitalisation ?"],
      },
    ],
    takeaways: ["La dématérialisation vise tout le processus, pas seulement le document", "Productivité, coûts, traçabilité et espace gagnés", "Un projet qui réussit avec les équipes"],
    related: ["dematerialisation-2", "logiciel-erp", "gestion-commerciale-comptabilite-et-erp"],
  },
];
