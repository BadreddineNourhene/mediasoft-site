"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { chain, SAGE_GREEN } from "@/lib/sage100";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Le circuit de l'information, du devis à la trésorerie. Sur ordinateur, la section se fige et le fil
   se trace avec le défilement : chaque étape s'allume à son tour. Sur mobile, frise verticale. */

export default function Sage100Chain() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
        gsap.set(steps, { opacity: 0.28 });
        gsap.set("[data-dot]", { scale: 0.6 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=160%", scrub: 0.6, pin: true, anticipatePin: 1 },
        });
        tl.fromTo("[data-fill]", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: steps.length }, 0);
        steps.forEach((s, i) => {
          tl.to(s, { opacity: 1, duration: 0.4 }, i + 0.2).to(s.querySelector("[data-dot]"), { scale: 1, backgroundColor: SAGE_GREEN, duration: 0.3 }, i + 0.2);
        });
        tl.to("[data-pulse]", { x: () => (root.current!.querySelector<HTMLElement>("[data-track]")!.offsetWidth), ease: "none", duration: steps.length }, 0);
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-[#03100a] py-[clamp(80px,10vw,120px)] text-white lg:flex lg:h-[100svh] lg:flex-col lg:justify-center" aria-labelledby="s100-chain-title">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-[140px]" style={{ background: SAGE_GREEN }} aria-hidden />
      <div className="container-x relative">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <h2 id="s100-chain-title" className="font-display text-[clamp(32px,4vw,60px)] font-bold leading-[1.02] tracking-[-0.045em] !text-white">
            Du devis à la trésorerie,
            <br />
            <span style={{ color: SAGE_GREEN }}>un seul fil.</span>
          </h2>
        </div>

        <div className="relative mt-16 lg:mt-24">
          {/* Fil horizontal (ordinateur) */}
          <div data-track className="absolute left-0 right-0 top-[11px] hidden h-[2px] bg-white/12 lg:block" aria-hidden>
            <span data-fill className="absolute inset-0 origin-left" style={{ background: `linear-gradient(90deg, ${SAGE_GREEN}, #7ef09a)` }} />
            <span data-pulse className="absolute -top-[5px] left-0 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_20px_6px_rgba(0,214,57,0.6)]" />
          </div>
          {/* Fil vertical (mobile) */}
          <div className="absolute bottom-2 left-[11px] top-2 w-[2px] lg:hidden" style={{ background: `linear-gradient(${SAGE_GREEN}, rgba(255,255,255,0.1))` }} aria-hidden />

          <ol className="relative grid gap-10 lg:grid-cols-6 lg:gap-6">
            {chain.map((c, i) => (
              <li key={c.k} data-step className="relative pl-10 lg:pl-0">
                <span data-dot className="absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full border-2 border-[#03100a] bg-white/25 lg:relative" style={{ boxShadow: "0 0 0 4px #03100a" }} aria-hidden />
                <span className="mt-0 block font-display text-[13px] font-bold tabular-nums text-white/40 lg:mt-7">0{i + 1}</span>
                <span className="mt-1 block font-display text-[clamp(22px,1.9vw,28px)] font-bold tracking-[-0.03em] text-white">{c.k}</span>
                <span className="mt-3 block max-w-xs text-[14.5px] leading-relaxed text-white/60">{c.t}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
