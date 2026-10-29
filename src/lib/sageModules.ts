import { BarChart3, BellRing, FileCheck2, FileText, Landmark, Package, Smartphone, type LucideIcon } from "lucide-react";

/* Pages modules Sage 100, servies aux adresses d'origine /sage.tn/<slug>/.
   Contenus repris des pages https://mediasoft.tn/sage.tn/<slug>/ (titres, avantages, fonctionnalités, brochures).
   Captures : celles des pages d'origine, dont on a gardé l'écran seul (public/img/sage100/…). */

export type SageModule = {
  slug: string;
  name: string;
  pill: string;
  title: string;
  titleAccent: string;
  lead: string;
  brochure: string;
  notes: { icon: LucideIcon; k: string; t: string; pos: string }[];
  secondary: number;
  benefitsEyebrow: string;
  benefitsTitle: string;
  benefitsAccent: string;
  benefits: { n: string; t: string; d: string }[];
  featuresEyebrow: string;
  featuresTitle: string;
  featuresAccent: string;
  features: { t: string; d: string; items: string[]; img: string; alt: string }[];
};

const PDF = "https://mediasoft.tn/sage.tn/pdf/";
const POS = ["right-[-3%] top-[10%]", "left-[-4%] top-[44%]", "right-[2%] bottom-[4%]"];

export const comptabilite: SageModule = {
  slug: "sage-100-comptabilite",
  name: "Sage 100 Comptabilité",
  pill: "Sage 100 · Comptabilité",
  title: "Votre comptabilité,",
  titleAccent: "pensée pour les PME.",
  lead: "Amorcez la croissance de votre activité : Sage 100 Comptabilité vous permet de piloter votre entreprise de façon sécurisée et en toute simplicité.",
  brochure: `${PDF}18-DF%20Sage%20100%20Comptabilite_032023.pdf`,
  notes: [
    { icon: Landmark, k: "Banque", t: "Rapprochement bancaire automatique", pos: POS[0] },
    { icon: BellRing, k: "Tiers", t: "Relance client préparée", pos: POS[1] },
    { icon: FileCheck2, k: "Conformité", t: "F.E.C. définitif généré", pos: POS[2] },
  ],
  secondary: 2,
  benefitsEyebrow: "Une solution complète et évolutive",
  benefitsTitle: "Moins de saisie.",
  benefitsAccent: "Plus de pilotage.",
  benefits: [
    { n: "01", t: "Une productivité optimisée", d: "Libérez-vous des tâches administratives grâce aux nombreux automatismes, et évitez les saisies récurrentes." },
    { n: "02", t: "Des fonctions d’analyse", d: "Analysez vos charges et connaissez rapidement le coût de production de vos produits ou services." },
    { n: "03", t: "Une comptabilité en temps réel", d: "Suivez les ratios financiers de votre PME pour des informations instantanées et une gestion exacte." },
    { n: "04", t: "Moins de risques", d: "Identifiez et anticipez les retards de paiement au quotidien pour réduire le risque client." },
  ],
  featuresEyebrow: "Une gestion comptable simplifiée",
  featuresTitle: "Sage 100 Comptabilité facilite",
  featuresAccent: "votre gestion au quotidien.",
  features: [
    {
      t: "Comptabilité générale et auxiliaire",
      d: "Les fonctions comptables essentielles réunies dans une solution intégrée.",
      items: ["Saisie simplifiée", "Documents prêts à l’emploi", "Gestion des abonnements", "Rapprochement bancaire manuel et automatique", "Reporting et contrôles comptables", "Gestion des collaborateurs"],
      img: "/img/sage100/compta/compta-generale.webp",
      alt: "Sage 100c Comptabilité : ajout d’une pièce comptable",
    },
    {
      t: "Comptabilité analytique",
      d: "Tout le potentiel des fonctions d’analyse.",
      items: ["Plans analytiques structurés", "Bilan et compte de résultat analytiques", "Balance, grand livre et autres états"],
      img: "/img/sage100/compta/compta-analytique.webp",
      alt: "Sage 100c Comptabilité : interrogation d’une section analytique",
    },
    {
      t: "Suivi des tiers",
      d: "Contrôlez les échéances et réduisez les risques.",
      items: ["Gestion des relances clients", "Interrogation et état des comptes", "Gestion des recouvrements"],
      img: "/img/sage100/compta/compta-tiers.webp",
      alt: "Sage 100c Comptabilité : visualisation des relances préventives",
    },
    {
      t: "Conformité et précision",
      d: "Une comptabilité sans faute, prête en cas de contrôle fiscal.",
      items: ["Conformité légale IAS / IFRS", "État de pré-contrôle", "Fichier des écritures comptables (F.E.C.) provisoire et définitif", "Attestation F.E.C.", "Sauvegarde fiscale automatisée"],
      img: "/img/sage100/compta/compta-conformite.webp",
      alt: "Sage 100c Comptabilité : sauvegarde fiscale des données",
    },
  ],
};

