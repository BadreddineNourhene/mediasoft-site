import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SageSegmentPage, { segments } from "@/components/sage100/SageSegmentPage";
import { Sage100Mediasoft, Sage100Cta } from "@/components/sage100/Sage100Closing";

/* Page servie à l'adresse d'origine /sage.tn/petites-entreprises/
   (scripts/postbuild.mjs copie petites-entreprises.html en petites-entreprises/index.html). */
export const metadata: Metadata = {
  title: "Logiciels de gestion pour TPE et petites entreprises en Tunisie",
  description: segments.tpe.lead,
  alternates: { canonical: "/sage.tn/petites-entreprises/" },
  openGraph: { url: "/sage.tn/petites-entreprises/", images: [{ url: segments.tpe.hero }] },
};

export default function Page() {
  return (
    <>
      <Header current="sage" />
      <main id="main">
        <SageSegmentPage k="tpe" />
        <Sage100Mediasoft />
        <Sage100Cta />
      </main>
      <Footer current="sage" />
    </>
  );
}
