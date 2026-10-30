import type { Metadata } from "next";
import Script from "next/script";
import { Check, Mail, MapPin, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ContactRequestForm from "@/components/ContactRequestForm";
import { Arrow, SmartLink } from "@/components/ui";
import { offices, site } from "@/lib/site";

/* Page servie à l'URL d'origine /site/formulaire.php (réécriture IIS vers contact.html). */
export const metadata: Metadata = {
  title: "Contactez-nous",
  description:
    "Mediasoft, intégrateur de solutions de gestion et de digitalisation. Contactez nos agences de Tunis et Sousse : demande de démonstration, devis Sage, Divalto, Bitrix24, Microsoft 365 et Power BI.",
  alternates: { canonical: "/site/formulaire.php" },
  openGraph: { url: "/site/formulaire.php" },
};

/* Coordonnées affichées sur le formulaire d'origine (l'agence de Sousse y indiquait contact@ciel.tn). */
const contactOffices = [
  { ...offices[0], label: "Siège Tunis", email: "info@mediasoft.tn" },
  { ...offices[1], label: "Siège Sousse", email: "contact@ciel.tn" },
];

export default function ContactPage() {
  return (
    <>
      <Header current="" />
      <main id="main">
        <PageHero
          crumbs={[{ label: "Contactez-nous" }]}
          tone="dark"
          wide
          leadClassName="!text-[15.5px] md:!text-[16.5px] !max-w-[920px]"
          title={
            <span className="sm:whitespace-nowrap">
              Contactez-<span className="text-brand-sky">nous.</span>
            </span>
          }
          lead="Mediasoft, intégrateur de solutions de gestion et de digitalisation. Nous accompagnons nos clients dans le choix et la mise en place de leurs logiciels métiers, et dans la création de leurs applications web et agents IA."
        />

        <section className="section !pt-16 bg-mist">
          {/* Formulaire à gauche, présentation et plans des agences à droite */}
          <div className="container-x grid grid-cols-1 gap-8 [&>*]:min-w-0 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.75fr)]">
            <div className="relative overflow-hidden rounded-[var(--radius)] bg-[#00193a] p-5 md:p-8">
              <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-sky opacity-20 blur-[100px]" aria-hidden />
              <div className="relative">
                <ContactRequestForm />
              </div>
            </div>

            <aside className="grid content-start gap-5">
              {/* Présentation courte : une phrase, puis l'accompagnement en liste cochée */}
              <div className="card p-6">
                <p className="text-[15px] leading-relaxed text-ink-2">
                  Partenaire de <strong className="font-semibold text-ink">Sage, Divalto, Bitrix24 et Microsoft</strong>, Mediasoft met
                  en place vos logiciels de gestion et crée vos applications web et agents IA.
                </p>
                <p className="mt-4 text-[13px] font-semibold text-ink">Nos consultants certifiés vous accompagnent :</p>
                <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[14px] text-ink-soft">
                  {["Audit", "Conseil", "Développement", "Personnalisation", "Formation", "Support"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <Check size={14} strokeWidth={3} className="shrink-0 text-brand" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {contactOffices.map((o, i) => (
                <div key={o.key} className="card overflow-hidden">
                  <iframe src={o.map} title={`Plan d’accès — ${o.label}`} className="h-44 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  <div className="p-6">
                    <h3 className="text-[20px]">{o.label}</h3>
                    <ul className="mt-4 grid gap-2.5 text-[14.5px]">
                      <li className="flex gap-3">
                        <MapPin size={17} className={`mt-0.5 shrink-0 ${i ? "text-accent" : "text-brand"}`} aria-hidden />
                        {site.legalName} {o.address}
                      </li>
                      <li className="flex gap-3">
                        <Phone size={17} className={`mt-0.5 shrink-0 ${i ? "text-accent" : "text-brand"}`} aria-hidden />
                        <a href={o.telHref} className="font-medium hover:text-brand">Téléphone : {o.tel.replace("(+216) ", "")}</a>
                      </li>
                      <li className="flex gap-3">
                        <Mail size={17} className={`mt-0.5 shrink-0 ${i ? "text-accent" : "text-brand"}`} aria-hidden />
                        <a href={`mailto:${o.email}`} className="font-medium hover:text-brand">{o.email}</a>
                      </li>
                    </ul>
                    <SmartLink href={o.mapOpen} className="link-arrow mt-5 text-[14.5px]">
                      Ouvrir dans Google Maps <Arrow size={15} />
                    </SmartLink>
                  </div>
                </div>
              ))}

            </aside>
          </div>
        </section>
      </main>
      <Footer />
      {/* Google Tag Manager : présent sur le formulaire d'origine */}
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${site.gtmId}');`}
      </Script>
    </>
  );
}
