import type { Metadata } from "next";
import { Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CompareTable from "@/components/CompareTable";
import { ListenCta } from "@/components/Bands";
import { Arrow, SectionHead } from "@/components/ui";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import BiBoard from "@/components/visual/BiBoard";
import { links } from "@/lib/site";

const PBI_YELLOW = "#f5ce0d";
const PBI_NIGHT = "#0f0d05";
/* Surtitres sur fond clair : texte jaune sur pastille nuit, pour rester lisibles. */
const PBI_EYEBROW = "rounded-full px-3.5 py-1.5 !text-[#f5ce0d] bg-[#0f0d05]";

export const metadata: Metadata = {
  title: "Microsoft Power BI en Tunisie",
  description:
    "Power BI est une plateforme évolutive, unifiée pour la business intelligence (BI) en entreprise et en libre-service. Licences Power BI Pro et Power BI Premium en Tunisie avec Mediasoft.",
  alternates: { canonical: "/PowerBI-Tunisie.html" },
  openGraph: { url: "/PowerBI-Tunisie.html" },
};

const licences = [
  {
    name: "Power BI Pro",
    text: "Achetez des licences pour les utilisateurs individuels et permettez leur de publier des rapports et des tableaux de bord et de visualiser du contenu dans toute votre organisation.",
    points: [
      "La licence Power BI Pro est requise pour publier et partager des états.",
      "Power BI Pro est inclus dans Microsoft 365 E5.",
      "Disponible à l’achat immédiatement avec une carte de crédit.",
    ],
  },
  {
    name: "Power BI Premium",
    text: "Octroyez des licences aux utilisateurs individuels avec un accès à des tailles de modèle plus importantes, à des actualisations plus fréquentes, à la lecture/écriture XMLA, aux pipelines de déploiement et autres fonctionnalités à l’échelle de l’entreprise.",
    points: ["Comprend toutes les fonctionnalités disponibles avec Power BI Pro.", "Disponible à l’achat immédiatement avec une carte de crédit."],
  },
];

const compare = [
  { title: "Créer des états avec Power BI Desktop", values: [true, true] },
  { title: "Publication d’états pour partager et collaborer", values: [true, true] },
  { title: "IA, flux de données et datamarts avancés et lecture/écriture de point de terminaison XMLA", values: [false, true] },
  { title: "Limite de la taille de la mémoire du modèle", values: ["1 Go", "100 Go"] },
  { title: "Fréquence d’actualisation pour les jeux de données Power BI", values: ["8/jour", "48/jour"] },
  { title: "Stockage maximum (stockage natif Power BI)", values: ["10 Go/utilisateur", "100 To"] },
  { title: "Sécurité et chiffrement des données", values: [true, true] },
];

export default function PowerBiPage() {
  return (
    <>
      <Header current="microsoft" />
      <main id="main">
        <PageHero
          crumbs={[{ label: "Microsoft" }, { label: "Microsoft Power BI" }]}
          tone="dark"
          eyebrowColor={PBI_YELLOW}
          background={
            <>
              {/* Fond nuit teinté de jaune Power BI, halo jaune et trame fine (même principe que Sage et Bitrix24) */}
              <div className="absolute inset-0 -z-20" style={{ background: PBI_NIGHT }} aria-hidden />
              <div className="pointer-events-none absolute -right-[10%] -top-[30%] -z-10 h-[80vh] w-[70vw] rounded-full opacity-[0.2] blur-[120px]" style={{ background: PBI_YELLOW }} aria-hidden />
              <div className="pointer-events-none absolute -bottom-[40%] -left-[15%] -z-10 h-[60vh] w-[50vw] rounded-full opacity-[0.12] blur-[120px]" style={{ background: PBI_YELLOW }} aria-hidden />
              <div className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-[0.07]" aria-hidden />
            </>
          }
          eyebrow="Microsoft Power BI"
          title={
            <>
              Vos chiffres, <span style={{ color: PBI_YELLOW }}>enfin lisibles.</span>
            </>
          }
          lead="Power BI relie vos données de gestion et les transforme en tableaux de bord partagés, de la direction jusqu’aux équipes."
          actions={
            <>
              <a href={links.contact} className="btn transition-transform duration-300 hover:scale-[1.03]" style={{ background: PBI_YELLOW, color: PBI_NIGHT }}>
                Demander un devis <Arrow />
              </a>
              <a href="#solutions-powerbi" className="btn btn-outline-light">
                Nos solutions Power BI
              </a>
            </>
          }
          visual={<BiBoard className="mx-auto" />}
        />

        {/* Vidéo de présentation reprise de l'ancienne page (même vidéo YouTube, même titre et même texte) */}
        <section className="section bg-mist" aria-labelledby="video-title">
          <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="overflow-hidden rounded-[24px] p-1.5 shadow-[0_40px_80px_-50px_rgb(11_26_46/0.55)]" style={{ background: PBI_NIGHT }}>
              <div className="relative aspect-video overflow-hidden rounded-[18px] bg-black">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/TYHS_HImQQw"
                  title="Power BI - Présentation générale"
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
            <div>
              <h2 id="video-title" className="h-section" style={{ color: PBI_YELLOW }}>Power BI - Présentation générale</h2>
              <p className="lead mt-5">
                <strong className="font-semibold text-ink">La puissance de la Business Intelligence décisionnelle !</strong> Développée par
                Microsoft, la solution Power BI, est un package qui regroupe un ensemble de solutions et modules intelligents pour collecter,
                importer, compiler et analyser vos données.
              </p>
            </div>
          </div>
        </section>

        <section className="section bg-white">
          <div className="container-x grid gap-10 lg:grid-cols-[0.4fr_1fr]">
            <span className={`eyebrow h-fit w-fit ${PBI_EYEBROW}`}>Pourquoi Power BI</span>
            <AnimatedContent distance={30} duration={0.9}>
              <p className="font-display text-[clamp(22px,2.2vw,32px)] font-medium leading-[1.3] tracking-tight text-ink">
                Collecter, importer, compiler, analyser : Power BI rassemble vos sources et vous montre ce qu’elles disent, sans
                tableur à reconstruire chaque mois.
              </p>
            </AnimatedContent>
          </div>
        </section>

        <section id="solutions-powerbi" className="section bg-mist" aria-labelledby="licences-title">
          <div className="container-x">
            <SectionHead className="[&_.eyebrow]:w-fit [&_.eyebrow]:rounded-full [&_.eyebrow]:bg-[#0f0d05] [&_.eyebrow]:px-3.5 [&_.eyebrow]:py-1.5 [&_.eyebrow]:!text-[#f5ce0d]" eyebrow="Nos solutions" title={<span id="licences-title">Nos solutions Microsoft Power BI</span>} />
            <AnimatedContent stagger={0.1} distance={36} className="mt-14 grid gap-5 lg:grid-cols-2">
              {licences.map((l, i) => (
                <SpotlightCard key={l.name} theme="light" spotlightColor={i ? "rgba(245,206,13,0.28)" : "rgba(70,157,214,0.3)"} className="h-full !rounded-[24px] !p-0">
                  <article className="flex h-full flex-col p-7 md:p-10">
                    <span className={`absolute inset-x-0 top-0 h-1.5 ${i ? "" : "bg-brand"}`} style={i ? { background: PBI_YELLOW } : undefined} aria-hidden />
                    <span className={`w-fit rounded-full px-3 py-1 text-[12px] font-semibold ${i ? "" : "bg-brand-soft text-brand"}`} style={i ? { background: "#fdf6d3", color: "#8a6a00" } : undefined}>
                      Licence
                    </span>
                    <h3 className="mt-5 text-[30px]">{l.name}</h3>
                    <p className="mt-3 text-ink-soft">{l.text}</p>
                    <ul className="mt-7 grid gap-3">
                      {l.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-3 text-[15.5px] text-ink-2">
                          <span
                            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${i ? "" : "bg-brand text-white"}`}
                            style={i ? { background: PBI_YELLOW, color: PBI_NIGHT } : undefined}
                          >
                            <Check size={12} strokeWidth={3} aria-hidden />
                          </span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-9">
                      <a href={links.contact} className={`btn ${i ? "" : "btn-brand"}`} style={i ? { background: PBI_YELLOW, color: PBI_NIGHT } : undefined}>
                        Demander un devis <Arrow />
                      </a>
                    </div>
                  </article>
                </SpotlightCard>
              ))}
            </AnimatedContent>
          </div>
        </section>

        <section className="section bg-white" aria-labelledby="fonc-title">
          <div className="container-x">
            <SectionHead eyebrow="Comparatif" title={<span id="fonc-title">Découvrez les fonctionnalités Power BI</span>} />
            <div className="mt-12">
              <CompareTable caption="Comparatif Power BI Pro et Power BI Premium" columns={["Power BI Pro", "Power BI Premium"]} rows={compare} lastColor={PBI_YELLOW} />
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a href={links.contact} className="btn btn-primary">
                Demander un devis <Arrow />
              </a>
              <a href={links.m365} className="btn btn-ghost">
                Voir aussi Microsoft 365
              </a>
            </div>
          </div>
        </section>

        <ListenCta label="Demander un devis" theme={{ night: PBI_NIGHT, accent: PBI_YELLOW, accentRgb: "245 206 13" }} />
      </main>
      <Footer />
    </>
  );
}
