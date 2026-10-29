"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ShoppingCart, Boxes, Truck, BadgePercent, BarChart3, type LucideIcon } from "lucide-react";
import { Arrow } from "@/components/ui";
import AppWindow from "@/components/visual/AppWindow";
import { links } from "@/lib/site";
import { dcaps } from "@/lib/divaltoHome";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Gestion commerciale Divalto infinity, dans le langage de l'accueil Divalto validé :
   ouverture blanche avec vraies captures superposées, puis rail de cinq panneaux bleus (un par domaine).
   Fonctions reprises de la page d'origine https://mediasoft.tn/divalto.tn/gestion-commerciale/ */

const BRAND = "#1d6fb8";

type Panel = { key: string; icon: LucideIcon; name: string; line: string; chips: string[]; cap: keyof typeof dcaps; crop?: string; bg: string; ink: string; accent: string; dark: boolean };

const panels: Panel[] = [
  { key: "ventes", icon: ShoppingCart, name: "Ventes", line: "Du devis à la facture, chaque commande suit son chemin.", chips: ["Réservations sur stock", "Factures d’acompte", "Vente comptoir"], cap: "tableau", bg: "#0d3f8f", ink: "#ffffff", accent: "#469dd6", dark: true },
  { key: "stocks", icon: Boxes, name: "Stocks", line: "Les ruptures se voient venir, les achats partent tout seuls.", chips: ["Alertes de stock", "Demandes d’achat automatiques", "Projection du stock"], cap: "stock", bg: "#e8f2fb", ink: "#0b1a2e", accent: "#1d6fb8", dark: false },
  { key: "achats", icon: Truck, name: "Achats", line: "Le bon fournisseur, au bon prix, livré à temps.", chips: ["Tarifs fournisseurs", "Frais d’approche", "Délais de livraison"], cap: "tableau", crop: "38% 78%", bg: "#081426", ink: "#ffffff", accent: "#469dd6", dark: true },
  { key: "tarifs", icon: BadgePercent, name: "Tarifs clients", line: "Chaque client paie son prix, sans calcul à la main.", chips: ["Remises par client", "Promotions", "Encours et relances"], cap: "finance", bg: "#eef6ff", ink: "#0b1a2e", accent: "#1d6fb8", dark: false },
  { key: "pilotage", icon: BarChart3, name: "Pilotage", line: "Vos achats, vos ventes et votre stock d’un coup d’œil.", chips: ["Analyse des ventes", "Analyse des achats", "Rotation du stock"], cap: "tableau", crop: "40% 30%", bg: "#134f87", ink: "#ffffff", accent: "#9fcdf0", dark: true },
];

