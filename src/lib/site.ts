/* Mediasoft — contenu central du site.
   Textes, coordonnées et liens repris du site d'origine (www.mediasoft.tn) et de sa refonte PHP
   (inc/data.php). Modifier une valeur ici la met à jour partout. */

export const SITE_URL = "https://www.mediasoft.tn";

export const site = {
  name: "Mediasoft",
  legalName: "MediaSoft sarl",
  tagline:
    "Expert dans l’intégration de solutions de gestion et de digitalisation, revendeur et intégrateur Sage et Divalto en Tunisie.",
  email: "info@mediasoft.tn",
  founded: 2001,
  techPhones: [
    { label: "+216 31 435 825", href: "tel:+21631435825" },
    { label: "+216 73 822 546", href: "tel:+21673822546" },
  ],
  recaptchaSiteKey: "6Lek5kAsAAAAAGJVQVWGp8O2FeIs8piaZUHxKb7y",
  gtmId: "GTM-MS7MP5N",
  tidioSrc: "//code.tidio.co/ngramdass4cri1rgfppbtwfcwyd382eg.js",
};

/* Liens officiels. Les pages internes gardent leurs URL d'origine (.html),
   les sites produits restent dans leurs dossiers WordPress (/sage.tn/, /divalto.tn/, /bitrix24.tn/). */
export const links = {
  home: "/",
  contact: "/site/formulaire.php",
  sendForm: "/site/send.php",
  m365: "/microsoft-365-PowerBI.html",
  m365PowerBi: "/microsoft-365-PowerBI.html#powerBI",
  powerbi: "/PowerBI-Tunisie.html",
  privacy: "/Politique%20de%20confidentialit%C3%A9.html",
  login: "/login.html",
  helpdesk: "https://helpdesk-ms.com/",
  supportDownload: "https://www.mediasoft.tn/telechargement/TeamViewer%20Mediasoft2.exe",
  teamviewer: "https://898.tv/MEDIASOFTSUPPORT",
  sage50: "http://www.ciel.tn/",
  sage100: "/sage.tn/sage-100/",
  divalto: "/divalto.tn/",
  bitrix24: "/bitrix24.tn/",
  googleReview: "https://g.page/r/Capamq4qYKlBEAI/review",
  facebook: "https://www.facebook.com/mediasoftsousse/",
  linkedin: "https://www.linkedin.com/company/mediasoft-tunisie/",
  whatsapp: "https://api.whatsapp.com/send?phone=+21652444444",
  whatsappMs: "https://api.whatsapp.com/send?phone=+21650459224",
} as const;

export const isExternal = (href: string) => /^(https?:)?\/\//.test(href);

export type Office = {
  key: string;
  label: string;
  area: string;
  address: string;
  tel: string;
  telHref: string;
  email: string;
  map: string;
  mapOpen: string;
};

export const offices: Office[] = [
  {
    key: "tunis",
    label: "Siège Tunis",
    area: "Pour assister nos clients de la capitale et du nord.",
    address: "Av, Hédi Nouira Immeuble le Moulin Bureau Nº2 - Ennasr II - 2037 Ariana",
    tel: "(+216) 31 435 825",
    telHref: "tel:+21631435825",
    email: "info@mediasoft.tn",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192.3913682705725!2d10.158077075604574!3d36.857049972230875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd33b0033046dd%3A0xc6fd332338cf1cd1!2sMediasoft!5e0!3m2!1sfr!2stn!4v1689592691700!5m2!1sfr!2stn",
    mapOpen: "https://www.google.com/maps/search/?api=1&query=Mediasoft%2C+Ennasr+II%2C+Ariana",
  },
  {
    key: "sousse",
    label: "Agence Sousse",
    area: "Pour assister nos clients du Sahel et du sud.",
    address: "Av, Yesser Arafet Immeuble Marwa 1er étage Bureau Nº1, 4054 Sahloul Sousse",
    tel: "(+216) 73 822 546",
    telHref: "tel:+21673822546",
    email: "info@mediasoft.tn",
    map: "https://www.google.com/maps?q=Immeuble+Marwa%2C+Avenue+Yasser+Arafat%2C+Sahloul%2C+Sousse%2C+Tunisie&z=16&hl=fr&output=embed",
    mapOpen: "https://www.google.com/maps/search/?api=1&query=Immeuble+Marwa%2C+Avenue+Yasser+Arafat%2C+Sahloul%2C+Sousse",
  },
];

