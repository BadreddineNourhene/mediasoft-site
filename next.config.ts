import type { NextConfig } from "next";

/* Export statique : `next build` écrit le site dans `out/`, à déposer sur le serveur IIS.
   Chaque route devient un fichier .html (ex. app/Presentation → out/Presentation.html),
   ce qui garde les anciennes URL du site. Les réécritures sont dans public/web.config. */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  poweredByHeader: false,
  /* En développement seulement : l'URL d'origine du formulaire affiche la page contact,
     comme le fait web.config sur IIS (les réécritures ne sont pas exportées). */
  ...(process.env.NODE_ENV === "development"
    ? { rewrites: async () => [{ source: "/site/formulaire.php", destination: "/contact" }] }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
