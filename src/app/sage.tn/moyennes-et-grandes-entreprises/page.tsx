import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SageSegmentPage from "@/components/sage100/SageSegmentPage";
import { Sage100Mediasoft, Sage100Cta } from "@/components/sage100/Sage100Closing";

/* Page servie à l'adresse d'origine /sage.tn/moyennes-et-grandes-entreprises/
   (scripts/postbuild.mjs copie moyennes-et-grandes-entreprises.html en moyennes-et-grandes-entreprises/index.html). */
export const metadata: Metadata = {
  title: "Logiciels de gestion Sage pour PME et ETI en Tunisie",
  description: "Sage 100, Sage 100 Paie et RH, Sage Espace Employés : trouvez l’offre Sage adaptée à votre PME ou ETI.",
  alternates: { canonical: "/sage.tn/moyennes-et-grandes-entreprises/" },
  openGraph: { url: "/sage.tn/moyennes-et-grandes-entreprises/", images: [{ url: "/img/sage100/ent/ent-commerciale.webp" }] },
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
