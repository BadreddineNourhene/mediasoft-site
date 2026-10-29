import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingContact from "@/components/FloatingContact";
import { SITE_URL } from "@/lib/site";

const body = Inter({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const display = Sora({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Partenaire Sage en Tunisie – Partenaire Divalto en Tunisie - Mediasoft Revendeur Sage et divalto en tunisie",
    template: "%s | Mediasoft Tunisie",
  },
  description:
    "Expert dans l’intégration de solutions de gestion et de digitalisation, Revendeur et intégrateur de logiciel Sage et divalto en Tunisie.",
  applicationName: "Mediasoft",
  openGraph: { type: "website", siteName: "Mediasoft", locale: "fr_TN", images: [{ url: "/img/photos/bureaux.webp" }] },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mediasoft Tunisie",
  legalName: "MediaSoft sarl",
  url: SITE_URL,
  logo: `${SITE_URL}/img/logos/logo-mediasoft-bleu.png`,
  email: "info@mediasoft.tn",
  foundingDate: "2001",
  sameAs: ["https://www.facebook.com/mediasoftsousse/", "https://www.linkedin.com/company/mediasoft-tunisie/"],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "Av, Hédi Nouira Immeuble le Moulin Bureau Nº2 - Ennasr II",
      postalCode: "2037",
      addressLocality: "Ariana",
      addressCountry: "TN",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "Av, Yesser Arafet Immeuble Marwa 1er étage Bureau Nº1, Sahloul",
      postalCode: "4054",
      addressLocality: "Sousse",
      addressCountry: "TN",
    },
  ],
  contactPoint: [
    { "@type": "ContactPoint", telephone: "+216 31 435 825", contactType: "customer service", areaServed: "TN" },
    { "@type": "ContactPoint", telephone: "+216 73 822 546", contactType: "technical support", areaServed: "TN" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${body.variable} ${display.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <SmoothScroll />
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