export function GcRailHero() {
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
    <section ref={root} className="relative overflow-hidden bg-white pb-[clamp(60px,7vw,100px)] pt-[clamp(40px,5vw,72px)]" aria-labelledby="gc-title">
      <div className="container-x">
        <nav aria-label="Fil d’Ariane" className="text-[13px] text-ink-soft">
          <a href="/divalto.tn/" className="hover:text-ink">Divalto</a> <span className="mx-1.5">›</span>
          <span className="text-ink">Gestion commerciale</span>
        </nav>
        <div className="mt-8 grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <p data-f className="inline-flex items-center gap-3 rounded-full border border-line bg-mist py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-ink-2">
              <span className="grid h-7 place-items-center rounded-full bg-white px-2.5">
                <img src="/img/logos/logo-divalto.png" alt="Divalto" className="h-3.5 w-auto" />
              </span>
              Divalto infinity
            </p>
            <h1 id="gc-title" className="mt-7 font-display text-[clamp(38px,4vw,58px)] font-bold leading-[1.04] tracking-[-0.045em]">
              <span data-l className="block overflow-hidden pb-[0.06em]">
                <span className="block">Gestion commerciale.</span>
              </span>
              <span data-l className="block overflow-hidden pb-[0.06em]">
                <span className="block text-brand">Vendez plus, sans perdre le fil.</span>
              </span>
            </h1>
            <p data-f className="mt-6 max-w-[520px] text-[clamp(16.5px,1.3vw,19px)] leading-relaxed text-ink-soft">
              Ventes, stocks, achats et tarifs clients dans un seul logiciel. Mediasoft l’installe, l’adapte à votre façon de vendre et forme vos équipes.
            </p>
            <div data-f className="mt-9 flex flex-wrap gap-3">
              <a href={links.contact} className="btn btn-primary">
                Parler à un expert <Arrow />
              </a>
              <a href="#domaines" className="btn btn-ghost">
                Découvrir la solution
              </a>
            </div>
          </div>
          <div className="relative mx-auto aspect-[1.25/1] w-full max-w-[640px]">
            <div className="pointer-events-none absolute right-[-10%] top-1/2 aspect-square w-[80%] -translate-y-1/2 rounded-full bg-brand-sky opacity-20 blur-3xl" aria-hidden />
            <div data-s className="absolute left-0 top-[4%] w-[78%] -rotate-[2deg]">
              <AppWindow src={dcaps.tableau.src} alt={dcaps.tableau.alt} title="Divalto infinity" eager />
            </div>
            <div data-s className="absolute bottom-[4%] right-0 w-[56%] rotate-[3deg]">
              <AppWindow src={dcaps.stock.src} alt={dcaps.stock.alt} title="Divalto infinity" eager />
            </div>
            <div data-s className="absolute bottom-[-2%] left-[6%] w-[40%] -rotate-[4deg]">
              <AppWindow src={dcaps.finance.src} alt={dcaps.finance.alt} eager />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Shot({ p }: { p: Panel }) {
  const c = dcaps[p.cap];
  if (!p.crop) return <AppWindow src={c.src} alt={c.alt} title="divalto infinity" />;
  return (
    <div className="app-window">
      <div className="aspect-[16/9] overflow-hidden bg-white">
        <img src={c.src} alt={c.alt} className="h-full w-full scale-[1.8] object-cover" style={{ objectPosition: p.crop, transformOrigin: p.crop }} loading="lazy" />
      </div>
    </div>
  );
}

export function GcDomainsRail() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth + 48;
        gsap.to(el, {
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
              const n = Math.min(panels.length, Math.floor(self.progress * panels.length) + 1);
              const out = root.current?.querySelector("[data-count]");
              if (out) out.textContent = String(n).padStart(2, "0");
              gsap.set(root.current!.querySelector("[data-progress]"), { scaleX: self.progress });
            },
          },
        });
      });
    },
    { scope: root }
  );
  return (
    <section id="domaines" ref={root} className="relative scroll-mt-16 overflow-hidden bg-paper py-16 lg:flex lg:h-[calc(100svh-60px)] lg:flex-col lg:py-0" aria-labelledby="gc-rail-title">
      <div className="container-x flex shrink-0 items-end justify-between gap-6 lg:pb-6 lg:pt-8">
        <h2 id="gc-rail-title" className="font-display text-[clamp(30px,3.4vw,50px)] font-bold leading-[1.05] tracking-[-0.035em]">
          Cinq domaines, un seul logiciel
        </h2>
        <div className="hidden shrink-0 items-center gap-4 pb-2 lg:flex" aria-hidden>
          <span className="whitespace-nowrap font-display text-[15px] font-semibold text-ink">
            <span data-count>01</span> <span className="text-ink-soft">/ {String(panels.length).padStart(2, "0")}</span>
          </span>
          <span className="h-[3px] w-40 overflow-hidden rounded-full bg-line">
            <span data-progress className="block h-full origin-left scale-x-0 bg-brand" />
          </span>
        </div>
      </div>
      <div className="lg:min-h-0 lg:flex-1 lg:pb-8">
        <div ref={track} className="container-x mt-10 grid gap-5 lg:mt-0 lg:flex lg:h-full lg:w-max lg:max-w-none lg:gap-6 lg:pl-[max(32px,calc((100vw-1240px)/2+32px))] lg:pr-12">
          {panels.map((p, i) => {
            const Icon = p.icon;
            return (
              <article key={p.key} className="relative flex w-full shrink-0 flex-col overflow-hidden rounded-[32px] lg:h-full lg:min-h-0 lg:w-[78vw] lg:max-w-[1240px] lg:flex-row" style={{ background: p.bg, color: p.ink }} aria-label={p.name}>
                <div className={`relative z-10 flex flex-col p-8 md:p-12 lg:w-[44%] lg:justify-between lg:p-14 lg:[@media(max-height:820px)]:p-9`}>
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: p.dark ? "rgba(255,255,255,0.12)" : "#fff", color: p.dark ? "#fff" : BRAND }}>
                        <Icon size={24} aria-hidden />
                      </span>
                      <span className="font-display text-[15px] font-semibold opacity-60">
                        {String(i + 1).padStart(2, "0")} / {String(panels.length).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className={`mt-8 font-display text-[clamp(34px,3.6vw,56px)] font-bold leading-[0.95] tracking-[-0.045em] lg:[@media(max-height:820px)]:mt-5 lg:[@media(max-height:820px)]:text-[38px]`} style={{ color: p.ink }}>
                      {p.name}
                    </h3>
                    <p className={`mt-5 max-w-sm text-[clamp(19px,1.7vw,26px)] font-semibold leading-snug lg:[@media(max-height:820px)]:mt-3 lg:[@media(max-height:820px)]:text-[19px]`} style={{ color: p.ink }}>
                      {p.line}
                    </p>
                    <ul className={`mt-7 flex flex-wrap gap-2 lg:[@media(max-height:820px)]:mt-4 lg:[@media(max-height:700px)]:hidden`}>
                      {p.chips.map((c) => (
                        <li key={c} className="chip" style={{ background: p.dark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.9)", color: p.ink }}>
                          <span className="h-2 w-2 rounded-full" style={{ background: p.accent }} aria-hidden />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a href={links.contact} className={`group mt-10 inline-flex w-fit items-center gap-3 rounded-full py-3 pl-6 pr-3 text-[15.5px] font-semibold transition-transform duration-300 hover:scale-[1.03] lg:[@media(max-height:820px)]:mt-5`} style={{ background: p.dark ? "#fff" : BRAND, color: p.dark ? "#0b1a2e" : "#fff" }}>
                    Parler à un expert
                    <span className="grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1" style={{ background: p.dark ? BRAND : "rgba(0,0,0,0.15)", color: "#fff" }}>
                      <Arrow size={16} />
                    </span>
                  </a>
                </div>
                <div className="relative flex flex-1 items-center justify-center px-6 pb-10 lg:px-10 lg:pb-0">
                  <div className="pointer-events-none absolute right-[-10%] top-1/2 aspect-square w-[80%] -translate-y-1/2 rounded-full opacity-30 blur-3xl" style={{ background: p.accent }} aria-hidden />
                  <div className="relative w-full max-w-[600px]">
                    <Shot p={p} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
