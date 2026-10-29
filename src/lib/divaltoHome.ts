/* Page Divalto (/divalto.tn/) : faits et liens.
   Le contenu vient de la page d'origine https://mediasoft.tn/divalto.tn/ ;
   les pages détaillées restent celles du site WordPress divalto.tn. */

export const DIV_ORANGE = "#ff5500";
export const DIV_INK = "#0d1424";

const W = "/divalto.tn";

/* Vraies captures de Divalto infinity */
export const dcaps = {
  tableau: { src: "/img/produits/div-tableau.webp", alt: "Divalto infinity : tableau de bord, rotation du stock et achats", w: 900, h: 506 },
  finance: { src: "/img/produits/div-finance.webp", alt: "Divalto infinity : statistiques de recouvrement, échéances, balance âgée et impayés", w: 900, h: 506 },
  stock: { src: "/img/produits/div-stock.webp", alt: "Divalto infinity : rotation du stock et carte, sur ordinateur portable", w: 682, h: 366 },
  interventions: { src: "/img/produits/div-crm-mobile.webp", alt: "Divalto : tableau de bord des interventions et application mobile", w: 900, h: 506 },
};

export type Module = { key: string; name: string; short: string; line: string; href: string; cap?: keyof typeof dcaps };

export const dmodules: Module[] = [
  { key: "gc", name: "Gestion commerciale", short: "Ventes & achats", line: "Le cycle commercial et les achats, suivis dans la même plateforme.", href: `${W}/gestion-commerciale/`, cap: "tableau" },
  { key: "gpao", name: "GPAO", short: "Production", line: "La gestion de production assistée par ordinateur, au cœur de l’ERP.", href: `${W}/gpao/` },
  { key: "affaire", name: "Gestion à l’affaire", short: "Projets & affaires", line: "Chaque affaire suivie de bout en bout, comme un projet à part entière.", href: `${W}/gestion-a-laffaire/` },
  { key: "wms", name: "WMS", short: "Entrepôt", line: "La gestion d’entrepôt, reliée aux stocks et aux commandes.", href: `${W}/wms/`, cap: "stock" },
  { key: "compta", name: "Comptabilité et finances", short: "Finance", line: "Comptabilité, échéances et recouvrement, dans le même outil que le reste.", href: `${W}/comptabilite-finance/`, cap: "finance" },
  { key: "demat", name: "Dématérialisation", short: "Documents", line: "Moins de papier : vos documents circulent sous forme numérique.", href: `${W}/dematerialisation-2/` },
];

export const sectors = [
  { name: "Installation et maintenance", href: `${W}/installation-maintenances/` },
  { name: "Industrie", href: `${W}/inductrie/` },
  { name: "Industrie à l’affaire", href: `${W}/industrie-a-laffaire/` },
  { name: "Fournitures industrielles et du bâtiment", href: `${W}/fournitures-industrielles-et-du-batiment/` },
  { name: "Gestion des déchets", href: `${W}/gestion-des-dechets/` },
  { name: "Agroalimentaire", href: `${W}/agroalimentaire/` },
  { name: "Cosmétique", href: `${W}/cosmetique/` },
  { name: "Vins et spiritueux", href: `${W}/vins-et-spiritueux/` },
  { name: "Miroiterie et marbrerie industrielle", href: `${W}/miroiterie-et-marbrerie-industrielle/` },
  { name: "Confection textile", href: `${W}/confection-textile/` },
  { name: "Ingénierie", href: `${W}/ingenierie/` },
  { name: "Bâtiment et travaux publics", href: `${W}/batiment-et-travaux-bublics/` },
  { name: "Pharmaceutique, cosmétique et chimie", href: `${W}/pharmaceutique-cosmetique-chimie/` },
];

export const doors = {
  besoins: { href: `${W}/category/pour-vos-besoins/`, items: ["Gestion commerciale", "Comptabilité et finance", "Dématérialisation", "GPAO", "Gestion à l’affaire", "WMS"] },
  secteurs: [
    { name: "Industrie", href: `${W}/industrie-erp-crm/` },
    { name: "Commerce, négoce et distribution", href: `${W}/commerce-negoce-et-distribution/` },
    { name: "Services", href: `${W}/services/` },
  ],
  secteursHref: `${W}/category/pour-votre-secteur/`,
};

export const resources = [
  { name: "Gestion commerciale, comptabilité et ERP", href: `${W}/gestion-commerciale-comptabilite-et-erp/` },
  { name: "Logiciel ERP", href: `${W}/logiciel-erp/` },
  { name: "Logiciel CRM", href: `${W}/logiciel-crm/` },
  { name: "Dématérialisation", href: `${W}/dematerialisation/` },
];
