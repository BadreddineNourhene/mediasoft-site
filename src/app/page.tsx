import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroDigital from "@/components/home/HeroDigital";
import PartnersBand from "@/components/home/PartnersBand";
import AboutOrigin from "@/components/home/AboutOrigin";
import Expertise from "@/components/home/Expertise";
import AiInnovation from "@/components/home/AiInnovation";
import Faq from "@/components/home/Faq";
import SolutionsRail from "@/components/home/SolutionsRail";
import ContactWindow from "@/components/home/ContactWindow";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Partenaire Sage en Tunisie – Partenaire Divalto en Tunisie - Mediasoft Revendeur Sage et divalto en tunisie",
  },
  keywords:
    "Mediasoft Tunisie, Sage Tunisie, revendeur sage, partenaire Sage en Tunisie, tarif sage tunisie, intégrateur sage tunisie, sage 100cloud, sage cloud, sage 100, sage 100 tunisie, sage 100 comptabilité, sage rh, sage crm, paie & rh, sage paie, ciel tunisie, logiciel ciel, logiciel comptabilité, sage 50 cloud, sage 50, sage 50 comptabilité, divalto, divalto tunisie, revendeur divalto, erp divalto, erp, logiciel crm, crm, office 365, microsoft, microsoft 365, télécharger office, télécharger microsoft, acheter microsoft",
  alternates: { canonical: "/" },
  verification: { google: "OcJ9H8fLUX34zGUJQajK7RgypO2YRh3R5WpLDStro3Y" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    <>
      <Header current="accueil" />
      <main id="main">
        <HeroDigital />
        <PartnersBand />
        <AboutOrigin />
        <SolutionsRail />
        <AiInnovation />
        <Expertise />
        <Faq />
        <ContactWindow />
      </main>
      <Footer />
      {/* Chat Tidio : présent sur l'accueil du site d'origine */}
      <Script src={site.tidioSrc} strategy="lazyOnload" />
    </>
  );
}
