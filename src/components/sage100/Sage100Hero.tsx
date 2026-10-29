"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { FileCheck2, Landmark, BarChart3, BellRing } from "lucide-react";
import { Arrow } from "@/components/ui";
import AppWindow from "@/components/visual/AppWindow";
import Laptop from "@/components/visual/Laptop";
import { links } from "@/lib/site";
import { caps, SAGE_GREEN } from "@/lib/sage100";

gsap.registerPlugin(useGSAP);

/* Ouverture : fond vert nuit de Sage, titre en deux temps, vraie capture Sage 100c sur portable
   et notifications qui s'allument une à une (les notifications sont illustratives). */

const notes = [
  { icon: FileCheck2, k: "Gestion commerciale", t: "Facture dématérialisée envoyée", pos: "left-[-4%] top-[8%]" },
  { icon: Landmark, k: "Comptabilité", t: "Rapprochement bancaire effectué", pos: "right-[-3%] top-[30%]" },
  { icon: BellRing, k: "Impayés", t: "Relance client préparée", pos: "left-[2%] bottom-[16%]" },
  { icon: BarChart3, k: "Tableau de bord", t: "Chiffre d’affaires actualisé", pos: "right-[4%] bottom-[2%]" },
];

export default function Sage100Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from("[data-line] > span", { yPercent: 110, duration: 1, stagger: 0.12 })
          .from("[data-fade]", { y: 18, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.6")
          .from("[data-stage]", { y: 40, scale: 0.94, opacity: 0, duration: 1.2 }, "-=0.9")
          .from("[data-float]", { y: 24, opacity: 0, duration: 0.8 }, "-=0.7");
        // Notifications : une à la fois, en boucle
        const n = gsap.utils.toArray<HTMLElement>("[data-note]");
        gsap.set(n, { opacity: 0, y: 14, scale: 0.96 });
        const loop = gsap.timeline({ repeat: -1, delay: 1.6 });
        n.forEach((el) => {
          loop.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" }).to(el, { opacity: 0, y: -10, duration: 0.4 }, "+=1.9");
        });
        // Légère parallaxe à la souris
        const stage = root.current!.querySelector<HTMLElement>("[data-stage]")!;
        const move = (e: PointerEvent) => {
          const r = root.current!.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(stage, { rotateY: x * 6, rotateX: -y * 5, duration: 0.8, ease: "power2.out" });
          gsap.to("[data-float]", { x: x * -18, y: y * -12, duration: 1, ease: "power2.out" });
        };
        root.current!.addEventListener("pointermove", move);
        return () => root.current?.removeEventListener("pointermove", move);
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-note]", { opacity: (i) => (i < 2 ? 1 : 0) });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-[#03100a] pb-[clamp(64px,8vw,110px)] pt-[clamp(48px,6vw,84px)] text-white"
      aria-labelledby="s100-title"
    >
      {/* Halo vert et trame fine */}
      <div className="pointer-events-none absolute -right-[10%] top-[-20%] h-[80vh] w-[70vw] rounded-full opacity-[0.22] blur-[120px]" style={{ background: SAGE_GREEN }} aria-hidden />
      <div className="pointer-events-none absolute -left-[15%] bottom-[-30%] h-[60vh] w-[50vw] rounded-full bg-brand opacity-[0.18] blur-[120px]" aria-hidden />
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
        <div>
          <p data-fade className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-white/80">
            <span className="grid h-7 place-items-center rounded-full bg-white px-2.5">
              <img src="/img/logos/Sage_Logo_Brilliant_Green_RGB.webp" alt="Sage" className="h-5 w-auto" />
            </span>
            Sage 100 · Comptabilité & gestion commerciale
          </p>

          <h1 id="s100-title" className="mt-7 font-display text-[clamp(40px,4.5vw,66px)] font-bold leading-[1] tracking-[-0.045em] !text-white">
            <span data-line className="block overflow-hidden pb-[0.06em]">
              <span className="block">Votre entreprise avance.</span>
            </span>
            <span data-line className="block overflow-hidden pb-[0.06em]">
              <span className="block" style={{ color: SAGE_GREEN }}>
                Votre gestion suit le rythme.
              </span>
            </span>
          </h1>

          <p data-fade className="mt-7 max-w-[520px] text-[clamp(16.5px,1.3vw,19px)] leading-relaxed text-white/70">
            Sage 100 réunit votre comptabilité et votre gestion commerciale dans le cloud Microsoft Azure. Du devis à la trésorerie, vos équipes partagent les mêmes informations, au bureau comme en déplacement.
          </p>

          <div data-fade className="mt-10 flex flex-wrap gap-3">
            <a href={links.contact} className="group inline-flex min-h-[54px] items-center gap-3 rounded-full py-2 pl-7 pr-2 text-[15.5px] font-semibold text-[#03100a] transition-transform duration-300 hover:scale-[1.03]" style={{ background: SAGE_GREEN }}>
              Demander une démo
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#03100a] text-white transition-transform duration-300 group-hover:translate-x-1">
                <Arrow size={17} />
              </span>
            </a>
            <a href="#formules" className="inline-flex min-h-[54px] items-center rounded-full border border-white/20 px-7 text-[15.5px] font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5">
              Choisir ma formule
            </a>
          </div>
        </div>

        {/* Scène */}
        <div className="relative [perspective:1400px]">
          <div data-stage className="relative mx-auto w-full max-w-[680px] [transform-style:preserve-3d]">
            <div className="pointer-events-none absolute inset-x-[8%] bottom-[2%] h-[18%] rounded-[50%] opacity-40 blur-3xl" style={{ background: SAGE_GREEN }} aria-hidden />
            <Laptop src={caps.laptop.src} alt={caps.laptop.alt} eager />
            <div data-float className="absolute -bottom-[10%] -left-[6%] hidden w-[46%] rotate-[-4deg] sm:block">
              <AppWindow src={caps.ca.src} alt={caps.ca.alt} title="Sage 100c · CA comptable" eager />
            </div>

            {notes.map(({ icon: Icon, k, t, pos }) => (
              <div key={t} data-note className={`absolute ${pos} hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1f15]/85 px-3.5 py-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-md md:flex`}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: SAGE_GREEN, color: "#03100a" }}>
                  <Icon size={17} aria-hidden />
                </span>
                <span className="leading-tight">
                  <span className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/50">{k}</span>
                  <span className="block text-[13.5px] font-semibold text-white">{t}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
