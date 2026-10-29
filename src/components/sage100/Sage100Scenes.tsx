"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Cloud, ShieldCheck, MonitorSmartphone } from "lucide-react";
import AppWindow from "@/components/visual/AppWindow";
import { caps, SAGE_GREEN } from "@/lib/sage100";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Sage 100 en situation : deux scènes en vis-à-vis (texte / vraie capture, côtés alternés),
   puis un bandeau sombre « là où vous êtes » avec des appareils dessinés (mise en scène signalée). */

const scenes = [
  {
    kicker: "Comptabilité",
    title: "Moins de saisie. Plus de temps pour analyser.",
    text: "Les tâches comptables administratives sont automatisées et les saisies répétitives réduites. Vous gardez la main sur l’essentiel : l’analyse des charges et des coûts de production.",
    points: ["Automatisation des tâches comptables", "Analyse des charges et des coûts", "Facturation, impayés et relances"],
    cap: caps.ca,
    capTitle: "Sage 100c · CA comptable",
  },
  {
    kicker: "Pilotage",
    title: "Le reporting se prépare tout seul.",
    text: "Les actions de reporting sont automatisées. Jauges et graphiques donnent une lecture immédiate, et les modèles de rapports sont prêts à l’emploi, faciles à adapter.",
    points: ["Reporting automatisé", "Jauges et graphiques", "Modèles de rapports modifiables"],
    cap: caps.caCommercial,
    capTitle: "Sage 100c · CA commercial",
  },
];

function Device({ kind, children }: { kind: "laptop" | "tablet" | "phone"; children: React.ReactNode }) {
  if (kind === "laptop")
    return (
      <div className="w-full">
        <div className="rounded-t-[14px] border-[6px] border-b-0 border-[#1b2a22] bg-[#1b2a22]">{children}</div>
        <div className="mx-[-6%] h-3 rounded-b-[10px] bg-gradient-to-b from-[#cfd8d2] to-[#8d9a92]" />
      </div>
    );
  if (kind === "tablet") return <div className="rounded-[18px] border-[7px] border-[#1b2a22] bg-[#1b2a22]">{children}</div>;
  return <div className="rounded-[16px] border-[5px] border-[#1b2a22] bg-[#1b2a22]">{children}</div>;
}

export default function Sage100Scenes() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-scene]").forEach((el) => {
          gsap.from(el.querySelectorAll("[data-rise]"), { y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 75%" } });
          const cap = el.querySelector("[data-cap]");
          if (cap) gsap.fromTo(cap, { y: 60 }, { y: -30, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });
        gsap.from("[data-dev]", { y: 60, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: "[data-devices]", start: "top 75%" } });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      <section className="bg-white pb-[clamp(60px,8vw,110px)]" aria-labelledby="s100-scenes-title">
        <div className="container-x">
          <h2 id="s100-scenes-title" className="sr-only">
            Sage 100 en situation
          </h2>
          <div className="space-y-[clamp(80px,10vw,150px)]">
            {scenes.map((s, i) => (
              <article key={s.kicker} data-scene className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div>
                  <p data-rise className="eyebrow">{s.kicker}</p>
                  <h3 data-rise className="mt-4 font-display text-[clamp(28px,3.2vw,46px)] font-bold leading-[1.05] tracking-[-0.04em]">
                    {s.title}
                  </h3>
                  <p data-rise className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-soft">
                    {s.text}
                  </p>
                  <ul data-rise className="mt-8 border-t border-line">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-4 border-b border-line py-3.5 text-[15.5px] font-medium text-ink">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: SAGE_GREEN }} aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative">
                  <div className="absolute inset-[6%] rounded-[40px] bg-gradient-to-br from-[#eafcef] to-[#e8f2fb]" aria-hidden />
                  <div data-cap className="relative px-[4%] py-[8%]">
                    <AppWindow src={s.cap.src} alt={s.cap.alt} title={s.capTitle} />
                    <p className="mt-3 text-right text-[11.5px] text-ink-soft">Capture réelle de Sage 100c</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Là où vous êtes */}
      <section className="relative overflow-hidden bg-[#03100a] py-[clamp(80px,10vw,140px)] text-white" aria-labelledby="s100-cloud-title">
        <div className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[70vh] w-[90vw] -translate-x-1/2 rounded-full opacity-[0.16] blur-[140px]" style={{ background: SAGE_GREEN }} aria-hidden />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow eyebrow-light">100 % cloud</p>
            <h2 id="s100-cloud-title" className="mt-4 font-display text-[clamp(30px,3.6vw,52px)] font-bold leading-[1.04] tracking-[-0.04em] !text-white">
              Votre gestion,
              <br />
              <span style={{ color: SAGE_GREEN }}>là où vous êtes.</span>
            </h2>
            <p className="mt-5 max-w-md text-[16.5px] leading-relaxed text-white/65">
              Sage 100 est hébergé dans le cloud Microsoft Azure. Chiffre d’affaires, encours clients et fournisseurs, situation de trésorerie : tout reste accessible, à tout moment.
            </p>
            <ul className="mt-9 space-y-4">
              {[
                { icon: MonitorSmartphone, t: "Sur tablette, PC ou portable" },
                { icon: Cloud, t: "Hébergé sur Microsoft Azure" },
                { icon: ShieldCheck, t: "Un accès simple, rapide et sécurisé à vos données" },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-4 text-[15.5px] text-white/85">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.07] ring-1 ring-white/10" style={{ color: SAGE_GREEN }}>
                    <Icon size={18} aria-hidden />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div data-devices className="relative mx-auto w-full max-w-[640px]">
            <div data-dev className="relative w-[82%]">
              <Device kind="laptop">
                <img src={caps.portefeuille.src} alt={caps.portefeuille.alt} className="block h-auto w-full" loading="lazy" />
              </Device>
            </div>
            <div data-dev className="absolute bottom-[-6%] right-0 w-[42%]">
              <Device kind="tablet">
                <img src={caps.ca.src} alt={caps.ca.alt} className="block h-auto w-full rounded-[10px]" loading="lazy" />
              </Device>
            </div>
            <p className="mt-16 text-center text-[11.5px] text-white/40 sm:text-right">Captures réelles de Sage 100c dans des appareils dessinés</p>
          </div>
        </div>
      </section>
    </div>
  );
}
