import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SageModulePage from "@/components/sage100/SageModulePage";
import { Sage100Mediasoft, Sage100Cta } from "@/components/sage100/Sage100Closing";
import { comptabilite as m } from "@/lib/sageModules";

/* Page servie à l'adresse d'origine /sage.tn/sage-100-comptabilite/
   (scripts/postbuild.mjs copie sage-100-comptabilite.html en sage-100-comptabilite/index.html). */
export const metadata: Metadata = {
  title: "Sage 100 Comptabilité en Tunisie",
  description: m.lead,
  alternates: { canonical: "/sage.tn/sage-100-comptabilite/" },
  openGraph: { url: "/sage.tn/sage-100-comptabilite/", images: [{ url: "/img/sage100/compta/compta-generale.webp" }] },
};

export default function SageComptabilitePage() {
  return (
    <>
      <Header current="sage" />
      <main id="main">
        <SageModulePage k="comptabilite" />
        <Sage100Mediasoft />
        <Sage100Cta />
      </main>
      <Footer current="sage" />
    </>
  );
}
