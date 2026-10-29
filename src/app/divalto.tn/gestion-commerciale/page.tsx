import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GcDomainsRail, GcRailHero } from "@/components/divalto/GcRail";
import GcDetails from "@/components/divalto/GcDetails";
import { DivaltoAccompagnement } from "@/components/divalto/DivaltoHomeNew";

/* Gestion commerciale Divalto infinity, dans le style de l'accueil Divalto (captures + rail des domaines), à l'adresse d'origine
   /divalto.tn/gestion-commerciale/. L'ancienne version reste disponible via le gabarit ModuleView (components/divalto/views.tsx). */
const title = "Gestion commerciale Divalto infinity : vendre, stocker, acheter, facturer";
const description =
  "Tarifs par client, réservations, stocks et seuils d’alerte, achats et fournisseurs, pièces commerciales signées : la gestion commerciale Divalto infinity, installée et paramétrée par Mediasoft en Tunisie.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/divalto.tn/gestion-commerciale/" },
  openGraph: { url: "/divalto.tn/gestion-commerciale/", title, description, images: [{ url: "/img/produits/div-tableau.webp" }] },
};

export default function GestionCommercialePage() {
  return (
    <>
      <Header current="divalto" />
      <main id="main">
        <GcRailHero />
        <GcDomainsRail />
        <GcDetails />
        <DivaltoAccompagnement />
      </main>
      <Footer current="divalto" />
    </>
  );
}
