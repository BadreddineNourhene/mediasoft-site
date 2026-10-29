import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SageSegmentPage, { segments } from "@/components/sage100/SageSegmentPage";
import { Sage100Mediasoft, Sage100Cta } from "@/components/sage100/Sage100Closing";

/* Page servie à l'adresse d'origine /sage.tn/moyennes-et-grandes-entreprises/
   (scripts/postbuild.mjs copie moyennes-et-grandes-entreprises.html en moyennes-et-grandes-entreprises/index.html). */
export const metadata: Metadata = {
  title: "Logiciels de gestion Sage pour PME et ETI en Tunisie",
  description: segments.pme.lead,
  alternates: { canonical: "/sage.tn/moyennes-et-grandes-entreprises/" },
  openGraph: { url: "/sage.tn/moyennes-et-grandes-entreprises/", images: [{ url: segments.pme.hero }] },
};

export default function Page() {
  return (
    <>
      <Header current="sage" />
      <main id="main">
        <SageSegmentPage k="pme" />
        <Sage100Mediasoft />
        <Sage100Cta />
      </main>
      <Footer current="sage" />
    </>
  );
}
