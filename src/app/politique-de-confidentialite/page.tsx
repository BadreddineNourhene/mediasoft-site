import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { offices, site } from "@/lib/site";

/* Page servie à l'URL d'origine « /Politique de confidentialité.html » (réécriture IIS). */
export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité du site www.mediasoft.tn : collecte, utilisation et protection des données personnelles conformément au RGPD (UE 2016/679).",
  alternates: { canonical: "/Politique%20de%20confidentialit%C3%A9.html" },
};

const sections: { title: string; intro?: string; items?: string[]; text?: string }[] = [
  {
    title: "2. Données personnelles collectées",
    intro: "Nous collectons uniquement les données strictement nécessaires, notamment :",
    items: ["Nom et prénom", "Adresse e-mail", "Numéro de téléphone", "Message (formulaire de contact)", "Adresse IP et données de navigation"],
  },
  {
    title: "3. Finalités du traitement",
    intro: "Les données personnelles sont collectées pour les finalités suivantes :",
    items: [
      "Répondre aux demandes envoyées via les formulaires",
      "Assurer la communication avec les clients et prospects",
      "Améliorer le site et l’expérience utilisateur",
      "Respecter nos obligations légales",
    ],
  },
  {
    title: "4. Base légale du traitement",
    intro: "Le traitement des données repose sur :",
    items: ["le consentement de l’utilisateur", "l’intérêt légitime de l’entreprise", "le respect d’obligations légales"],
  },
  {
    title: "5. Durée de conservation",
    text: "Les données personnelles sont conservées uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, sauf obligation légale contraire.",
  },
  {
    title: "6. Destinataires des données",
    text: "Les données personnelles sont destinées exclusivement à Mediasoft Tunisie et ne sont pas vendues ou cédées à des tiers.",
  },
  {
    title: "7. Sécurité des données",
    text: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées afin de garantir la sécurité et la confidentialité des données personnelles.",
  },
  {
    title: "8. Droits des utilisateurs",
    intro: "Conformément au RGPD, vous disposez des droits suivants :",
    items: ["Droit d’accès", "Droit de rectification", "Droit à l’effacement", "Droit à la limitation du traitement", "Droit d’opposition"],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header current="" />
      <main id="main">
        <PageHero
          crumbs={[{ label: "Politique de confidentialité" }]}
          eyebrow="RGPD – UE 2016/679"
          title={
            <>
              Politique de <span className="text-brand">confidentialité.</span>
            </>
          }
          lead="La présente politique de confidentialité a pour objectif d’informer les utilisateurs du site www.mediasoft.tn sur la manière dont Mediasoft collecte, utilise et protège leurs données personnelles conformément au Règlement Général sur la Protection des Données (RGPD – UE 2016/679)."
        />
        <section className="section bg-white">
          <div className="container-x grid gap-12 lg:grid-cols-[0.35fr_1fr]">
            <nav aria-label="Sommaire" className="hidden lg:block">
              <ol className="sticky top-[calc(var(--header-h)+32px)] grid gap-2 text-[14.5px] text-ink-soft">
                {["1. Responsable du traitement", ...sections.map((s) => s.title)].map((t, i) => (
                  <li key={t}>
                    <a href={`#art-${i + 1}`} className="hover:text-brand">{t}</a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="grid max-w-3xl gap-12">
              <article id="art-1">
                <h2 className="text-[26px]">1. Responsable du traitement</h2>
                <p className="mt-4 text-ink-soft">Le responsable du traitement des données est :</p>
                <div className="card mt-4 bg-mist p-6 text-[15.5px]">
                  <p className="font-semibold">Mediasoft Tunisie</p>
                  <p className="mt-1 text-ink-soft">{offices[0].address}</p>
                  <p className="mt-3">
                    Email : <a href={`mailto:${site.email}`} className="font-medium text-brand">{site.email}</a>
                  </p>
                  <p>
                    Téléphone : <a href="tel:+21631435825" className="font-medium text-brand">+216 31 435 825</a>
                  </p>
                </div>
              </article>
              {sections.map((s, i) => (
                <article key={s.title} id={`art-${i + 2}`}>
                  <h2 className="text-[26px]">{s.title}</h2>
                  {s.intro && <p className="mt-4 text-ink-soft">{s.intro}</p>}
                  {s.items && (
                    <ul className="mt-4 grid gap-2.5">
                      {s.items.map((it) => (
                        <li key={it} className="flex items-start gap-3 text-ink-2">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                          {it}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.text && <p className="mt-4 text-ink-soft">{s.text}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