export const gestionCommerciale: SageModule = {
  slug: "sage-100-gestion-commerciale",
  name: "Sage 100 Gestion commerciale",
  pill: "Sage 100 · Gestion commerciale",
  title: "Pilotez vos ventes,",
  titleAccent: "du devis à la facture.",
  lead: "Avec Sage 100 Gestion commerciale, maîtrisez l’intégralité de votre chaîne commerciale et accélérez votre processus de vente : du devis à la facturation, en passant par l’approvisionnement et les stocks.",
  brochure: `${PDF}26-FP%20Sage%20100%20Gestion_Commerciale_112022.pdf`,
  notes: [
    { icon: FileText, k: "Ventes", t: "Devis transformé en commande", pos: POS[0] },
    { icon: Package, k: "Stocks", t: "Réception fournisseur enregistrée", pos: POS[1] },
    { icon: FileCheck2, k: "Facturation", t: "Facture transférée en comptabilité", pos: POS[2] },
  ],
  secondary: 3,
  benefitsEyebrow: "Maîtrisez votre chaîne commerciale",
  benefitsTitle: "Une seule saisie.",
  benefitsAccent: "Tout le cycle de vente.",
  benefits: [
    { n: "01", t: "Des ventes accélérées", d: "Devis, commande, livraison, facture, retour, avoir : un parcours automatisé, avec une seule saisie de vos données." },
    { n: "02", t: "Une politique tarifaire optimisée", d: "Catalogue personnalisable, nomenclatures, articles liés, prix selon les volumes et les promotions." },
    { n: "03", t: "Des achats et des stocks rationalisés", d: "Prix moyens, contremarques, choix des fournisseurs, contrôles qualité : des achats en flux tendu." },
    { n: "04", t: "Des clients fidélisés", d: "L’historique commercial et financier de vos clients centralisé, pour des opérations de fidélisation ciblées." },
  ],
  featuresEyebrow: "Fonctionnalités",
  featuresTitle: "Une gestion commerciale complète,",
  featuresAccent: "évolutive et personnalisable.",
  features: [
    {
      t: "Gérez intégralement vos ventes",
      d: "Saisie rapide des documents commerciaux, avec contrôles et calculs automatiques.",
      items: ["Articles par référence ou code-barres", "Transformation des pièces sans ressaisie", "Tarifs personnalisés, soldes et promotions", "Frais d’approche et de port", "Bundles, nomenclatures, conditionnements", "Articles de substitution"],
      img: "/img/sage100/gc/gc-ventes.webp",
      alt: "Sage 100c Gestion commerciale : historique des lignes d’un document, du devis à la facture",
    },
    {
      t: "Dématérialisez vos documents",
      d: "Envois rapides et sécurisés, réception et saisie automatisées de vos factures.",
      items: ["Suivi des factures en temps réel", "Traçabilité de la chaîne de facturation", "Respect des délais de paiement", "Facturation électronique conforme"],
      img: "/img/sage100/gc/gc-demat.webp",
      alt: "Sage 100c Gestion commerciale : transformation de documents de vente",
    },
    {
      t: "Améliorez votre suivi client",
      d: "Des conditions commerciales sur mesure pour chaque client ou catégorie.",
      items: ["Contrôle des encours", "Restrictions en cas de dépassement", "Historiques et interrogation des comptes", "Rappels"],
      img: "/img/sage100/gc/gc-clients.webp",
      alt: "Sage 100c Gestion commerciale : chiffre d’affaires commercial",
    },
    {
      t: "Rationalisez achats et stocks",
      d: "Toute la chaîne des documents d’achat, et un stock en flux tendu.",
      items: ["Prix d’achat en CMUP, FIFO et LIFO", "Import des tarifs fournisseurs", "Multi-dépôts et transferts", "Inventaires et états de stocks"],
      img: "/img/sage100/gc/gc-achats.webp",
      alt: "Sage 100c Gestion commerciale : facture d’achat",
    },
    {
      t: "Des outils connectés",
      d: "Vos données partagées avec vos autres solutions Sage 100.",
      items: ["CRM, Comptabilité, Saisie de caisse décentralisée", "GPAO, Etendue, GEIDE", "Pilotage XL et copier-coller vers Excel"],
      img: "/img/sage100/gc/gc-connectes.webp",
      alt: "Sage 100c Gestion commerciale : page d’accueil IntuiSage",
    },
    {
      t: "Pilotez votre entreprise",
      d: "Des rapports en temps réel et des tableaux de bord synthétiques.",
      items: ["290 états standard", "États et KPI personnalisés", "Marges par client, représentant, article", "Simulations de chiffre d’affaires"],
      img: "/img/sage100/gc/gc-pilotage.webp",
      alt: "Sage 100c Gestion commerciale : portefeuille d’encours",
    },
  ],
};

