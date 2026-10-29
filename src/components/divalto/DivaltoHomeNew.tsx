"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Check, Headset, Phone } from "lucide-react";
import { Arrow } from "@/components/ui";
import AppWindow from "@/components/visual/AppWindow";
import Laptop from "@/components/visual/Laptop";
import { links, site } from "@/lib/site";
import { dcaps } from "@/lib/divaltoHome";
import { catHref, dHref, ERP_SLUG, familyPages, modulePages, sectorPages, type ModulePage } from "@/lib/divalto";
import { DIcon } from "./kit";
import { AffaireIllus, DematIllus, GpaoIllus } from "./Illustrations";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Accueil Divalto aux couleurs du site Mediasoft (blanc et bleu) : ouverture avec vraies captures,
   rail des six modules qui défile à l'horizontale (comme « Intégration de logiciels de gestion »),
   grille des solutions métiers, accompagnement Mediasoft, contact. */

const BRAND = "#1d6fb8";
const NIGHT = "#081426";

const panelStyle: Record<string, { bg: string; ink: string; accent: string; dark: boolean }> = {
  gc: { bg: "#0d3f8f", ink: "#ffffff", accent: "#469dd6", dark: true },
  gpao: { bg: "#e8f2fb", ink: "#0b1a2e", accent: "#1d6fb8", dark: false },
  affaire: { bg: "#081426", ink: "#ffffff", accent: "#469dd6", dark: true },
  wms: { bg: "#eef6ff", ink: "#0b1a2e", accent: "#1d6fb8", dark: false },
  compta: { bg: "#134f87", ink: "#ffffff", accent: "#9fcdf0", dark: true },
  demat: { bg: "#f3f7fc", ink: "#0b1a2e", accent: "#1d6fb8", dark: false },
};

