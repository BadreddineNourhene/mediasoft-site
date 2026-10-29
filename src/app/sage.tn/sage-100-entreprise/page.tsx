import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SageModulePage from "@/components/sage100/SageModulePage";
import { Sage100Mediasoft, Sage100Cta } from "@/components/sage100/Sage100Closing";
import { entreprise as m } from "@/lib/sageModules";

/* Page servie à l'adresse d'origine /sage.tn/sage-100-entreprise/
   (scripts/postbuild.mjs copie sage-100-entreprise.html en sage-100-entreprise/index.html). */
export const metadata: Metadata = {
  title: "Sage 100 Entreprise en Tunisie",
  description: m.lead,
  alternates: { canonical: "/sage.tn/sage-100-entreprise/" },
  openGraph: { url: "/sage.tn/sage-100-entreprise/", images: [{ url: "/img/sage100/ent/ent-commerciale.webp" }] },
};

export default function SageEntreprisePage() {
  return (
    <>
      <Header current="sage" />
      <main id="main">
        <SageModulePage k="entreprise" />
        <Sage100Mediasoft />
        <Sage100Cta />
      </main>
      <Footer current="sage" />
    </>
  );
}
