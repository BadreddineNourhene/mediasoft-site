import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sage100Hero from "@/components/sage100/Sage100Hero";
import Sage100Questions from "@/components/sage100/Sage100Questions";
import Sage100Chain from "@/components/sage100/Sage100Chain";
import Sage100Scenes from "@/components/sage100/Sage100Scenes";
import Sage100Formules from "@/components/sage100/Sage100Formules";
import { Sage100Gains, Sage100Mediasoft, Sage100Cta } from "@/components/sage100/Sage100Closing";

/* Page Sage 100, servie à l'adresse d'origine /sage.tn/sage-100/
   (scripts/postbuild.mjs copie sage-100.html en sage-100/index.html). */
export const metadata: Metadata = {
  title: "Sage 100 en Tunisie : comptabilité et gestion commerciale",
  description:
    "Sage 100 réunit comptabilité et gestion commerciale dans le cloud Microsoft Azure : facturation, relances, rapprochement bancaire, stocks, achats et tableaux de bord en temps réel. Démonstration et accompagnement par Mediasoft en Tunisie.",
  alternates: { canonical: "/sage.tn/sage-100/" },
  openGraph: { url: "/sage.tn/sage-100/", images: [{ url: "/img/produits/s100-commerciale.webp" }] },
};

export default function Sage100Page() {
  return (
    <>
      <Header current="sage" />
      <main id="main">
        <Sage100Hero />
        {/* Les formules (produits) juste après l'ouverture */}
        <Sage100Formules />
        <Sage100Questions />
        <Sage100Chain />
        <Sage100Scenes />
        <Sage100Gains />
        <Sage100Mediasoft />
        <Sage100Cta />
      </main>
      <Footer current="sage" />
    </>
  );
}
