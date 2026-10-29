import { Layers, Building2, Users, Headset, Sparkles, ArrowUpRight } from "lucide-react";
import { links } from "@/lib/site";
import { Arrow } from "@/components/ui";

/* En-tête de l'accueil : « Des solutions qui font avancer votre entreprise. »
   À droite : visuel détouré fourni par Mediasoft (tableau de bord, éditeurs partenaires, processus, IA & Web).
   En bas, les cinq métiers de Mediasoft. */

const pillars = [
  { i: Layers, t: "ERP & intégration", d: "Des systèmes qui communiquent" },
  { i: Building2, t: "Solutions métiers", d: "Pour chaque secteur d’activité" },
  { i: Sparkles, t: "Web & IA", d: "Applications web et agents IA" },
  { i: Users, t: "Conseil & accompagnement", d: "De la stratégie à la mise en œuvre" },
  { i: Headset, t: "Formation & support", d: "Une équipe à vos côtés" },
];

export default function HeroDigital() {
  return (
    <section className="relative isolate overflow-hidden bg-[#00193a] text-white" aria-labelledby="hero-title">
      {/* Halo bleu derrière le visuel (le visuel fourni est détouré, sur fond transparent) */}
      <div className="pointer-events-none absolute right-[-8%] top-[10%] -z-10 h-[80%] w-[60vw] rounded-full bg-[#1f5fff] opacity-25 blur-[140px]" aria-hidden />
      <div className="container-x grid items-center gap-8 pb-6 pt-14 lg:min-h-[max(480px,calc(100svh-100px))] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:py-8">
        <div className="hd-in">
          <p className="inline-flex items-center gap-4 text-[12.5px] lg:text-[max(11px,0.78vw)] font-semibold uppercase tracking-[0.22em] text-white/85">
            Votre partenaire de transformation digitale
          </p>
          <h1 id="hero-title" className="mt-5 font-display text-[clamp(34px,3.4vw,60px)] lg:text-[clamp(32px,2.8vw,52px)] font-bold !text-white leading-[1.02] tracking-[-0.04em] ">
            Des solutions <br className="hidden sm:block" />
            qui font avancer <br className="hidden sm:block" />
            <span className="bg-[linear-gradient(90deg,#2f6bff,#5fb4ff)] bg-clip-text text-transparent">votre entreprise.</span>
          </h1>
          <p className="mt-6 max-w-lg text-[15px] lg:text-[max(13.5px,0.95vw)] leading-relaxed text-white/80 lg:[@media(max-height:760px)]:mt-4">
            Nous vous accompagnons dans la mise en place de solutions ERP, l’intégration de vos systèmes, la digitalisation de vos processus, et la création de vos applications web et agents IA, pour une gestion plus simple, plus performante et plus durable.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-6 lg:[@media(max-height:760px)]:mt-6">
            <a href="#solutions" className="group inline-flex min-h-[48px] items-center gap-3 rounded-full bg-[#1f5fff] px-7 text-[14.5px] font-semibold text-white transition-transform duration-300 hover:scale-[1.03]">
              Découvrir nos solutions <Arrow size={17} />
            </a>
            <a href={links.contact} className="inline-flex items-center gap-2 border-b border-white/60 pb-1 text-[14.5px] font-semibold text-white transition-colors hover:border-white">
              Échanger avec un expert <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img
            src="/img/hero/hero-visuel-v3.webp"
            srcSet="/img/hero/hero-visuel-v3-960.webp 960w, /img/hero/hero-visuel-v3.webp 1304w"
            sizes="(min-width: 1024px) 58vw, 100vw"
            width={1304}
            height={769}
            alt="Tableau de bord de gestion relié à Sage, Divalto, Microsoft et Bitrix24, avec l’intégration de systèmes et l’IA & Web"
            className="block h-auto w-full max-w-[1304px] lg:w-[112%] lg:max-w-none"
            fetchPriority="high"
          />
        </div>
      </div>

      {/* Les cinq métiers */}
      <div className="container-x pb-6 pt-5 lg:pt-0">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
          {pillars.map(({ i: I, t, d }, k) => (
            <li key={t} className={`flex items-start gap-2 lg:px-3.5 ${k ? "lg:border-l lg:border-white/10" : "lg:pl-0"}`}>
              <I size={18} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#3d8bff]" aria-hidden />
              <span>
                <span className="block whitespace-nowrap text-[12.5px] font-semibold text-white">{t}</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-white/60">{d}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