export const entreprise: SageModule = {
  slug: "sage-100-entreprise",
  name: "Sage 100 Entreprise",
  pill: "Sage 100 · Entreprise",
  title: "Toute votre gestion,",
  titleAccent: "dans une seule suite.",
  lead: "Avec Sage 100 Entreprise, bénéficiez de la richesse d’une suite de gestion complète, 100 % conçue pour les PME : intégrée, flexible, et modulable selon vos objectifs.",
  brochure: `${PDF}34-FP%20Sage%20100%20Entreprise_012023.pdf`,
  notes: [
    { icon: BarChart3, k: "Reporting", t: "Tableau de bord actualisé", pos: POS[0] },
    { icon: FileText, k: "Commercial", t: "Facture transférée en comptabilité", pos: POS[1] },
    { icon: Smartphone, k: "Mobilité", t: "Activité consultée en déplacement", pos: POS[2] },
  ],
  secondary: 1,
  benefitsEyebrow: "Optimisez le pilotage de votre activité",
  benefitsTitle: "Un système centralisé.",
  benefitsAccent: "Des processus optimisés.",
  benefits: [
    { n: "01", t: "Des analyses simplifiées", d: "Automatisez votre reporting et partagez vos documents simplement." },
    { n: "02", t: "Une suite de gestion complète", d: "Bénéficiez de tout le potentiel d’une solution évolutive." },
    { n: "03", t: "Un système agile", d: "Gérez votre PME à distance grâce à une prise en charge mobile." },
  ],
  featuresEyebrow: "Fonctionnalités",
  featuresTitle: "Une gestion intégrée et flexible,",
  featuresAccent: "à moduler selon vos objectifs.",
  features: [
    {
      t: "Gestion de l’activité commerciale",
      d: "Du devis à la facturation, en passant par l’approvisionnement, les stocks et le pilotage, en toute mobilité.",
      items: ["Devis et commandes", "Bons de livraison", "Factures", "Transferts en comptabilité"],
      img: "/img/sage100/ent/ent-commerciale.webp",
      alt: "Sage 100c : portefeuille d’encours de la gestion commerciale",
    },
    {
      t: "Gestion comptable",
      d: "Piloter votre entreprise de façon sécurisée, dans un contexte légal et économique en perpétuelle évolution.",
      items: ["Gestion au quotidien simplifiée", "Pilotage sécurisé", "Adaptée aux évolutions légales"],
      img: "/img/sage100/ent/ent-comptable.webp",
      alt: "Sage 100 Comptabilité : encours clients sur la page d’accueil IntuiSage",
    },
    {
      t: "Reporting et tableaux de bord",
      d: "L’activité de votre entreprise en temps réel, pour des décisions plus avisées, sur site comme en déplacement.",
      items: ["Suivi en temps réel", "Informations exhaustives", "Accessible en déplacement"],
      img: "/img/sage100/ent/ent-reporting.webp",
      alt: "Sage 100c : chiffre d’affaires commercial comparé sur deux exercices",
    },
  ],
};

export const sageModules = { comptabilite, gestionCommerciale, entreprise };
