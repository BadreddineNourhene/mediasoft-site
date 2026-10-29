"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Arrow } from "@/components/ui";
import AppWindow from "@/components/visual/AppWindow";
import { links } from "@/lib/site";
import { dcaps, dmodules, DIV_INK, DIV_ORANGE } from "@/lib/divaltoHome";

gsap.registerPlugin(useGSAP);

/* Ouverture : « une seule plateforme ». Une vraie capture de Divalto infinity au centre,
   reliée par des fils animés aux six modules de l'ERP disposés autour. */

// Positions des modules autour de la capture (en % de la scène) et point d'ancrage du fil
const spots = [
  { x: 16, y: 7 },
  { x: 80, y: 4 },
  { x: 90, y: 47 },
  { x: 80, y: 93 },
  { x: 18, y: 95 },
  { x: 10, y: 50 },
];

export default function DivaltoHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from("[data-line] > span", { yPercent: 110, duration: 1, stagger: 0.12 })
          .from("[data-fade]", { y: 18, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.6")
          .from("[data-core]", { scale: 0.9, opacity: 0, duration: 1.1 }, "-=0.8")
          .from("[data-wire]", { strokeDashoffset: 400, duration: 1.2, stagger: 0.08, ease: "power2.inOut" }, "-=0.6")
          .from("[data-mod]", { scale: 0.6, opacity: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.8)" }, "-=1");
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-[#fff7f0] pb-[clamp(70px,9vw,120px)] pt-[clamp(48px,6vw,84px)]" aria-labelledby="div-title">
      <div className="pointer-events-none absolute -right-[12%] -top-[30%] h-[90vh] w-[60vw] rounded-full opacity-[0.22] blur-[110px]" style={{ background: DIV_ORANGE }} aria-hidden />
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />

      <div className="container-x relative grid items-center gap-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
        <div>
          <p data-fade className="inline-flex items-center gap-3 rounded-full border border-[#ff5500]/25 bg-white py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-ink-2">
            <span className="grid h-7 place-items-center rounded-full bg-[#fff0e6] px-2.5">
              <img src="/img/logos/logo-divalto.png" alt="Divalto" className="h-3.5 w-auto" />
            </span>
            Divalto infinity · ERP & CRM pour PME et ETI
          </p>
          <h1 id="div-title" className="mt-7 font-display text-[clamp(40px,4.6vw,68px)] font-bold leading-[1] tracking-[-0.045em]" style={{ color: DIV_INK }}>
            <span data-line className="block overflow-hidden pb-[0.06em]">
              <span className="block">Votre métier a ses règles.</span>
            </span>
            <span data-line className="block overflow-hidden pb-[0.06em]">
              <span className="block" style={{ color: DIV_ORANGE }}>
                Votre ERP aussi.
              </span>
            </span>
          </h1>
          <p data-fade className="mt-7 max-w-[530px] text-[clamp(16.5px,1.3vw,19px)] leading-relaxed text-ink-soft">
            Divalto infinity pilote votre entreprise depuis une seule plateforme : ventes, production, affaires, entrepôt, finance et documents. Mediasoft, revendeur Divalto en Tunisie, l’adapte à votre métier.
          </p>
          <div data-fade className="mt-10 flex flex-wrap gap-3">
            <a href={links.contact} className="group inline-flex min-h-[54px] items-center gap-3 rounded-full py-2 pl-7 pr-2 text-[15.5px] font-semibold text-white transition-transform duration-300 hover:scale-[1.03]" style={{ background: DIV_INK }}>
              Contactez-nous
              <span className="grid h-10 w-10 place-items-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1" style={{ background: DIV_ORANGE }}>
                <Arrow size={17} />
              </span>
            </a>
            <a href="/divalto.tn/erp-divalto-infinity/" className="inline-flex min-h-[54px] items-center rounded-full border border-ink/15 bg-white px-7 text-[15.5px] font-semibold text-ink transition-colors hover:border-ink/40">
              Découvrir divalto infinity
            </a>
          </div>
        </div>

        {/* Scène : la plateforme et ses modules */}
        <div className="relative mx-auto w-full max-w-[640px]">
          <div className="relative aspect-[1.15/1] max-sm:aspect-auto">
            <svg className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              {spots.map((s, i) => (
                <g key={i}>
                  <path data-wire d={`M50 50 L${s.x} ${s.y}`} stroke={DIV_ORANGE} strokeOpacity="0.35" strokeWidth="0.35" fill="none" strokeDasharray="400" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 1.5 }} />
                  <path d={`M50 50 L${s.x} ${s.y}`} stroke={DIV_ORANGE} strokeWidth="1.5" fill="none" strokeDasharray="2 18" vectorEffect="non-scaling-stroke" className="div-flow" style={{ animationDelay: `${i * 0.4}s` }} />
                </g>
              ))}
            </svg>
            <div data-core className="relative z-10 mx-auto w-full sm:absolute sm:left-1/2 sm:top-1/2 sm:w-[68%] sm:-translate-x-1/2 sm:-translate-y-1/2">
              <div className="pointer-events-none absolute -inset-6 rounded-[36px] opacity-40 blur-2xl" style={{ background: DIV_ORANGE }} aria-hidden />
              <div className="relative">
                <AppWindow src={dcaps.tableau.src} alt={dcaps.tableau.alt} title="Divalto infinity" eager />
              </div>
            </div>
            <ul className="relative z-20 mt-6 flex flex-wrap gap-2 sm:absolute sm:inset-0 sm:mt-0 sm:block">
              {dmodules.map((m, i) => (
                <li key={m.key} data-mod className="sm:absolute sm:-translate-x-1/2 sm:-translate-y-1/2" style={{ left: `${spots[i].x}%`, top: `${spots[i].y}%` }}>
                  <a href={m.href} className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#ff5500]/25 bg-white px-3.5 py-2 text-[13px] font-semibold text-ink shadow-[0_12px_28px_-14px_rgba(13,20,36,0.35)] transition-all hover:-translate-y-0.5 hover:border-[#ff5500]">
                    <span className="h-2 w-2 rounded-full" style={{ background: DIV_ORANGE }} aria-hidden />
                    {m.short}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p data-fade className="mt-6 text-center text-[11.5px] text-ink-soft sm:mt-10">Capture réelle de Divalto infinity</p>
        </div>
      </div>
    </section>
  );
}
