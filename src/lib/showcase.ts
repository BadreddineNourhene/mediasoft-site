/* Vitrines produits de l'accueil : captures réelles des logiciels (sites sage.tn, ciel.tn, divalto.tn, bitrix24.tn),
   phrase d'accroche reprise du site d'origine, fonctions citées dans les textes d'origine.
   Ordre demandé : Bitrix24 avant Microsoft 365 et Power BI. */
import { links } from "@/lib/site";

export type Showcase = {
  key: string;
  index: string;
  name: string;
  logo: string;
  logoOnDark?: string;
  tagline: string;
  pitch: string;
  chips: string[];
  href: string;
  theme: "dark" | "light";
  bg: string;
  ink: string;
  accent: string;
  screens?: { src: string; alt: string; kind?: "mobile" | "laptop" }[];
  visual?: "m365";
  videoStart: number;
};

export const showcases: Showcase[] = [
  {
    key: "sage100",
    index: "01",
    name: "Sage 100c",
    logo: "/img/logos/Sage_Logo_Brilliant_Green_RGB.webp",
    tagline: "Le socle des entreprises qui voient loin.",
    pitch: "Comptabilité, gestion commerciale, trésorerie et production réunies, de la TPE au groupe.",
    chips: ["Comptable & financière", "Commerciale", "Trésorerie", "Production"],
    href: links.sage100,
    theme: "dark",
    bg: "#04210f",
    ink: "#ffffff",
    accent: "#00d639",
    screens: [
      { src: "/img/produits/s100-ecran.webp", alt: "Sage 100c : écran de gestion commerciale", kind: "laptop" },
      { src: "/img/produits/s100-ca.webp", alt: "Sage 100c : chiffre d’affaires comptable" },
    ],
    videoStart: 7.02,
  },
  {
    key: "sage50",
    index: "02",
    name: "Sage 50c Ciel",
    logo: "/img/logos/logo-ciel.png",
    tagline: "La gestion, sans détour.",
    pitch: "L’essentiel des artisans et des petites entreprises, prêt à l’emploi dès le premier jour.",
    chips: ["Comptabilité", "Devis & factures", "Stocks", "Trésorerie"],
    href: links.sage50,
    theme: "light",
    bg: "#eaf1ff",
    ink: "#0b1a2e",
    accent: "#1f4fd1",
    screens: [
      { src: "/img/produits/s50-factures.webp", alt: "Sage 50c Ciel : liste des pièces clients" },
      { src: "/img/produits/s50-tableau.webp", alt: "Sage 50c Ciel : tableau de bord" },
    ],
    videoStart: 0,
  },
  {
    key: "divalto",
    index: "03",
    name: "Divalto Infinity",
    logo: "/img/logos/logo-divalto.png",
    tagline: "Votre métier a ses règles. Votre ERP aussi.",
    pitch: "Industrie, négoce, services : Divalto Infinity se règle sur vos façons de faire, du bureau au terrain.",
    chips: ["BI", "Cloud", "Mobilité", "Interfaces web"],
    href: links.divalto,
    theme: "light",
    bg: "#fff0e6",
    ink: "#0b1a2e",
    accent: "#ff5500",
    screens: [
      { src: "/img/produits/div-tableau.webp", alt: "Divalto Infinity : tableau de bord" },
      { src: "/img/produits/div-crm-mobile.webp", alt: "Divalto Infinity : CRM sur ordinateur et téléphone" },
    ],
    videoStart: 13.52,
  },
  {
    key: "bitrix24",
    index: "04",
    name: "Bitrix24",
    logo: "/img/logos/logo-bitrix24.png",
    tagline: "Toute l’équipe sur le même fil.",
    pitch: "Clients, ventes, échanges et projets se retrouvent dans un même espace de travail.",
    chips: ["CRM", "Centre de contact", "Entonnoir de vente", "Collaboration"],
    href: links.bitrix24,
    theme: "dark",
    bg: "#062a3d",
    ink: "#ffffff",
    accent: "#2fc6f6",
    screens: [
      { src: "/img/produits/b24-crm.webp", alt: "Bitrix24 : CRM et transactions" },
      { src: "/img/produits/b24-centre-contact.webp", alt: "Bitrix24 : centre de contact" },
    ],
    videoStart: 20.02,
  },
  {
    key: "m365",
    index: "05",
    name: "Microsoft",
    logo: "/img/logos/logo-microsoft-365.png",
    tagline: "Travailler partout. Décider sur pièces.",
    pitch: "Microsoft 365 pour collaborer, Power BI pour lire votre activité, Acronis pour protéger vos données.",
    chips: ["Teams", "Outlook", "OneDrive", "Power BI"],
    href: links.m365,
    theme: "light",
    bg: "#f4f1ff",
    ink: "#0b1a2e",
    accent: "#d83b01",
    visual: "m365",
    videoStart: 27.53,
  },
];

export const heroVideo = {
  src: "/video/hero-logiciels-1080.mp4",
  srcSm: "/video/hero-logiciels-540.mp4",
  poster: "/video/hero-logiciels-poster.jpg",
  chapters: [
    { label: "Sage 50c", start: 0 },
    { label: "Sage 100c", start: 7.02 },
    { label: "Divalto", start: 13.52 },
    { label: "Bitrix24", start: 20.02 },
    { label: "Microsoft", start: 27.53 },
    { label: "Web & IA", start: 40.53 },
  ],
};
