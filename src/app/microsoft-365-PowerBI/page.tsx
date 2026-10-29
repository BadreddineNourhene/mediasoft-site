import type { Metadata } from "next";
import { Check, DatabaseBackup } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CompareTable from "@/components/CompareTable";
import { ListenCta } from "@/components/Bands";
import { Arrow, SectionHead } from "@/components/ui";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import CountUp from "@/components/reactbits/CountUp";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import M365AppsLoop from "@/components/M365AppsLoop";
import M365Orbit from "@/components/visual/M365Orbit";
import PbiDevices from "@/components/visual/PbiDevices";
import AcronisStack from "@/components/AcronisStack";
import { links } from "@/lib/site";

const PBI_YELLOW = "#f5ce0d";
const PBI_NIGHT = "#0f0d05";
import { m365Compare, m365Plans } from "@/lib/m365";

export const metadata: Metadata = {
  title: "Microsoft 365 & Office 365 en Tunisie",
  description:
    "Accédez à la suite complète de logiciels professionnels avec Microsoft Office | Microsoft 365 : Teams, Word, Excel, Outlook, PowerPoint. Offres Business Basic, Standard et Premium, sauvegarde Acronis et Power BI.",
  alternates: { canonical: "/microsoft-365-PowerBI.html" },
  openGraph: { url: "/microsoft-365-PowerBI.html" },
};

/* Fond de l'en-tête : halos aux couleurs des applications Microsoft 365 derrière l'orbite,
   ondes concentriques et trame de points ; la colonne de texte reste claire. */