export function DivaltoHomeHero() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from("[data-l] > span", { yPercent: 110, duration: 1, stagger: 0.12 })
          .from("[data-f]", { y: 18, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.6")
          .from("[data-s]", { y: 40, opacity: 0, duration: 1, stagger: 0.12 }, "-=0.8");
      });
    },
    { scope: root }
  );
  return (
    <section ref={root} className="relative overflow-hidden bg-[#140902] pb-[clamp(60px,7vw,100px)] pt-[clamp(48px,6vw,84px)] text-white" aria-labelledby="div-title">
      <div className="pointer-events-none absolute -right-[10%] top-[-20%] h-[80vh] w-[70vw] rounded-full bg-[#ff5500] opacity-[0.22] blur-[120px]" aria-hidden />
      <div className="pointer-events-none absolute -left-[15%] bottom-[-30%] h-[60vh] w-[50vw] rounded-full bg-brand opacity-[0.15] blur-[120px]" aria-hidden />
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div>
          <p data-f className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-white/80">
            <span className="grid h-7 place-items-center rounded-full bg-white px-2.5">
              <img src="/img/logos/logo-divalto.png" alt="Divalto" className="h-3.5 w-auto" />
            </span>
            Revendeur Divalto en Tunisie
          </p>
          <h1 id="div-title" className="mt-7 font-display text-[clamp(40px,4.6vw,66px)] font-bold leading-[1.02] tracking-[-0.045em] !text-white">
            <span data-l className="block overflow-hidden pb-[0.06em]">
              <span className="block">Votre métier a ses règles.</span>
            </span>
            <span data-l className="block overflow-hidden pb-[0.06em]">
              <span className="block text-[#ff5500]">Votre ERP aussi.</span>
            </span>
          </h1>
          <p data-f className="mt-6 max-w-[520px] text-[clamp(16.5px,1.3vw,19px)] leading-relaxed text-white/70">
            Divalto infinity, l’ERP et CRM des PME et ETI : ventes, production, affaires, entrepôt, finance et documents sur une seule plateforme. Mediasoft l’installe et l’adapte à votre métier.
          </p>
          <div data-f className="mt-9 flex flex-wrap gap-3">
            <a href={links.contact} className="group inline-flex min-h-[54px] items-center gap-3 rounded-full bg-[#ff5500] py-2 pl-7 pr-2 text-[15.5px] font-semibold text-white transition-transform duration-300 hover:scale-[1.03]">
              Contactez-nous
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#140902] text-white transition-transform duration-300 group-hover:translate-x-1">
                <Arrow size={17} />
              </span>
            </a>
            <a href={dHref(ERP_SLUG)} className="btn btn-outline-light !min-h-[54px]">
              Découvrir divalto infinity
            </a>
          </div>
        </div>
        {/* Scène : vraie capture Divalto sur portable, fenêtre flottante et notifications (illustratives) */}
        <div className="relative mx-auto w-full max-w-[640px]">
          <div data-s>
            <Laptop src={dcaps.tableau.src} alt={dcaps.tableau.alt} eager />
          </div>
          <div data-s className="absolute -bottom-[14%] -left-[6%] hidden w-[50%] -rotate-[4deg] sm:block">
            <AppWindow src={dcaps.finance.src} alt={dcaps.finance.alt} title="Divalto infinity · Recouvrement" eager />
          </div>
          {[
            { k: "Gestion commerciale", t: "Commande client enregistrée", pos: "right-[-4%] top-[-7%]" },
            { k: "WMS", t: "Préparation de commande lancée", pos: "right-[-2%] top-[30%]" },
            { k: "Finance", t: "Relance client envoyée", pos: "right-[6%] bottom-[-10%]" },
          ].map((n, i) => (
            <div key={n.t} className={`div-note absolute ${n.pos} hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#2a1608]/85 px-3.5 py-2.5 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] backdrop-blur-md md:flex`} style={{ animationDelay: `${1.2 + i * 2.6}s` }}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#ff5500] text-white">
                <Arrow size={15} />
              </span>
              <span className="leading-tight">
                <span className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/55">{n.k}</span>
                <span className="block text-[13.5px] font-semibold text-white">{n.t}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Visual({ m }: { m: ModulePage }) {
  if (m.cap) return <AppWindow src={dcaps[m.cap].src} alt={dcaps[m.cap].alt} title={`divalto infinity · ${m.name}`} />;
  if (m.key === "gpao") return <GpaoIllus />;
  if (m.key === "affaire") return <AffaireIllus />;
  return <DematIllus />;
}

function ModulePanel({ m, i }: { m: ModulePage; i: number }) {
  const st = panelStyle[m.key];
  return (
    <article data-panel className="relative flex w-full shrink-0 flex-col overflow-hidden rounded-[32px] lg:h-full lg:min-h-0 lg:w-[78vw] lg:max-w-[1240px] lg:flex-row" style={{ background: st.bg, color: st.ink }} aria-label={m.name}>
      <div className="relative z-10 flex flex-col p-8 md:p-12 lg:w-[44%] lg:justify-between lg:p-14 lg:[@media(max-height:820px)]:p-9">
        <div>
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: st.dark ? "rgba(255,255,255,0.12)" : "#fff", color: st.dark ? "#fff" : BRAND }}>
              <DIcon name={m.key} size={24} />
            </span>
            <span className="font-display text-[15px] font-semibold opacity-60">
              {String(i + 1).padStart(2, "0")} / {String(modulePages.length).padStart(2, "0")}
            </span>
          </div>
          <h3 className="mt-8 font-display text-[clamp(32px,3.4vw,52px)] font-bold leading-[0.95] tracking-[-0.045em] lg:[@media(max-height:820px)]:mt-5 lg:[@media(max-height:820px)]:text-[36px]" style={{ color: st.ink }}>
            {m.name}
          </h3>
          <p className="mt-5 max-w-sm text-[clamp(18px,1.6vw,24px)] font-semibold leading-snug lg:[@media(max-height:820px)]:mt-3 lg:[@media(max-height:820px)]:text-[18px]" style={{ color: st.ink }}>
            {m.title} {m.accent}
          </p>
          <ul className="mt-7 flex flex-wrap gap-2 lg:[@media(max-height:820px)]:mt-4 lg:[@media(max-height:700px)]:hidden">
            {m.promise.map((c) => (
              <li key={c} className="chip" style={{ background: st.dark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.9)", color: st.ink }}>
                <span className="h-2 w-2 rounded-full" style={{ background: st.accent }} aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <a href={dHref(m.slug)} className="group mt-10 lg:[@media(max-height:820px)]:mt-5 inline-flex w-fit items-center gap-3 rounded-full py-3 pl-6 pr-3 text-[15.5px] font-semibold transition-transform duration-300 hover:scale-[1.03]" style={{ background: st.dark ? "#fff" : BRAND, color: st.dark ? "#0b1a2e" : "#fff" }}>
          Découvrir {m.name}
          <span className="grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1" style={{ background: st.dark ? BRAND : "rgba(0,0,0,0.15)", color: "#fff" }}>
            <Arrow size={16} />
          </span>
        </a>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-6 pb-10 lg:px-10 lg:pb-0">
        <div className="pointer-events-none absolute right-[-10%] top-1/2 aspect-square w-[80%] -translate-y-1/2 rounded-full opacity-30 blur-3xl" style={{ background: st.accent }} aria-hidden />
        <div data-par className="relative w-full max-w-[600px]">
          <Visual m={m} />
        </div>
      </div>
    </article>
  );
}

export function DivaltoModulesRail() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth + 48;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top+=60",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const n = Math.min(modulePages.length, Math.floor(self.progress * modulePages.length) + 1);
              const out = root.current?.querySelector("[data-count]");
              if (out) out.textContent = String(n).padStart(2, "0");
              gsap.set("[data-progress]", { scaleX: self.progress });
            },
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
          const w = panel.querySelector("[data-par]");
          if (w) gsap.fromTo(w, { xPercent: 10 }, { xPercent: -10, ease: "none", scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
      });
    },
    { scope: root }
  );
  return (
    <section ref={root} className="relative overflow-hidden bg-paper py-16 lg:flex lg:h-[calc(100svh-60px)] lg:flex-col lg:py-0" aria-labelledby="div-rail-title">
      <div className="container-x flex shrink-0 items-end justify-between gap-6 lg:pb-6 lg:pt-8">
        <h2 id="div-rail-title" className="font-display text-[clamp(30px,3.4vw,50px)] font-bold leading-[1.05] tracking-[-0.035em]">
          Les modules de divalto infinity
        </h2>
        <div className="hidden items-center gap-4 pb-2 lg:flex" aria-hidden>
          <span className="font-display text-[15px] font-semibold text-ink">
            <span data-count>01</span> <span className="text-ink-soft">/ {String(modulePages.length).padStart(2, "0")}</span>
          </span>
          <span className="h-[3px] w-40 overflow-hidden rounded-full bg-line">
            <span data-progress className="block h-full origin-left scale-x-0 bg-brand" />
          </span>
        </div>
      </div>
      <div className="lg:min-h-0 lg:flex-1 lg:pb-8">
        <div ref={track} className="container-x mt-10 grid gap-5 lg:mt-0 lg:flex lg:h-full lg:w-max lg:max-w-none lg:gap-6 lg:pl-[max(32px,calc((100vw-1240px)/2+32px))] lg:pr-12">
          {modulePages.map((m, i) => (
            <ModulePanel key={m.slug} m={m} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const famShort: Record<string, string> = { "industrie-erp-crm": "Industrie", "commerce-negoce-et-distribution": "Commerce & négoce", services: "Services terrain" };
const WR = 1150; // rayon de la roue (px)
const WSTEP = 19; // écart entre deux cartes (degrés)

function SectorCard({ s, className = "", style }: { s: (typeof sectorPages)[number]; className?: string; style?: React.CSSProperties }) {
  const fam = familyPages.find((f) => f.slug === s.family);
  return (
    <a href={dHref(s.slug)} className={`group flex flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_30px_60px_-25px_rgba(11,26,46,0.35)] ring-1 ring-line ${className}`} style={style}>
      <div className="relative h-[52%] shrink-0 overflow-hidden bg-mist">
        <img src={`/img/divalto/secteurs/${s.slug}.webp`} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        {fam && <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[12px] font-bold text-ink backdrop-blur">{famShort[fam.slug] ?? fam.name}</span>}
      </div>
      <span className="h-1.5 shrink-0 bg-[#ff5500]" aria-hidden />
      <div className="flex flex-1 flex-col p-6">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ff5500] text-white">
          <DIcon name={s.icon} size={18} />
        </span>
        <h3 className="mt-4 font-display text-[clamp(19px,1.7vw,24px)] font-bold leading-[1.08] tracking-[-0.03em] text-ink">{s.name}</h3>
        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[14px] font-semibold text-[#d64700]">
          Découvrir <Arrow size={15} />
        </span>
      </div>
    </a>
  );
}

export function DivaltoMetiers() {
  const root = useRef<HTMLElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          wheel.current,
          { rotate: 0 },
          {
            rotate: -(sectorPages.length - 1) * WSTEP,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top+=60", end: () => `+=${(sectorPages.length - 1) * 340}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
          }
        );
      });
    },
    { scope: root }
  );
  return (
    <section ref={root} className="relative overflow-hidden bg-white py-16 lg:flex lg:h-[calc(100svh-60px)] lg:flex-col lg:py-0" aria-labelledby="div-met-title">
      <div className="container-x relative z-10 flex shrink-0 items-end justify-between gap-6 lg:pt-8">
        <div>
          <p className="eyebrow">Solutions métiers</p>
          <h2 id="div-met-title" className="mt-3 font-display text-[clamp(28px,3.2vw,46px)] font-bold leading-[1.04] tracking-[-0.04em]">
            Une solution prête <span className="text-[#ff5500]">pour votre métier.</span>
          </h2>
        </div>
        <a href={catHref("solutions-metiers")} className="link-arrow hidden pb-2 text-[15px] md:inline-flex">
          Toutes les solutions <Arrow size={16} />
        </a>
      </div>

      {/* Ordinateur : les secteurs tournent sur une grande roue */}
      <div className="relative hidden min-h-0 flex-1 lg:block">
        <div ref={wheel} className="absolute left-1/2 h-0 w-0" style={{ top: `calc(50% - 22px + ${WR}px)` }}>
          {sectorPages.map((s, i) => (
            <SectorCard key={s.slug} s={s} className="absolute left-0 top-0 h-[min(calc(100svh-310px),480px)] w-[300px]" style={{ transform: `translate(-50%, -50%) rotate(${i * WSTEP}deg) translateY(-${WR}px)` }} />
          ))}
        </div>
      </div>

      {/* Mobile : défilement au doigt */}
      <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
        {sectorPages.map((s) => (
          <SectorCard key={s.slug} s={s} className="relative aspect-[4/5] w-[74vw] max-w-[340px] shrink-0 snap-center" />
        ))}
      </div>
    </section>
  );
}

const steps = [
  { t: "Conseil", d: "Nous regardons comment vous travaillez avant de recommander quoi que ce soit." },
  { t: "Personnalisation", d: "Paramétrage, modules spécifiques, connecteurs : Divalto prend la forme de votre entreprise." },
  { t: "Formation", d: "Vos utilisateurs sont formés pour adopter l’outil dès le premier jour." },
  { t: "Assistance", d: "Help desk, assistance à distance et deux agences, à Tunis et à Sousse." },
];

export function DivaltoAccompagnement() {
  const phone = site.techPhones[0];
  return (
    <>
      <section className="bg-[#fff7f0] py-[clamp(80px,10vw,130px)]" aria-labelledby="div-acc-title">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Visuel : vraie capture Divalto dans un ordinateur, sur un panneau sombre orangé, avec le suivi des 4 étapes */}
          <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(150deg,#2a1205,#120803_70%)] p-7 pb-24 md:p-10 md:pb-28">
            <div className="pointer-events-none absolute -right-[20%] -top-[30%] h-[80%] w-[70%] rounded-full bg-[#ff5500] opacity-25 blur-[100px]" aria-hidden />
            <div className="relative flex items-center gap-3">
              <span className="grid h-9 place-items-center rounded-full bg-white px-3">
                <img src="/img/logos/logo-divalto.png" alt="Divalto" className="h-3.5 w-auto" />
              </span>
              <span className="text-[13px] font-semibold text-white/75">Revendeur et intégrateur en Tunisie</span>
            </div>
            <Laptop src={dcaps.tableau.src} alt={dcaps.tableau.alt} className="relative mt-7" />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-md md:inset-x-8 md:bottom-7">
              <ol className="grid grid-cols-4 gap-2">
                {steps.map((st, i) => (
                  <li key={st.t} className="flex flex-col items-center gap-1.5 text-center">
                    <span className="grid h-8 w-8 place-items-center rounded-full text-white" style={{ background: i < 3 ? "#ff5500" : "rgba(255,255,255,0.12)" }}>
                      {i < 3 ? <Check size={15} strokeWidth={3} /> : <Headset size={15} />}
                    </span>
                    <span className="max-w-full break-words text-[9px] font-semibold leading-tight text-white/85 sm:text-[11.5px]">{st.t}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div>
            <p className="eyebrow !text-[#d64700]">L’accompagnement Mediasoft</p>
            <h2 id="div-acc-title" className="mt-4 font-display text-[clamp(30px,3.6vw,50px)] font-bold leading-[1.04] tracking-[-0.04em]">
              Un ERP se choisit. <span className="text-[#ff5500]">Il se réussit avec un partenaire.</span>
            </h2>
            <ol className="mt-9 border-t border-line-strong">
              {steps.map((s, i) => (
                <li key={s.t} className="group grid grid-cols-[auto_1fr] gap-x-5 border-b border-line-strong py-5 transition-colors hover:bg-white/60">
                  <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-[#fff0e6] font-display text-[12.5px] font-bold text-[#d64700] transition-colors group-hover:bg-[#ff5500] group-hover:text-white">0{i + 1}</span>
                  <span>
                    <span className="block font-display text-[19px] font-bold tracking-[-0.02em] text-ink">{s.t}</span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-ink-soft">{s.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section className="bg-white py-[clamp(70px,9vw,120px)]" aria-labelledby="div-cta2-title">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[40px] bg-[linear-gradient(135deg,#2a1205,#120803_65%)] px-8 py-14 text-white md:px-16 md:py-20">
            <div className="pointer-events-none absolute -right-[10%] -top-[40%] h-[140%] w-[60%] rounded-full bg-[#ff5500] opacity-35 blur-[120px]" aria-hidden />
            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <h2 id="div-cta2-title" className="font-display text-[clamp(32px,4vw,56px)] font-bold leading-[1.03] tracking-[-0.045em] !text-white">
                  Parlons de votre projet <span className="text-[#ff5500]">Divalto.</span>
                </h2>
                <p className="mt-5 max-w-lg text-[16.5px] leading-relaxed text-white/70">Un consultant Mediasoft étudie votre activité et vous montre la solution Divalto qui lui correspond.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
                <a href={links.contact} className="btn btn-light lg:min-w-[280px]">
                  Contactez-nous <Arrow />
                </a>
                <a href={phone.href} className="btn btn-outline-light lg:min-w-[280px]">
                  <Phone size={17} aria-hidden /> {phone.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
