import type { Metadata } from "next";
import Script from "next/script";
import { Mail, MapPin, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
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
          leadClassName="!text-[15.5px] md:!text-[16.5px]"
          title={
            <span className="sm:whitespace-nowrap">
              Contactez-<span className="text-brand-sky">nous.</span>
            </span>
          }
          lead="Mediasoft, intégrateur de solutions de gestion et de digitalisation. Nous accompagnons nos clients dans le choix et la mise en place de leurs logiciels métiers, et dans la création de leurs applications web et agents IA."
        />

        <section className="section !pt-16 bg-mist">
          <div className="container-x grid grid-cols-1 gap-10 [&>*]:min-w-0 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="card p-6 shadow-[0_30px_60px_-40px_rgb(11_26_46/0.4)] md:p-10">
              <h2 id="votre-demande" className="scroll-mt-28 text-[30px]">Votre demande</h2>
              <div className="mt-6">
                <ContactForm variant="full" />
              </div>
            </div>

            <aside className="grid content-start gap-5">
              <div className="card p-7">
                <p className="text-[15px] leading-relaxed text-ink-soft">
                  Nos partenariats stratégiques avec les éditeurs Sage, Divalto, Bitrix24 et Microsoft et notre savoir-faire
                  nous permettent de vous offrir des solutions et des services innovants adaptés aux exigences digitales de
                  demain : logiciels de gestion, applications web, agents IA et automatisation.
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                  Et grâce à l’expertise de nos consultants certifiés, nous vous accompagnons dans chaque étape de votre
                  processus de transformation digitale : Audit, Conseil, Développement sur mesure, Personnalisation, Formation,
                  Support.
                </p>
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
