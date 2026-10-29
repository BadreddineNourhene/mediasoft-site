import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SageModulePage from "@/components/sage100/SageModulePage";
import { Sage100Mediasoft, Sage100Cta } from "@/components/sage100/Sage100Closing";
import { gestionCommerciale as m } from "@/lib/sageModules";

/* Page servie à l'adresse d'origine /sage.tn/sage-100-gestion-commerciale/
   (scripts/postbuild.mjs copie sage-100-gestion-commerciale.html en sage-100-gestion-commerciale/index.html). */
export const metadata: Metadata = {
  title: "Sage 100 Gestion commerciale en Tunisie",
  description: m.lead,
  alternates: { canonical: "/sage.tn/sage-100-gestion-commerciale/" },
  openGraph: { url: "/sage.tn/sage-100-gestion-commerciale/", images: [{ url: "/img/sage100/gc/gc-ventes.webp" }] },
};

export default function SageGestionCommercialePage() {
  return (
    <>
      <Header current="sage" />
      <main id="main">
        <SageModulePage k="gestionCommerciale" />
        <Sage100Mediasoft />
        <Sage100Cta />
      </main>
      <Footer current="sage" />
    </>
  );
}
