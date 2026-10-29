/* Microsoft 365 / Office 365 — offres et comparatif repris de la page microsoft-365-PowerBI.html d'origine. */

export const m365Apps = [
  ["outlook", "Outlook"],
  ["excel", "Excel"],
  ["powerpoint", "PowerPoint"],
  ["onenote", "OneNote"],
  ["onedrive", "OneDrive"],
  ["mssteam", "Teams"],
  ["msexchange", "Exchange"],
  ["msplanner", "Planner"],
  ["form", "Forms"],
  ["access", "Access"],
  ["mspowerBi", "Power BI"],
  ["powerapp", "Power Apps"],
] as const;

export const m365Plans: { key: string; tag: string; name: string; intro: string; apps: string[]; features: string[]; featured?: boolean }[] = [
  {
    key: "basic",
    tag: "Business Basic",
    name: "Microsoft 365 Business Basic",
    intro: "Démarrer avec les applications web et mobiles",
    apps: ["mssteam:Teams", "onedrive:OneDrive", "sharepoint:SharePoint", "msexchange:Exchange", "word:Word (web)", "excel:Excel (web)", "powerpoint:PowerPoint (web)", "outlook:Outlook (web)"],
    features: [
      "Versions web et mobile de Word, Excel, PowerPoint et Outlook uniquement",
      "Participez à des conversations instantanées, passez des appels et réunissez jusqu’à 300 participants",
      "1 To d’espace de stockage en ligne par utilisateur",
      "Service de courrier professionnel",
      "Gestion des rendez-vous avec vos clients",
      "Sécurité standard",
      "Support web et téléphonique 24 h/24, 7 j/7",
    ],
  },
  {
    key: "standard",
    tag: "Business Standard",
    name: "Microsoft 365 Business Standard",
    intro: "Tout ce que contient la version Microsoft 365 Business Basic, plus :",
    apps: ["word:Word", "excel:Excel", "powerpoint:PowerPoint", "outlook:Outlook", "mssteam:Teams", "onedrive:OneDrive", "sharepoint:SharePoint", "msexchange:Exchange", ":Publisher (pour PC)", "access:Access (PC uniquement)"],
    features: [
      "Versions pour appareils de bureau de Word, Excel, PowerPoint et Outlook",
      "Organisation aisée de webinaires",
      "Inscription des participants et outils de création de rapports",
      "Des outils pour créer des documents personnalisés et des mises en page professionnelles",
    ],
    featured: true,
  },
  {
    key: "premium",
    tag: "Business Premium",
    name: "Microsoft 365 Business Premium",
    intro: "Tous les avantages de Microsoft 365 Business Standard, plus :",
    apps: ["word:Word", "excel:Excel", "powerpoint:PowerPoint", "outlook:Outlook", "mssteam:Teams", "onedrive:OneDrive", "sharepoint:SharePoint", "msexchange:Exchange", ":Publisher (pour PC)", "access:Access (pour PC)", ":Intune", ":Azure Information Protection"],
    features: ["Sécurité avancée", "Contrôle des accès et données", "Protection contre les cybermenaces"],
  },
];

