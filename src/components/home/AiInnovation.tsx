"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/* IA & innovation (inspiration : digitalapple.ai).
   1) Grand titre aux premiers mots colorés.
   2) Panneaux qui défilent à l'horizontale avec la page : grand titre, filet vertical, texte, mot géant en filigrane, pastilles. */

gsap.registerPlugin(ScrollTrigger, useGSAP);

const panels = [
  {
    mark: "APPS",
    bg: "#bfe0ff",
    ink: "#0f0f14",
    sub: "rgba(15,15,20,0.75)",
    line: "rgba(15,15,20,0.2)",
    title: "Des sites et des applications qui vendent 24/7",
    text: "Nous créons vos applications métier sur mesure, de l’idée jusqu’à la mise en service. Ensemble, nous clarifions vos besoins, puis nous concevons des applications web modernes, conviviales et faciles à utiliser, afin de simplifier le quotidien de vos équipes. Après le lancement, nous restons à vos côtés pour les faire évoluer au rythme de votre activité.",
    tags: ["Applications web", "Portails clients", "Outils métier"],
  },
  {
    mark: "AGENTS",
    bg: "#0d3f8f",
    ink: "#ffffff",
    sub: "rgba(255,255,255,0.75)",
    line: "rgba(255,255,255,0.18)",
    title: "Des agents IA qui travaillent pour vous",
    text: "Nous concevons des agents sur mesure qui prennent en charge les tâches répétitives : préparer, répondre, trier, relancer. Vos équipes se concentrent sur ce qui compte.",
    tags: ["Agents métier", "Assistants", "Agents vocaux"],
  },
  {
    mark: "AUTOMATE",
    bg: "#b7b2ff",
    ink: "#0f0f14",
    sub: "rgba(15,15,20,0.75)",
    line: "rgba(15,15,20,0.2)",
    title: "Des processus qui tournent tout seuls",
    text: "Nous identifions les enchaînements manuels de votre activité et les automatisons de bout en bout, avec des points de contrôle là où une décision humaine est nécessaire.",
    tags: ["Workflows", "Intégration", "Alertes"],
  },
  {
    mark: "STRATÉGIE",
    bg: "#f6d5e1",
    ink: "#0f0f14",
    sub: "rgba(15,15,20,0.75)",
    line: "rgba(15,15,20,0.2)",
    title: "Une stratégie IA qui fonctionne vraiment",
    text: "L’IA peut sembler vaste. Nous vous aidons à repérer les cas d’usage utiles, à construire les bonnes solutions et à les faire adopter par vos équipes, avec un suivi après la mise en service.",
    tags: ["Conseil IA", "Ateliers", "Formation"],
  },
  {
    mark: "SUR MESURE",
    bg: "#d9f0a3",
    ink: "#0f0f14",
    sub: "rgba(15,15,20,0.75)",
    line: "rgba(15,15,20,0.2)",
    title: "Des solutions IA construites pour vous",
    text: "Applications intelligentes, assistants pour votre site, analyse de documents : nous développons des solutions sur mesure, adaptées à vos données et à vos objectifs.",
    tags: ["Développement", "Applications IA", "Site web"],
  },
];

export default function AiInnovation() {
  const rail = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  // Panneaux : la section reste fixe et les panneaux défilent à l'horizontale avec la page (comme « Découvrir Nos Solutions »)
  useGSAP(
    () => {
      gsap.matchMedia().add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: rail.current,
            start: "top top+=60",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: rail }
  );


  return (
    <section id="ia" aria-labelledby="ia-title" className="bg-white">
      {/* 1. Grand titre + pastille (comme « FULL SERVICE B2B CREATIVE AGENCY » / « Our Capabilities ») */}
      <div className="bg-white pb-14 pt-[clamp(80px,10vw,140px)] text-ink">
        <div className="container-x">
          <h2 id="ia-title" className="max-w-5xl font-display text-[clamp(40px,6.4vw,96px)] font-bold uppercase leading-[0.95] tracking-[-0.045em]">
            <span className="text-brand-sky">Solutions web &amp; IA</span> sur mesure pour votre entreprise
          </h2>
        </div>
      </div>

      {/* 2. Panneaux */}
      <div ref={rail} className="overflow-hidden lg:h-[calc(100svh-60px)]" aria-label="Nos offres IA">
      <div ref={track} className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] lg:h-full lg:w-max lg:snap-none lg:overflow-visible [&::-webkit-scrollbar]:hidden" data-lenis-prevent>
        {panels.map((p) => (
          <article
            key={p.mark}
            lang={"lang" in p ? (p.lang as string) : undefined}
            className="relative flex min-h-[520px] w-[92vw] shrink-0 snap-start flex-col overflow-hidden px-7 py-12 md:w-[86vw] md:px-14 md:py-16 lg:h-full lg:w-[80vw]"
            style={{ background: p.bg, color: p.ink }}
          >
            <span
              className="pointer-events-none absolute bottom-[3.2rem] left-4 select-none whitespace-nowrap font-display text-[clamp(90px,14vw,220px)] font-bold leading-none tracking-[-0.05em] md:left-10"
              style={{ color: p.ink, opacity: 0.08 }}
              aria-hidden
            >
              {p.mark}
            </span>
            <div className="relative grid gap-8 md:grid-cols-[1.1fr_1fr] md:gap-0">
              <h3 className="font-display text-[clamp(34px,4.4vw,66px)] font-bold leading-[1] tracking-[-0.05em] md:pr-12" style={{ color: p.ink }}>
                {p.title}
              </h3>
              <p className="text-[17px] leading-relaxed md:border-l md:pl-12" style={{ color: p.sub, borderColor: p.line }}>
                {p.text}
              </p>
            </div>
            <ul className="relative mt-auto flex flex-wrap gap-3 pt-14">
              {p.tags.map((t) => (
                <li key={t} className="rounded-full border px-6 py-3 text-[13px] font-bold uppercase tracking-[0.08em]" style={{ borderColor: p.line, color: p.ink }}>
                  {t}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      </div>

    </section>
  );
}