export type NavChild = { label: string; href: string; logo?: string; text: string };
export type NavItem = { key: string; label: string; href?: string; children?: NavChild[] };

/* Menu principal : même structure que le site d'origine. */
export const nav: NavItem[] = [
  { key: "accueil", label: "Accueil", href: links.home },
  {
    key: "sage",
    label: "Sage",
    children: [
      {
        label: "Sage 50Cloud",
        href: links.sage50,
        logo: "/img/logos/logo-ciel.png",
        text: "Comptabilité, devis, factures, gestion des stocks et trésorerie pour les artisans et petites entreprises.",
      },
      {
        label: "Sage 100Cloud",
        href: links.sage100,
        logo: "/img/logos/Sage_Logo_Brilliant_Green_RGB.webp",
        text: "La gestion d'entreprise à la carte : gestion comptable et financière, commerciale, trésorerie et production.",
      },
    ],
  },
  { key: "divalto", label: "Divalto", href: links.divalto },
  { key: "bitrix24", label: "Bitrix24", href: links.bitrix24 },
  {
    key: "microsoft",
    label: "Microsoft",
    children: [
      {
        label: "Microsoft 365",
        href: links.m365,
        logo: "/img/logos/logo-microsoft-365.png",
        text: "Office 365 et Microsoft 365 Apps : créer, partager et collaborer en tout lieu, sur tout appareil.",
      },
      {
        label: "Microsoft Power BI",
        href: links.powerbi,
        logo: "/img/logos/logo-power-bi.png",
        text: "La plateforme Microsoft de business intelligence : connectez, visualisez et partagez vos données.",
      },
    ],
  },
];

export type Product = {
  key: string;
  name: string;
  short: string;
  tag: string;
  href: string;
  logo: string;
  text: string;
  more?: string;
  modules?: string[];
};

/* Produits : textes des cartes et des diapositives du site d'origine. */
export const products: Product[] = [
  {
    key: "sage100",
    name: "Sage 100c",
    short: "Sage 100",
    tag: "De la TPE au groupe",
    href: links.sage100,
    logo: "/img/logos/Sage_Logo_Brilliant_Green_RGB.webp",
    text: "Une solution informatique avec Sage, un métier, une réponse à chaque spécificité métiers.",
    more: "Sage100 développe des logiciels de comptabilité pour tous les types d’entreprises, de la TPE à la PME au groupe multinational, dans tous les secteurs d’activité.",
    modules: ["Gestion comptable et financière", "Gestion commerciale", "Trésorerie", "Production"],
  },
  {
    key: "divalto",
    name: "Divalto",
    short: "Divalto Infinity",
    tag: "ERP · PME",
    href: links.divalto,
    logo: "/img/logos/logo-divalto.png",
    text: "La solution Divalto est adaptée aux besoins des PME. Elle offre une gestion plus efficace.",
    more: "Bénéficiez d’un ERP innovant et d’une solution personnalisée adaptée à votre secteur d’activité.",
  },
  {
    key: "sage50",
    name: "Sage 50c",
    short: "Sage 50c (Ciel)",
    tag: "Petites entreprises",
    href: links.sage50,
    logo: "/img/logos/logo-ciel.png",
    text: "Ciel accompagne les petites entreprises dans leur gestion avec une gamme de logiciels simples.",
    more: "Gérez votre activité en temps réel avec une solution complète de gestion d'entreprise et d'outils bureautiques connectés.",
  },
  {
    key: "powerbi",
    name: "Power BI",
    short: "Power BI",
    tag: "Business Intelligence",
    href: links.m365PowerBi,
    logo: "/img/logos/logo-power-bi-icon.svg",
    text: "La puissance de la Business Intelligence décisionnelle, développée par Microsoft.",
    more: "Connectez, visualisez et partagez vos données.",
  },
  {
    key: "m365",
    name: "Microsoft 365",
    short: "Microsoft 365",
    tag: "Travail collaboratif",
    href: links.m365,
    logo: "/img/logos/logo-microsoft-365.png",
    text: "Une solution intégrée incluant Office 365, des fonctionnalités de sécurité avancées et favorisant le travail collaboratif.",
    more: "Créez, partagez et collaborez en tout lieu, sur tout appareil.",
  },
  {
    key: "bitrix24",
    name: "Bitrix24",
    short: "Bitrix24",
    tag: "Tout-en-un",
    href: links.bitrix24,
    logo: "/img/logos/logo-bitrix24.png",
    text: "Remplacez une multitude d'applications et de fournisseurs par un seul système qui regroupe toutes les fonctionnalités.",
    more: "Un moyen simple de gagner en efficacité et en polyvalence.",
  },
];

