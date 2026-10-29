import type { DivaltoPage } from "./types";
import { modulePages } from "./modules";
import { sectorPages, familyPages } from "./sectors";
import { resourcePages } from "./resources";

export * from "./types";
export { modulePages, sectorPages, familyPages, resourcePages };
export { promesseMetier } from "./sectors";

/* Registre de la section Divalto : une entrée par page servie sous /divalto.tn/<slug>/ */
export const BASE = "/divalto.tn";
export const dHref = (slug: string) => `${BASE}/${slug}/`;

export const ERP_SLUG = "erp-divalto-infinity";

export const allPages: DivaltoPage[] = [{ kind: "erp", slug: ERP_SLUG }, ...modulePages, ...sectorPages, ...familyPages, ...resourcePages];

export const findPage = (slug: string) => allPages.find((p) => p.slug === slug);

export const labelOf = (slug: string): string => {
  if (slug === ERP_SLUG) return "ERP divalto infinity";
  const p = findPage(slug);
  return p && "name" in p ? p.name : slug;
};

/* Catégories (pages d'archive WordPress, vides à l'origine, devenues des pages d'orientation) */
export const categories = {
  "pour-vos-besoins": { title: "Pour vos besoins", h: "Partez de votre besoin.", accent: "Trouvez le module qui y répond.", lead: "Ventes, production, projets, entrepôt, finance ou documents : chaque module de Divalto infinity répond à un besoin précis, et tous partagent les mêmes données." },
  "pour-votre-secteur": { title: "Pour votre secteur", h: "Partez de votre secteur.", accent: "Divalto le connaît déjà.", lead: "Industrie, commerce et négoce, services terrain : trois familles de métiers, et des solutions métiers packagées pour aller plus vite." },
  "solutions-metiers": { title: "Solutions métiers", h: "Des solutions métiers", accent: "prêtes pour votre activité.", lead: "Des progiciels packagés pour les besoins spécifiques d’un métier : paramétrés d’avance, disponibles en SaaS, pour un déploiement rapide et simple." },
} as const;
export type CategorySlug = keyof typeof categories;
export const catHref = (slug: CategorySlug) => `${BASE}/category/${slug}/`;

/* Page ERP divalto infinity */
export const erp = {
  seoTitle: "ERP divalto infinity : le logiciel ERP 100 % cloud des PME et ETI",
  description:
    "Divalto infinity, ERP complet et 100 % cloud pour PME et ETI : gestion commerciale, GPAO, gestion à l’affaire, WMS, comptabilité, GMAO et qualité. Revendeur Divalto en Tunisie : Mediasoft.",
  reasons: [
    { t: "100 % cloud", d: "Toute la puissance de l’ERP, sans les contraintes d’infrastructure." },
    { t: "Ouvert", d: "Interopérable avec vos outils : MES, open banking, e-virement, e-paiement, APS…" },
    { t: "Pensé métier", d: "Une compréhension fine des besoins de chaque activité." },
    { t: "Toujours à jour", d: "Conforme aux dernières réglementations, sécurisé et évolutif." },
  ],
  modules: [
    { name: "Gestion commerciale", slug: "gestion-commerciale", blocks: [
      { t: "Tout le cycle de vie des produits", d: "Stocks, réapprovisionnements, articles et services, déclinaisons, produits composés, remises, pièces commerciales et clients." },
      { t: "Des stocks maîtrisés", d: "Visibilité totale du stock, besoin calculé par produit, réservation d’articles et documents comptables générés automatiquement." },
      { t: "Moins de tâches répétitives", d: "L’ERP automatise, calcule et simplifie les saisies et les processus." },
    ] },
    { name: "GPAO", slug: "gpao", blocks: [
      { t: "Tout le cycle de production", d: "Données techniques, simulation des ordres de fabrication, planification et suivi en temps réel." },
      { t: "Un planning optimisé", d: "Tous les modes de production, à l’affaire et en série, pour produire au meilleur coût." },
      { t: "Une traçabilité complète", d: "De la matière première aux numéros de lot." },
    ] },
    { name: "Gestion à l’affaire", slug: "gestion-a-laffaire", blocks: [
      { t: "Vos projets en diagrammes", d: "Diagrammes et plan de charge : l’avancement en temps réel." },
      { t: "Une trésorerie assainie", d: "Factures envoyées automatiquement, budgets alloués, engagés et réalisés." },
      { t: "Du temps gagné", d: "Facturation, calcul des besoins, réservations, achats et chiffrages facilités." },
    ] },
    { name: "WMS", slug: "wms", blocks: [
      { t: "Des entrepôts cartographiés", d: "Mieux organisés, avec des saisies facilitées pour les équipes." },
      { t: "Tous les flux pilotés", d: "Réception, rangement, préparation, inventaires, expéditions et saisie par code-barres." },
      { t: "Plus de rentabilité", d: "Préparer et expédier plus vite." },
    ] },
    { name: "Comptabilité et finances", slug: "comptabilite-finance", blocks: [
      { t: "Des écritures simplifiées", d: "Des facilités de saisie, même pour les situations complexes." },
      { t: "La trésorerie prévisionnelle", d: "Anticipez votre situation bancaire à partir de vos opérations d’achat et de vente." },
      { t: "En conformité", d: "Les dernières réglementations intégrées." },
    ] },
    { name: "GMAO-GRM", slug: null, blocks: [
      { t: "La maintenance du parc suivie", d: "Un outil de prévision pour suivre la maintenance de vos ressources matérielles." },
      { t: "Vos équipements maîtrisés", d: "Garanties, actifs, pannes, planification, ordres d’intervention et de maintenance, métrologie." },
      { t: "Les maintenances anticipées", d: "Un compteur en jours d’utilisation vous alerte avant les prochaines interventions." },
    ] },
    { name: "Qualité-SMQ", slug: null, blocks: [
      { t: "Un suivi qualité fiable", d: "Évaluation des fournisseurs, non-conformités, actions correctives et coût d’obtention de la qualité." },
      { t: "Personnalisable", d: "Le module s’adapte à vos besoins." },
      { t: "Des saisies plus rapides", d: "Événements, actions et choix des prestataires saisis plus vite." },
    ] },
  ],
};
