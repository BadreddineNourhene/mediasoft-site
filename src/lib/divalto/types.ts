/* Section Divalto : types des contenus. Chaque page garde l'URL d'origine du site WordPress divalto.tn. */

export type Block = { t: string; d?: string; items?: string[] };

export type CapKey = "tableau" | "finance" | "stock" | "interventions";

/* Module de l'ERP (Gestion commerciale, GPAO…) */
export type ModulePage = {
  kind: "module";
  slug: string;
  key: string; // clé du module dans le schéma de la plateforme
  name: string;
  seoTitle: string;
  description: string;
  title: string;
  accent: string; // fin du titre, en orange
  lead: string;
  promise: string[]; // « Avec ce module, vous pourrez »
  cap?: CapKey;
  scenes: Block[]; // fonctions détaillées
  pointsTitle: string;
  points: Block[]; // atouts
  definition?: { q: string; a: string; items?: string[] };
  related: string[]; // slugs
};

/* Solution métier (un secteur) */
export type SectorPage = {
  kind: "secteur";
  slug: string;
  name: string;
  product?: string; // nom de la solution Divalto
  editor?: string; // solution éditée par un partenaire
  icon: string; // nom d'icône lucide (voir SectorIcon)
  seoTitle: string;
  description: string;
  title: string;
  accent: string;
  lead: string;
  audience?: { title: string; items: string[] };
  challenges?: string[];
  answersTitle?: string;
  answers?: Block[];
  extra?: Block;
  quote?: { text: string; who: string };
  cap?: CapKey;
  modules: string[]; // slugs des modules liés
  family?: string; // slug de la famille de secteurs
  thin?: boolean; // page d'origine vide : contenu réduit au vérifiable
  seeAlso?: string; // page qui détaille ce métier
};

/* Famille de secteurs (Industrie, Commerce, Services) */
export type FamilyPage = {
  kind: "famille";
  slug: string;
  name: string;
  icon: string;
  seoTitle: string;
  description: string;
  title: string;
  accent: string;
  lead: string;
  audience?: string;
  enjeux: string[];
  sectors: string[];
  modules: string[];
  cap?: CapKey;
};

/* Dossier de ressources (article) */
export type ResourcePage = {
  kind: "ressource";
  slug: string;
  name: string;
  seoTitle: string;
  description: string;
  title: string;
  lead: string;
  minutes: number;
  sections: { id: string; h: string; p: string[]; items?: string[] }[];
  takeaways: string[];
  related: string[];
};

export type ErpPage = { kind: "erp"; slug: string };

export type DivaltoPage = ModulePage | SectorPage | FamilyPage | ResourcePage | ErpPage;