function M365HeroBg() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(115deg,#ffffff_0%,#f7faff_45%,#eef4ff_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(#0b2a55_1px,transparent_1.2px)] opacity-[0.12] [background-size:22px_22px] [mask-image:radial-gradient(60%_75%_at_78%_50%,black,transparent)]" />
      <div className="absolute right-[2%] top-[-12%] h-[70%] w-[42%] rounded-full bg-[#0078d4] opacity-[0.32] blur-[110px]" />
      <div className="absolute bottom-[-18%] right-[18%] h-[60%] w-[34%] rounded-full bg-[#7b5cd6] opacity-[0.26] blur-[110px]" />
      <div className="absolute right-[-6%] top-[38%] h-[45%] w-[26%] rounded-full bg-[#13a89e] opacity-[0.26] blur-[100px]" />
      <div className="absolute right-[30%] top-[18%] h-[30%] w-[18%] rounded-full bg-[#f26b2f] opacity-[0.2] blur-[90px]" />
      <div className="absolute right-[-12%] top-1/2 hidden aspect-square w-[68%] -translate-y-1/2 lg:block">
        {[1, 0.78, 0.56].map((s) => (
          <span key={s} className="absolute inset-0 m-auto rounded-full border border-[#0078d4]/[0.16]" style={{ width: `${s * 100}%`, height: `${s * 100}%` }} />
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 hidden w-[45%] lg:block bg-[linear-gradient(90deg,#ffffff_30%,transparent)]" />
    </div>
  );
}

export default function M365Page() {
  return (
    <>
      <Header current="microsoft" />
      <main id="main">
        <PageHero
          crumbs={[{ label: "Microsoft" }, { label: "Microsoft 365" }]}
          eyebrow="Microsoft 365 & Office 365"
          title={
            <>
              Vos équipes, <span className="text-brand">connectées où qu’elles soient.</span>
            </>
          }
          lead="Teams, Outlook, OneDrive, Word, Excel : nous vous aidons à choisir la bonne offre Microsoft 365 et nous protégeons vos données avec Acronis."
          actions={
            <>
              <a href={links.contact} className="btn btn-primary">
                Demander un devis <Arrow />
              </a>
              <a href="#offres" className="btn btn-ghost">
                Nos offres Microsoft 365
              </a>
            </>
          }
          visual={<M365Orbit className="mx-auto" />}
          background={<M365HeroBg />}
        />

        <M365AppsLoop />

        {/* Offres */}
        <section id="offres" className="section bg-white" aria-labelledby="offres-title">
          <div className="container-x">
            <SectionHead
              eyebrow="Nos offres"
              title={<span id="offres-title">Trois formules, selon votre façon de travailler.</span>}
            />
            <AnimatedContent stagger={0.1} distance={36} className="mt-14 grid gap-5 lg:grid-cols-3">
              {m365Plans.map((p, i) => (
                <SpotlightCard
                  key={p.key}
                  theme="light"
                  spotlightColor={i === 2 ? "rgba(242,107,47,0.22)" : "rgba(70,157,214,0.3)"}
                  className="h-full !rounded-[24px] !p-0"
                >
                  <article className="flex h-full flex-col p-7 md:p-8">
                    <span className={`absolute inset-x-0 top-0 h-1.5 ${i === 2 ? "bg-accent" : i === 1 ? "bg-brand" : "bg-brand-sky"}`} aria-hidden />
                    <span className={`w-fit rounded-full px-3 py-1 text-[12px] font-semibold ${i === 2 ? "bg-accent-soft text-accent-deep" : "bg-brand-soft text-brand"}`}>
                      {p.tag}
                    </span>
                    <h3 className="mt-5 text-[24px]">{p.name}</h3>
                    <p className="mt-2 font-medium text-ink-2">{p.intro}</p>
                    <ul className="mt-6 grid gap-3">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-[15px] text-ink-2">
                          <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white ${i === 2 ? "bg-accent" : "bg-brand"}`}>
                            <Check size={12} strokeWidth={3} aria-hidden />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-7 rounded-2xl bg-mist p-4">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-soft">Applications incluses</p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {p.apps.map((a) => {
                          const [icon, label] = a.split(":");
                          return (
                            <li key={a} className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-[12.5px] font-medium text-ink-2 shadow-sm">
                              {icon ? <img src={`/img/m365/${icon}.svg`} alt="" className="h-4 w-4" loading="lazy" /> : null}
                              {label}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="mt-auto pt-8">
                      <a href={links.contact} className={`btn w-full ${i === 1 ? "btn-brand" : "btn-primary"}`}>
                        Demander un devis <Arrow />
                      </a>
                    </div>
                  </article>
                </SpotlightCard>
              ))}
            </AnimatedContent>
          </div>
        </section>

        {/* Comparatif */}
        <section className="section bg-mist" aria-labelledby="compare-title">
          <div className="container-x">
            <SectionHead
              eyebrow="Comparatif"
              title={<span id="compare-title">Ce que contient chaque offre.</span>}
              lead="Cliquez sur une ligne pour afficher le détail des fonctionnalités."
            />
            <div className="mt-12">
              <CompareTable
                caption="Comparatif des offres Microsoft 365 Business"
                columns={["Business Basic", "Business Standard", "Business Premium"]}
                rows={m365Compare.map((r) => ({ title: r.title, values: r.inc, details: r.details }))}
              />
            </div>
            <div className="mt-10 flex justify-center">
              <a href={links.contact} className="btn btn-primary">
                Demander un devis <Arrow />
              </a>
            </div>
          </div>
        </section>

        {/* Acronis : bandeau sombre, titre à gauche et chiffre clé à droite */}
        <section className="relative isolate overflow-hidden bg-night py-[clamp(72px,9vw,120px)] text-white" aria-labelledby="acronis-title">
          <div className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-[0.07]" aria-hidden />
          <div className="pointer-events-none absolute -right-[10%] -top-[40%] -z-10 h-[90%] w-[55vw] rounded-full bg-accent opacity-[0.18] blur-[120px]" aria-hidden />
          <div className="pointer-events-none absolute -bottom-[50%] -left-[10%] -z-10 h-[90%] w-[45vw] rounded-full bg-brand opacity-[0.25] blur-[120px]" aria-hidden />
          <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <span className="eyebrow eyebrow-light">Acronis</span>
              <h2 id="acronis-title" className="h-section mt-5 !text-white">Vos données Microsoft 365, sauvegardées.</h2>
              <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/70">
                Microsoft assure la disponibilité du service ; la protection de vos données vous revient. Avec Acronis, e-mails,
                fichiers, Teams et SharePoint sont sauvegardés et restaurés en quelques secondes.
              </p>
            </div>
            <div>
              <p className="font-display text-[clamp(110px,15vw,210px)] font-bold leading-[0.85] tracking-[-0.06em] text-accent">
                <CountUp to={85} suffix="%" duration={1.6} />
              </p>
              <p className="mt-5 max-w-sm text-[18px] leading-relaxed text-white/80">
                des organisations utilisant Microsoft 365 ont subi des violations de données de messagerie.
              </p>
            </div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container-x">
            <div>
              <SectionHead eyebrow="Acronis Cyber Protect Cloud" title="Ce que la sauvegarde change au quotidien." />
              <AcronisStack />
            </div>

            {/* Responsabilité partagée : ce que Microsoft assure, ce qui vous revient (et ce qu'Acronis protège) */}
            <div className="relative mt-16 overflow-hidden rounded-[30px] bg-night p-7 text-white md:p-11">
              <div className="grid-lines pointer-events-none absolute inset-0 opacity-30" aria-hidden />
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent opacity-25 blur-[90px]" aria-hidden />
              <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <span className="eyebrow eyebrow-light">Responsabilité partagée</span>
                  <h3 className="mt-3 text-[clamp(24px,2.4vw,34px)] !text-white">Modèle de responsabilité partagée Microsoft Office 365</h3>
                  <p className="mt-3 text-white/70">
                    Microsoft 365 assure la résilience de l’infrastructure, mais la protection des données relève de votre
                    responsabilité.
                  </p>
                </div>
                <a href={links.contact} className="btn btn-light shrink-0">
                  Demander un devis <Arrow />
                </a>
              </div>

              <div className="relative mt-9 grid gap-4 md:grid-cols-2">
                <div className="rounded-[22px] bg-white/[0.06] p-6 ring-1 ring-white/10">
                  <div className="flex items-center gap-3">
                    <img src="/img/logos/logo-microsoft-365.png" alt="" className="h-9 w-auto rounded-lg bg-white p-1.5" loading="lazy" />
                    <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/60">Microsoft assure</p>
                  </div>
                  <ul className="mt-5 grid gap-3">
                    {["La résilience de l’infrastructure", "La disponibilité du service"].map((t) => (
                      <li key={t} className="flex items-center gap-3 text-[16px] font-medium">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-sky text-white">
                          <Check size={14} strokeWidth={3} aria-hidden />
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[22px] bg-accent/[0.12] p-6 ring-1 ring-accent/40">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-white">
                      <DatabaseBackup size={18} aria-hidden />
                    </span>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-accent">Vous revient · protégé par Acronis</p>
                  </div>
                  <ul className="mt-5 grid grid-cols-2 gap-3">
                    {[
                      { i: "outlook", t: "E-mails" },
                      { i: "onedrive", t: "Fichiers" },
                      { i: "mssteam", t: "Teams" },
                      { i: "sharepoint", t: "SharePoint" },
                    ].map(({ i, t }) => (
                      <li key={t} className="flex items-center gap-2.5 rounded-xl bg-white/[0.07] px-3 py-2.5 text-[15px] font-medium">
                        <img src={`/img/m365/${i}.svg`} alt="" className="h-5 w-5" loading="lazy" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Power BI (ancre d'origine #powerBI) : bandeau aux couleurs de Power BI, le même rapport sur portable et téléphone */}
        <section id="powerBI" className="relative isolate overflow-hidden py-[clamp(72px,9vw,128px)] text-white" style={{ background: PBI_NIGHT }} aria-labelledby="pbi-title">
          <div className="pointer-events-none absolute -right-[10%] -top-[30%] -z-10 h-[80%] w-[60vw] rounded-full opacity-[0.2] blur-[120px]" style={{ background: PBI_YELLOW }} aria-hidden />
          <div className="pointer-events-none absolute -bottom-[40%] -left-[15%] -z-10 h-[70%] w-[45vw] rounded-full opacity-[0.12] blur-[120px]" style={{ background: PBI_YELLOW }} aria-hidden />
          <div className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-[0.07]" aria-hidden />
          <div className="container-x grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <p className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-white/80">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white">
                  <img src="/img/logos/logo-power-bi-icon.svg" alt="" className="h-4 w-4" loading="lazy" />
                </span>
                Microsoft Power BI
              </p>
              <h2 id="pbi-title" className="h-section mt-7 !text-white">
                Et pour piloter&nbsp;: <span style={{ color: PBI_YELLOW }}>Power&nbsp;BI.</span>
              </h2>
              <p className="lead mt-6 max-w-xl !text-white/70">
                Les données de vos outils Microsoft et de votre logiciel de gestion, réunies dans des tableaux de bord clairs et partagés.
              </p>
              <p className="mt-4 max-w-xl text-[15px] text-white/55">La puissance de la Business Intelligence décisionnelle.</p>
              <a
                href={links.powerbi}
                className="btn mt-9 w-fit transition-transform duration-300 hover:scale-[1.03]"
                style={{ background: PBI_YELLOW, color: PBI_NIGHT }}
              >
                Découvrir Power BI <Arrow />
              </a>
            </div>
            <PbiDevices />
          </div>
        </section>

        <ListenCta label="Demander un devis" />
      </main>
      <Footer />
    </>
  );
}
