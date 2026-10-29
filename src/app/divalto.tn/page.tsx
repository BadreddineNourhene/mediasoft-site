import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DivaltoAccompagnement, DivaltoHomeHero, DivaltoMetiers, DivaltoModulesRail } from "@/components/divalto/DivaltoHomeNew";

/* Page Divalto, servie à l'adresse d'origine /divalto.tn/
   (scripts/postbuild.mjs copie divalto.tn.html en divalto.tn/index.html). */
export const metadata: Metadata = {
  title: "Divalto infinity en Tunisie : ERP et CRM pour PME et ETI",
  description:
    "Mediasoft, revendeur Divalto en Tunisie : Divalto infinity, l'ERP qui pilote l'entreprise depuis une seule plateforme (gestion commerciale, GPAO, gestion à l'affaire, WMS, comptabilité, dématérialisation), solutions métiers et gestion d'interventions.",
  alternates: { canonical: "/divalto.tn/" },
  openGraph: { url: "/divalto.tn/", images: [{ url: "/img/produits/div-tableau.webp" }] },
};

export default function DivaltoPage() {
  return (
    <>
      <Header current="divalto" />
      <main id="main">
        <DivaltoHomeHero />
        <DivaltoModulesRail />
        <DivaltoMetiers />
        <DivaltoAccompagnement />
      </main>
      <Footer />
    </>
  );
}