/* [Basic, Standard, Premium] */
export const m365Compare: { title: string; inc: [boolean, boolean, boolean]; details: string[] }[] = [
  {
    title: "Courrier et calendrier",
    inc: [true, true, true],
    details: [
      "Utilisez un service de courrier professionnel (nom@votreentreprise.com)",
      "Hébergez et administrez votre courrier grâce à une boîte aux lettres de 50 Go",
      "Planifiez des réunions et répondez facilement aux invitations grâce aux calendriers partagés",
      "Gérez votre calendrier, partagez les horaires de réunion disponibles, planifiez des réunions et recevez des rappels",
    ],
  },
  {
    title: "Stockage et partage de fichiers",
    inc: [true, true, true],
    details: [
      "Collaborez dans le même fichier grâce à des fonctionnalités de co-création et d’édition",
      "Accédez à vos fichiers sur votre ordinateur, tablette ou smartphone",
      "Conservez vos fichiers enregistrés en sécurité, à jour et accessibles sur différents appareils",
    ],
  },
  {
    title: "Travail en équipe et communication",
    inc: [true, true, true],
    details: [
      "Conversez à deux ou en groupe et enregistrez des messages pour y accéder rapidement",
      "Organisez des réunions sécurisées incluant les flux audio et vidéo, le partage d’écran et une option d’enregistrement",
      "Créez des sites d’équipe pour partager des informations, du contenu et des fichiers via votre intranet à l’aide de SharePoint",
      "Conviez des personnes extérieures à votre entreprise à vos réunions, même si elles n’ont pas de compte Teams",
    ],
  },
  {
    title: "Sécurité et conformité standard",
    inc: [true, true, true],
    details: [
      "Protégez votre entreprise contre le courrier indésirable et les programmes malveillants grâce à une fonctionnalité de filtrage du courrier basée sur le cloud",
      "Gérez les menaces pour la sécurité en créant des stratégies de mot de passe",
      "Sécurisez l’accès à l’authentification multifacteur",
      "Contrôlez l’accès aux informations de votre entreprise à l’aide de groupes de sécurité et d’autorisations personnalisées",
    ],
  },
  {
    title: "Gestion des projets et de la relation client",
    inc: [true, true, true],
    details: [
      "Créez, gérez et partagez aisément des plannings et des tâches avec votre équipe",
      "Gérez le flux du travail et suivez les tâches importantes à l’aide de Listes Microsoft",
      "Créez des enquêtes personnalisées de façon rapide et aisée, et analysez les résultats à l’aide de Microsoft Forms",
      "Simplifiez la planification par les clients et gérez les rendez-vous grâce à Microsoft Bookings",
    ],
  },
  {
    title: "Support et déploiement",
    inc: [true, true, true],
    details: [
      "Contactez le support par téléphone ou en ligne 24 h/24, 7 j/7",
      "Bénéficiez d’un support technique pour l’installation, la configuration et l’usage général",
      "Accédez à des outils, vidéos, articles et forums d’aide et de résolution des problèmes",
      "Gardez l’esprit tranquille grâce à une durée de bon fonctionnement de 99 % garantie financièrement",
    ],
  },
  {
    title: "Applications web et mobiles",
    inc: [true, true, true],
    details: ["Word, Excel, PowerPoint, OneNote", "Outlook", "Teams, Bookings, Forms, Listes, Planificateur, SharePoint"],
  },
  {
    title: "Applications de bureau installables",
    inc: [false, true, true],
    details: [
      "Microsoft 365 Apps pour PC et Mac, incluant Word, Excel, PowerPoint, Outlook et OneNote",
      "Applications pour PC uniquement, incluant Access et Publisher",
    ],
  },
  {
    title: "Webinaires et événements en direct",
    inc: [false, true, true],
    details: [
      "Planifiez et organisez des webinaires auxquels 300 personnes peuvent assister",
      "Organisation de webinaires incluant un espace d’inscription pour les participants et l’envoi de courriers de confirmation",
      "Accédez à des données de rapport sur l’inscription au webinaire et la participation à la réunion",
    ],
  },
  {
    title: "Protection avancée contre les cyberattaques",
    inc: [false, false, true],
    details: [
      "Activez une solution professionnelle de sécurité des points de terminaison sur l’ensemble des appareils qui vous prémunit contre les rançongiciels et autres cybermenaces",
      "Protégez-vous contre les menaces ciblant le courrier, telles que les tentatives de hameçonnage dissimulées dans les pièces jointes et les liens",
      "Restreignez l’accès aux informations sensibles de votre entreprise grâce à la Gestion des droits relatifs à l’information",
      "Permettez aux employés d’accéder en toute sécurité aux applications professionnelles où qu’ils travaillent grâce à l’accès conditionnel, tout en empêchant les accès non autorisés",
    ],
  },
  {
    title: "Gestion des appareils",
    inc: [false, false, true],
    details: [
      "Appliquez des stratégies de sécurité pour protéger les données professionnelles sur les appareils appartenant à l’entreprise ou aux employés",
      "Conservez les données de votre entreprise au sein d’applications approuvées sur les appareils iOS et Android, et les PC Windows",
      "Supprimez à distance les données professionnelles sur les appareils égarés ou dérobés",
    ],
  },
];

export const acronisWhy = [
  {
    title: "Tirez parti de la sauvegarde sans agent",
    text: "Assurez-vous que les données Microsoft 365 de vos clients sont sauvegardées et récupérables grâce aux meilleures technologies de sauvegarde et de restauration sans agent de cloud à cloud.",
  },
  {
    title: "Corriger les vulnérabilités",
    text: "Surveillez tous les produits Microsoft à la recherche de vulnérabilités et comblez rapidement les failles de sécurité grâce à une gestion automatisée des correctifs hiérarchisée par criticité des vulnérabilités.",
  },
  {
    title: "Protégez les données, améliorez la conformité",
    text: "Assurez-vous que les données Microsoft 365 critiques sont sauvegardées et récupérables et améliorez la conformité aux mandats légaux et réglementaires.",
  },
];

export const acronisFeatures = [
  {
    title: "Une solution pour toutes les charges de travail",
    text: "Économisez sur les licences, la formation et l’intégration. Acronis Cyber Protect Cloud est une solution évolutive qui protège les données des clients sur 20+ plates-formes : physiques, virtuelles, cloud ou mobiles.",
  },
  {
    title: "Restauration rapide et granulaire",
    text: "Évitez les temps d’arrêt des clients et assurez la continuité de leurs activités en récupérant leurs données en quelques secondes. Vous pouvez sauvegarder et restaurer de manière granulaire les éléments de données requis (par exemple, les e-mails, les fichiers, les sites, les contacts et les pièces jointes).",
  },
  {
    title: "Protection automatique pour les nouveaux éléments Microsoft 365",
    text: "Réduisez les maux de tête en simplifiant la gestion des sauvegardes pour Microsoft 365. Les nouveaux utilisateurs, groupes et sites sont automatiquement protégés.",
  },
  {
    title: "Recherche rapide de sauvegarde",
    text: "Trouvez un fichier dont vous avez besoin en quelques secondes. La recherche améliorée de boîtes aux lettres vous permet d’effectuer une recherche par objet d’e-mail, destinataire, expéditeur ou date. Vous pouvez également effectuer des recherches à l’aide de formulaires Word ou d’informations partielles, et effectuer une recherche dans Teams, OneDrive Entreprise et SharePoint Online par élément de site et nom de fichier.",
  },
  {
    title: "Surveillance puissante de l’état",
    text: "Atteignez des niveaux plus élevés de transparence et de sécurité grâce à des fonctionnalités de reporting avancées et à la surveillance de l’état des sauvegardes, y compris des widgets, des notifications et des alertes pour les événements critiques.",
  },
  {
    title: "Gestion de groupe",
    text: "Mettez à jour et appliquez des stratégies spécifiques pour les grands groupes (jusqu’à des centaines d’utilisateurs), et pas seulement un à la fois.",
  },
];
