import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { B24Benefits, B24Editions, B24Hero, B24Mediasoft, B24ToolsRail } from "@/components/bitrix24/Bitrix24Page";

/* Page Bitrix24, servie à l'adresse d'origine /bitrix24.tn/ (scripts/postbuild.mjs copie bitrix24.tn.html en bitrix24.tn/index.html). */
const title = "Bitrix24 en Tunisie : CRM, centre de contact, tâches et collaboration";
const description =
  "Mediasoft, partenaire Bitrix24 en Tunisie : CRM, centre de contact, tâches et projets, collaboration, RH et automatisation, sites et boutiques. Version Cloud ou auto-hébergée, mise en œuvre et formation.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/bitrix24.tn/" },
  openGraph: { url: "/bitrix24.tn/", title, description, images: [{ url: "/img/produits/b24-crm.webp" }] },
};

export default function Bitrix24Page() {
  return (
    <>
      <Header current="bitrix24" />
      <main id="main">
        <B24Hero />
        <B24ToolsRail />
        <B24Benefits />
        <B24Editions />
        <B24Mediasoft />
      </main>
      <Footer />
    </>
  );
}