export const partnerLogos = [
  { src: "/img/logos/Sage_Logo_Brilliant_Green_RGB.webp", alt: "Sage", href: links.sage100 },
  { src: "/img/logos/logo-ciel.png", alt: "Ciel", href: links.sage50 },
  { src: "/img/logos/logo-divalto.png", alt: "Divalto", href: links.divalto },
  { src: "/img/logos/logo-microsoft-365.png", alt: "Microsoft 365", href: links.m365 },
  { src: "/img/logos/logo-bitrix24.png", alt: "Bitrix24", href: links.bitrix24 },
];

export const values = [
  { title: "Proximité", short: "Au plus près de vos ambitions.", text: "Pour se rapprocher des ambitions de nos clients et garantir notre implication." },
  { title: "Positivité", short: "Chaque problème a sa solution.", text: "Chaque problématique a une solution et représente une opportunité pour nous." },
  { title: "Expertise", short: "L’excellence comme objectif.", text: "Nous développons notre expertise et notre polyvalence afin d’atteindre l’excellence." },
  { title: "Engagement", short: "Impliqués au quotidien.", text: "Nos convictions et notre volonté d’agir contribuent pleinement à notre implication quotidienne." },
];

export const method = [
  {
    title: "Comprendre",
    img: "/img/methode/methode-01-analyse.webp",
    alt: "Bureau vu du dessus : ordinateur portable, carnets, crayon et loupe",
    text: ["Nous partons de votre façon de travailler et de vos attentes, pas d’un catalogue."],
  },
  {
    title: "Cadrer",
    img: "/img/methode/methode-02-recherche.webp",
    alt: "Ordinateur portable affichant un tableau de bord de données",
    text: ["Nous recueillons l’information auprès de vos équipes pour définir précisément le besoin."],
  },
  {
    title: "Construire",
    img: "/img/methode/methode-03-realisation.webp",
    alt: "Code source affiché sur un ordinateur portable dans une lumière bleue",
    text: ["Paramétrage et développement des modules spécifiques : la solution prend forme."],
  },
  {
    title: "Valider",
    img: "/img/methode/methode-04-test.webp",
    alt: "Lunettes posées devant un écran affichant du code",
    text: ["Chaque fonction est testée avec vous avant la mise en service. Un bug est une occasion de s’améliorer."],
  },
];

/* Choix « Quelle est votre demande ? » du formulaire de contact d'origine (envoyés sous option[]). */
export const requestOptions = [
  "Je suis un client Sage 100",
  "Je suis un client Sage 50Ciel",
  "Je suis un client Divalto",
  "Je suis un client Bitrix24",
  "Je suis un client Microsoft365",
  "Je suis un client Power BI",
  "Hébergement Cloud",
  "Je souhaite une solution sur mesure (site, application, agent IA)",
  "Je souhaite une démonstration",
  "Je souhaite être contacté",
  "Autre",
];
