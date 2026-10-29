import type { ModulePage } from "./types";

/* Les six modules de Divalto infinity. Fonctions reprises des pages d'origine de divalto.tn,
   réécrites en phrases courtes ; les références réglementaires françaises ont été retirées. */

export const modulePages: ModulePage[] = [
  {
    kind: "module",
    slug: "gestion-commerciale",
    key: "gc",
    name: "Gestion commerciale",
    seoTitle: "Logiciel de gestion commerciale Divalto infinity",
    description:
      "Stocks, réapprovisionnements, tarifs par client, achats et fournisseurs, réservations, contremarques et acomptes : la gestion commerciale de Divalto infinity pour les PME et ETI en Tunisie.",
    title: "Vendre, acheter, livrer.",
    accent: "Sans jamais perdre le fil.",
    lead: "Des articles aux factures, Divalto infinity gère tout le cycle de vie de vos produits et services : stocks, réapprovisionnements, tarifs, pièces commerciales, clients et fournisseurs.",
    promise: ["Suivre vos produits de A à Z", "Adapter vos tarifs à chaque client", "Anticiper vos ruptures de stock"],
    cap: "tableau",
    scenes: [
      {
        t: "Plus de ruptures surprises",
        d: "Des seuils minimaux déclenchent automatiquement des demandes d’achat. Vous projetez votre stock à un instant donné, réapprovisionnements et réservations compris.",
        items: ["Alertes de stock insuffisant", "Demandes d’achat automatiques", "Projection du stock à l’instant T"],
      },
      {
        t: "Un stock défini, compté et valorisé",
        d: "Biens, matières premières ou consommables : chaque stock est rattaché à son dépôt et à son emplacement, et l’inventaire se prépare dans l’outil.",
        items: ["Dépôts et emplacements", "Calcul des coûts moyens pondérés", "Affectation des coûts de revient", "Préparation de l’inventaire et liste de comptage"],
      },
      {
        t: "Le bon prix pour chaque client",
        d: "Tarifs, remises et promotions se définissent par client, sur plusieurs niveaux. Les encours et relances se gèrent par entité ou par groupement.",
        items: ["Famille d’articles", "Fiche tiers", "Contact", "Catégorie de client"],
      },
      {
        t: "Des achats maîtrisés",
        d: "Coordonnées, articles et tarifs fournisseurs, frais d’approche et délais de livraison : vos achats sont suivis avec l’historique complet de chaque fournisseur.",
        items: ["Tarifs d’achat", "Frais de transport et d’approche", "Délais de livraison", "Historique des mouvements fournisseur"],
      },
    ],
    pointsTitle: "Ce qui fait la différence au quotidien",
    points: [
      { t: "Réservations", d: "Réservez sur du stock disponible, des commandes fournisseurs en cours ou des fabrications à venir." },
      { t: "Inter-agences", d: "Partagez la disponibilité des produits entre agences et automatisez les facturations internes." },
      { t: "Inter-sociétés", d: "Règles communes pour clients, fournisseurs, articles et tarifs ; les pièces réciproques se créent automatiquement." },
      { t: "Acomptes", d: "Déclenchez une ou plusieurs factures d’acompte depuis la commande et suivez leur règlement." },
      { t: "Contremarques", d: "Contremarque directe ou indirecte, définie sur l’article ou au moment de la vente." },
      { t: "Vente comptoir", d: "Vos vendeurs encaissent les clients BtoB au comptoir, depuis le point de vente de l’ERP." },
      { t: "Importations", d: "Suivez vos conteneurs et leur contenu, vos frais d’approche et vos documents de douane." },
    ],
    definition: {
      q: "Qu’est-ce qu’un logiciel de gestion commerciale ?",
      a: "Il réunit dans un même outil toutes les opérations liées aux ventes et aux achats de l’entreprise.",
      items: ["Les produits : référencement, tarifs", "Les achats : demandes de prix, commandes, réceptions", "Les flux logistiques : entrées, sorties, traçabilité", "Les tiers : clients, fournisseurs", "Les pièces commerciales : devis, factures"],
    },
    related: ["wms", "comptabilite-finance", "dematerialisation-2"],
  },
  {
    kind: "module",
    slug: "gpao",
    key: "gpao",
    name: "GPAO",
    seoTitle: "Logiciel GPAO : gestion de production Divalto infinity",
    description:
      "La GPAO de Divalto infinity organise les données de production, planifie les ordres de fabrication, gère le MRP et trace toute la production, à l’affaire comme en série.",
    title: "Produire au meilleur coût,",
    accent: "dans les meilleurs délais.",
    lead: "La GPAO de Divalto infinity organise votre production, même dans les contextes d’exigence qualité les plus élevés. Elle gère tous les modes de production : à l’affaire et en série.",
    promise: ["Organiser les données de production", "Suivre la production en temps réel", "Piloter le calcul des besoins (MRP)"],
    scenes: [
      {
        t: "Tout le cycle de production",
        d: "De la conception des données techniques au bilan de production, chaque étape est couverte, avec des outils d’analyse sur les ordres de fabrication.",
        items: ["Conception des données techniques", "Simulation des ordres de fabrication", "Planification et suivi en temps réel", "Bilans de production"],
      },
      {
        t: "Un planning qui tient la route",
        d: "La GPAO assiste vos plannings de production et ceux de vos collaborateurs, en série comme à l’affaire.",
        items: ["Planning de travail", "Ordonnancement des fabrications", "Suivi des lignes de production"],
      },
      {
        t: "Une traçabilité complète",
        d: "De la matière première aux numéros de série et dates de péremption, toute la production est tracée, dans les deux sens.",
        items: ["Traçabilité ascendante et descendante", "Numéros de lot et de série", "Dates de péremption"],
      },
    ],
    pointsTitle: "Pourquoi une GPAO intégrée à l’ERP",
    points: [
      { t: "La même information pour tous", d: "De la commande client aux saisies des opérateurs, les données de production sont centralisées dans un seul outil." },
      { t: "Des prix au plus juste", d: "Une vision claire de vos coûts pour fixer vos prix et prendre les bonnes décisions." },
      { t: "Un pilotage visible", d: "Des outils de supervision et des indicateurs pour piloter la production." },
      { t: "La qualité outillée", d: "Des fonctions qui supportent les systèmes de management de la qualité." },
      { t: "Des équipes qui se parlent", d: "Le moteur de workflow fluidifie les échanges entre collaborateurs." },
    ],
    definition: {
      q: "Qu’est-ce qu’un logiciel de GPAO ?",
      a: "La gestion de production assistée par ordinateur encadre la conception, la planification des ressources matérielles et humaines, et le contrôle des produits.",
      items: ["Élaborer un planning de travail", "Ordonnancer les fabrications", "Suivre les lignes de production", "Gérer les stocks", "Contrôler la traçabilité", "Maîtriser les coûts de revient"],
    },
    related: ["gestion-a-laffaire", "wms", "gestion-commerciale"],
  },
  {
    kind: "module",
    slug: "gestion-a-laffaire",
    key: "affaire",
    name: "Gestion à l’affaire",
    seoTitle: "Logiciel de gestion à l’affaire Divalto infinity",
    description:
      "Suivez chaque affaire de bout en bout avec Divalto infinity : diagrammes et plan de charge, budgets alloués, engagés et réalisés, facturation, achats et chiffrages.",
    title: "Chaque affaire suivie",
    accent: "du premier devis au SAV.",
    lead: "Du commercial au bureau d’études, des achats à la production, jusqu’à la livraison, l’installation, le SAV et la maintenance : Divalto suit toute la vie d’une affaire ou d’un projet.",
    promise: ["Visualiser l’avancement de vos projets", "Suivre vos budgets en temps réel", "Facturer au bon moment"],
    scenes: [
      {
        t: "Vos projets en diagrammes",
        d: "Diagrammes et plan de charge donnent une visibilité en temps réel sur l’avancement de chaque projet.",
        items: ["Diagrammes de projet", "Plan de charge", "Avancement en temps réel"],
      },
      {
        t: "Une trésorerie assainie",
        d: "L’envoi des factures est automatisé et les budgets s’affichent tels qu’ils sont : alloués, engagés et réalisés.",
        items: ["Budgets alloués, engagés, réalisés", "Facturation automatisée", "Facturation à l’usage"],
      },
      {
        t: "Du temps gagné à chaque étape",
        d: "Facturation, calcul des besoins à l’affaire, réservations, achats et chiffrages sont facilités tout au long du projet.",
        items: ["Calcul des besoins à l’affaire", "Réservations", "Achats", "Chiffrages"],
      },
    ],
    pointsTitle: "Pensé pour les projets complexes",
    points: [
      { t: "Le temps long", d: "Suivre un projet complexe dans le temps, de la conception au prototypage et aux modifications." },
      { t: "Les ressources", d: "Gérer matières, articles, collaborateurs et outils, et leurs disponibilités." },
      { t: "Ouvert", d: "Connectable à des outils tiers (API, IoT…) via des web-services." },
      { t: "Mobile", d: "Application mobile en mode déconnecté pour tablette et smartphone." },
    ],
    related: ["gpao", "gestion-commerciale", "comptabilite-finance"],
  },
  {
    kind: "module",
    slug: "wms",
    key: "wms",
    name: "WMS",
    seoTitle: "Logiciel WMS : gestion d’entrepôt Divalto infinity",
    description:
      "Le WMS natif de Divalto infinity cartographie vos entrepôts et pilote réception, rangement, préparation par vague, réapprovisionnement et expédition, avec terminaux code-barres.",
    title: "Un entrepôt cartographié,",
    accent: "des flux suivis en temps réel.",
    lead: "Le WMS de Divalto infinity cartographie vos espaces de stockage et pilote la réception, la préparation, le réapprovisionnement et l’expédition. Il est natif dans l’ERP : aucune passerelle à construire.",
    promise: ["Optimiser vos entrepôts", "Suivre vos flux de stock en temps réel", "Piloter toute votre activité logistique"],
    cap: "stock",
    scenes: [
      {
        t: "Chaque emplacement connu",
        d: "Le WMS tient compte des caractéristiques physiques de vos produits et de vos alvéoles de stock.",
        items: ["Zone, secteur, allée, niveau, alvéole", "Dimensions et taux de remplissage", "Emplacements mono ou multi-références"],
      },
      {
        t: "Des préparations par vague",
        d: "Les préparations se lancent par vague, en tenant compte de vos contraintes de diffusion et de distribution.",
        items: ["Transporteur", "Priorisation des commandes", "Pré-colisage", "Contrôle pondéral"],
      },
      {
        t: "Une réception sans faille",
        d: "Contrôles, identification du support, étiquette code-barres et stratégies de rangement : toute la réception est prise en charge.",
        items: ["Contrôle qualitatif et quantitatif", "Étiquette support code-barres", "Stratégies de rangement"],
      },
      {
        t: "Le picking toujours approvisionné",
        d: "Réapprovisionnement « à chaud » selon le portefeuille de commandes, ou « à froid » pour anticiper les ruptures.",
        items: ["Réapprovisionnement à chaud", "Réapprovisionnement à froid", "Terminal code-barres ou commandes vocales"],
      },
    ],
    pointsTitle: "Un vrai WMS, intégré en natif",
    points: [
      { t: "Natif", d: "Le WMS partage toutes les données de gestion de l’ERP, sans sas de dialogue à paramétrer." },
      { t: "Temps réel", d: "Les terminaux radiofréquence captent tous les flux au moment où ils se produisent." },
      { t: "Politiques de rangement", d: "Rangements et circulations optimisés pour préparer plus vite." },
      { t: "Relié à la production", d: "La gestion de production s’appuie sur les emplacements du WMS." },
    ],
    definition: {
      q: "Qu’est-ce qu’un logiciel WMS ?",
      a: "Le WMS (Warehouse Management System) pilote et optimise les stocks et l’entrepôt de l’entreprise.",
      items: ["L’organisation de l’entrepôt", "Les arrivées : réception, rangement, contrôles", "Les sorties : préparation, inventaires", "Les expéditions : chargements, EDI", "La saisie : terminaux radio, codes-barres"],
    },
    related: ["gestion-commerciale", "gpao", "comptabilite-finance"],
  },
  {
    kind: "module",
    slug: "comptabilite-finance",
    key: "compta",
    name: "Comptabilité et finances",
    seoTitle: "Logiciel de comptabilité et finances Divalto infinity",
    description:
      "Comptabilité complète, recouvrement des créances, encours clients, échéanciers et trésorerie prévisionnelle : le module Comptabilité et finances de Divalto infinity.",
    title: "Vos chiffres à jour.",
    accent: "Vos créances sous contrôle.",
    lead: "Divalto infinity Finances intègre une comptabilité complète et une gestion avancée des règlements. Ses automatismes vous font gagner du temps, sans rien perdre en simplicité.",
    promise: ["Gérer vos financements", "Accélérer vos règlements", "Suivre vos créances clients en détail"],
    cap: "finance",
    scenes: [
      {
        t: "Le recouvrement piloté",
        d: "Le superviseur de recouvrement suit vos créances, déclenche les actions vers le client et alerte la bonne personne en cas de risque.",
        items: ["Historique des actions de recouvrement", "Workflows d’alerte (commercial, comptable)", "Contentieux automatisé"],
      },
      {
        t: "Les encours à 360°",
        d: "Une vue partagée entre commerciaux et financiers montre toutes les créances d’un client ou les dettes d’un fournisseur, classées par statut de risque.",
        items: ["Litiges", "Impayés", "Promesses", "Déclaration de litige en direct"],
      },
      {
        t: "Des écritures qui se font seules",
        d: "Pointage semi-automatique, écritures générées automatiquement et modifiables, échéanciers d’emprunts et de crédit-bail calculés avec précision.",
        items: ["Pointage semi-automatique", "Écritures automatiques", "Échéanciers d’emprunts et crédit-bail", "Séparation des périodes comptables"],
      },
    ],
    pointsTitle: "La finance, au cœur de l’ERP",
    points: [
      { t: "Visibilité", d: "Trésorerie prévisionnelle issue de vos opérations d’achat et de vente." },
      { t: "Transversalité", d: "Les informations circulent entre profils commerciaux et financiers." },
      { t: "Traçabilité", d: "Le contexte de chaque écriture est enregistré pour une analyse simple après coup." },
      { t: "Temporalité", d: "Consultez balance âgée et grand livre à des dates antérieures." },
      { t: "Adaptabilité", d: "Un paramétrage riche pour suivre vos choix d’organisation." },
    ],
    definition: {
      q: "Que gère un logiciel de comptabilité ?",
      a: "Il couvre la totalité des tâches comptables et financières et donne une visibilité globale sur les comptes de l’entreprise.",
      items: ["Les flux financiers : encaissements, factures", "Les coûts : achat, production, revient", "Le budget : prévisionnel, réalisé, trésorerie", "Le déclaratif"],
    },
    related: ["gestion-commerciale", "dematerialisation-2", "gestion-a-laffaire"],
  },
  {
    kind: "module",
    slug: "dematerialisation-2",
    key: "demat",
    name: "Dématérialisation",
    seoTitle: "Dématérialisation des factures avec Divalto infinity",
    description:
      "Factures clients et fournisseurs dématérialisées, rapprochement automatique avec les commandes, pièces PDF signées et diffusion sécurisée : la dématérialisation intégrée à Divalto infinity.",
    title: "Moins de papier.",
    accent: "Moins d’erreurs, plus de temps.",
    lead: "Divalto infinity génère vos factures clients dématérialisées, réceptionne et traite vos factures fournisseurs. Résultat : des délais et des coûts de traitement réduits, et moins d’erreurs de saisie.",
    promise: ["Moderniser l’image de votre entreprise", "Réduire délais et coûts de traitement", "Éviter les erreurs de saisie"],
    scenes: [
      {
        t: "Les factures fournisseurs, sans ressaisie",
        d: "Courriers, e-mails, EDI ou FTP : les flux entrants sont lus, leurs données extraites et intégrées dans l’ERP, puis répartis entre les bons collaborateurs.",
        items: ["Courriers", "E-mails", "EDI", "FTP"],
      },
      {
        t: "Le rapprochement automatique",
        d: "La facture liée à un achat est rapprochée des commandes et réceptions. Une fois validée, elle est comptabilisée, et son paiement comme son archivage sont accélérés.",
        items: ["Rapprochement commande / réception", "Comptabilisation automatique", "Workflow de validation"],
      },
      {
        t: "Des pièces authentiques",
        d: "Factures, devis, relances et bulletins de paie sont émis en PDF signé par un tiers de confiance, puis diffusés en toute sécurité.",
        items: ["Horodatage et signature", "Accusé de réception et relance automatique", "Archivage à valeur probatoire", "E-mail sécurisé et coffre-fort numérique"],
      },
    ],
    pointsTitle: "Ce que la dématérialisation change",
    points: [
      { t: "Plus de circulation de papier", d: "Un workflow de supervision répartit les tâches entre les collaborateurs concernés." },
      { t: "Moins de risques", d: "Le rapprochement automatique évite les erreurs entre commande, réception et facture." },
      { t: "Une diffusion multicanale", d: "E-mail sécurisé, téléchargement, coffre-fort numérique." },
    ],
    related: ["comptabilite-finance", "gestion-commerciale", "dematerialisation"],
  },
];
