"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ShoppingCart, Cog, FolderKanban, Warehouse, Landmark, Wrench, BadgeCheck, Package, Boxes, Zap, CalendarClock, ScanSearch,
  Wallet, Timer, Map, Truck, TrendingUp, FilePen, LineChart, ShieldCheck, Settings2, BellRing, SlidersHorizontal, type LucideIcon,
} from "lucide-react";
import { Arrow } from "@/components/ui";
import { AffaireIllus, GpaoIllus } from "./Illustrations";

gsap.registerPlugin(ScrollTrigger, useGSAP);
import { DIV_INK as INK, DIV_ORANGE as ORANGE } from "@/lib/divaltoHome";
import { dHref, type Block } from "@/lib/divalto";

/* Composants interactifs de la section Divalto : explorateur des fonctions d'un module,
   onglets des modules de la page ERP, sommaire actif et barre de lecture des dossiers. */

export function SceneExplorer({ scenes }: { scenes: Block[] }) {
  const [i, setI] = useState(0);
  const s = scenes[i];
  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
      <ul role="tablist" className="border-t border-line">
        {scenes.map((x, k) => {
          const on = k === i;
          return (
            <li key={x.t} className="border-b border-line">
              <button role="tab" aria-selected={on} onClick={() => setI(k)} onMouseEnter={() => setI(k)} className="group flex w-full items-center gap-5 py-5 text-left">
                <span className="font-display text-[13px] font-bold tabular-nums" style={{ color: on ? ORANGE : "rgba(82,98,122,0.5)" }}>
                  0{k + 1}
                </span>
                <span className={`flex-1 font-display text-[clamp(19px,1.7vw,24px)] font-bold tracking-[-0.03em] transition-all duration-300 ${on ? "translate-x-1 text-ink" : "text-ink/40 group-hover:text-ink/70"}`}>{x.t}</span>
                <span className={`h-[2px] rounded-full transition-all duration-500 ${on ? "w-10" : "w-0"}`} style={{ background: ORANGE }} aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>
      <div key={i} className="s100-swap relative overflow-hidden rounded-[30px] p-8 md:p-10" style={{ background: INK }}>
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full opacity-30 blur-3xl" style={{ background: ORANGE }} aria-hidden />
        <p className="relative font-display text-[clamp(24px,2.4vw,34px)] font-bold leading-tight tracking-[-0.035em] text-white">{s.t}</p>
        {s.d && <p className="relative mt-4 max-w-xl text-[16px] leading-relaxed text-white/70">{s.d}</p>}
        {s.items && (
          <ul className="relative mt-8 grid gap-2.5 sm:grid-cols-2">
            {s.items.map((it, k) => (
              <li key={it} className="div-tick-in flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-[14.5px] font-medium text-white/90" style={{ animationDelay: `${k * 90}ms` }}>
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: ORANGE }} aria-hidden />
                {it}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

type ErpModule = { name: string; slug: string | null; blocks: Block[] };

const erpIcons: Record<string, LucideIcon> = {
  "Gestion commerciale": ShoppingCart, GPAO: Cog, "Gestion à l’affaire": FolderKanban, WMS: Warehouse,
  "Comptabilité et finances": Landmark, "GMAO-GRM": Wrench, "Qualité-SMQ": BadgeCheck,
};
const blockIcons: LucideIcon[][] = [
  [Package, Boxes, Zap],
  [Cog, CalendarClock, ScanSearch],
  [FolderKanban, Wallet, Timer],
  [Map, Truck, TrendingUp],
  [FilePen, LineChart, ShieldCheck],
  [Wrench, Settings2, BellRing],
  [BadgeCheck, SlidersHorizontal, Timer],
];
const erpVisual: Record<string, { cap?: string; alt?: string; illus?: "gpao" | "affaire" }> = {
  "Gestion commerciale": { cap: "/img/produits/div-tableau.webp", alt: "Divalto infinity : tableau de bord commercial" },
  GPAO: { illus: "gpao" },
  "Gestion à l’affaire": { illus: "affaire" },
  WMS: { cap: "/img/produits/div-stock.webp", alt: "Divalto infinity : stocks et entrepôt" },
  "Comptabilité et finances": { cap: "/img/produits/div-finance.webp", alt: "Divalto infinity : recouvrement et finances" },
  "GMAO-GRM": { cap: "/img/produits/div-crm-mobile.webp", alt: "Divalto : interventions et application mobile" },
  "Qualité-SMQ": { cap: "/img/produits/div-tableau.webp", alt: "Divalto infinity : tableau de bord" },
};

export function ErpTabs({ modules }: { modules: ErpModule[] }) {
  const [i, setI] = useState(0);
  const m = modules[i];
  const v = erpVisual[m.name] ?? {};
  const Icon = erpIcons[m.name] ?? Cog;
  return (
    <div>
      <div role="tablist" aria-label="Modules de divalto infinity" className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {modules.map((x, k) => {
          const on = k === i;
          const I = erpIcons[x.name] ?? Cog;
          return (
            <button key={x.name} role="tab" aria-selected={on} onClick={() => setI(k)} className={`inline-flex shrink-0 items-center gap-2 rounded-full py-2 pl-2 pr-4 text-[14.5px] font-semibold transition-all ${on ? "text-white shadow-lg" : "border border-line bg-white text-ink-soft hover:border-[#ff5500]/40 hover:text-ink"}`} style={on ? { background: ORANGE } : undefined}>
              <span className={`grid h-7 w-7 place-items-center rounded-full ${on ? "bg-white/20" : "bg-[#fff0e6] text-[#d64700]"}`}>
                <I size={14} aria-hidden />
              </span>
              {x.name}
            </button>
          );
        })}
      </div>

      <div key={i} className="s100-swap mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Le module : nom, visuel, lien */}
        <div className="relative flex flex-col overflow-hidden rounded-[28px] p-7 text-white md:p-9" style={{ background: INK }}>
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-35 blur-3xl" style={{ background: ORANGE }} aria-hidden />
          <div className="relative flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl text-white" style={{ background: ORANGE }}>
              <Icon size={24} aria-hidden />
            </span>
            <span className="font-display text-[14px] font-bold text-white/55">
              {String(i + 1).padStart(2, "0")} / {String(modules.length).padStart(2, "0")}
            </span>
          </div>
          <p className="relative mt-6 font-display text-[clamp(28px,2.8vw,40px)] font-bold leading-[1] tracking-[-0.04em] text-white">{m.name}</p>
          <div className="relative mt-7">
            {v.cap ? (
              <img src={v.cap} alt={v.alt} className={`block w-full ${v.cap.includes("-detoure") ? "drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]" : "rounded-[16px] bg-white shadow-xl"}`} loading="lazy" />
            ) : v.illus === "gpao" ? (
              <GpaoIllus />
            ) : (
              <AffaireIllus />
            )}
          </div>
          {m.slug && (
            <a href={dHref(m.slug)} className="group relative mt-7 inline-flex w-fit items-center gap-3 rounded-full bg-white py-2.5 pl-5 pr-2.5 text-[15px] font-semibold" style={{ color: INK }}>
              Découvrir le module
              <span className="grid h-8 w-8 place-items-center rounded-full text-white transition-transform group-hover:translate-x-1" style={{ background: ORANGE }}>
                <Arrow size={15} />
              </span>
            </a>
          )}
        </div>

        {/* Les trois points en cartes blanches colorées */}
        <ol className="grid gap-4">
          {m.blocks.map((b, k) => {
            const BI = (blockIcons[i] ?? [])[k] ?? Cog;
            const blue = k === 1;
            return (
              <li key={b.t} className="relative flex gap-5 overflow-hidden rounded-[22px] bg-white p-6 shadow-[0_18px_40px_-28px_rgba(11,26,46,0.45)] ring-1 ring-line md:p-7">
                <span className={`absolute inset-y-0 left-0 w-1.5 ${blue ? "bg-brand" : ""}`} style={blue ? undefined : { background: ORANGE }} aria-hidden />
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white ${blue ? "bg-brand" : ""}`} style={blue ? undefined : { background: ORANGE }}>
                  <BI size={21} aria-hidden />
                </span>
                <span>
                  <span className="font-display text-[12.5px] font-bold text-ink-soft/70">{String(k + 1).padStart(2, "0")}</span>
                  <span className="mt-0.5 block font-display text-[20px] font-bold leading-snug tracking-[-0.025em]" style={{ color: INK }}>
                    {b.t}
                  </span>
                  <span className="mt-1.5 block text-[15px] leading-relaxed text-ink-soft">{b.d}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      setP(Math.min(1, h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <div className="fixed left-0 top-0 z-[60] h-[3px] origin-left" style={{ width: "100%", transform: `scaleX(${p})`, background: ORANGE }} aria-hidden />;
}

export function Toc({ items }: { items: { id: string; h: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-30% 0px -60% 0px" }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);
  return (
    <nav aria-label="Sommaire">
      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-soft">Sommaire</p>
      <ol className="mt-4 space-y-1 border-l border-line">
        {items.map((it, k) => {
          const on = it.id === active;
          return (
            <li key={it.id}>
              <a href={`#${it.id}`} className={`-ml-px block border-l-2 py-1.5 pl-4 text-[14px] transition-colors ${on ? "font-semibold text-ink" : "border-transparent text-ink-soft hover:text-ink"}`} style={on ? { borderColor: ORANGE } : undefined}>
                <span className="mr-2 tabular-nums text-ink-soft/60">0{k + 1}</span>
                {it.h}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* Atouts d'un module : cartes numérotées qui s'empilent au défilement (même effet que « En détail », inspiration hugeinc.com) */
export function AtoutsStack({ points, cap }: { points: Block[]; cap?: { src: string; alt: string } }) {
  const crops = ["20% 30%", "75% 35%", "40% 75%", "80% 80%", "30% 55%", "60% 20%", "50% 50%"];
  const root = useRef<HTMLOListElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-acard]");
        cards.forEach((c, i) => {
          if (i === cards.length - 1) return;
          gsap.to(c.querySelector("[data-ainner]"), {
            scale: 0.95,
            ease: "none",
            scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top+=160", scrub: true },
          });
        });
      });
    },
    { scope: root }
  );
  return (
    <ol ref={root} className="mt-12 space-y-6 lg:space-y-[14vh]">
      {points.map((pt, i) => (
        <li key={pt.t} data-acard className="lg:sticky" style={{ top: `${98 + i * 22}px` }}>
          <div data-ainner className="origin-top rounded-[30px] bg-[#f8f7f4] p-8 text-ink shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.6)] md:p-11">
            <div className="flex items-start justify-between gap-8">
              <div>
                <span className="font-display text-[clamp(40px,4vw,60px)] font-bold leading-none tracking-[-0.05em]" style={{ color: ORANGE }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-[clamp(32px,4.2vw,62px)] font-bold leading-[0.98] tracking-[-0.05em]" style={{ color: INK }}>
                  {pt.t}.
                </h3>
                {pt.d && <p className="mt-4 max-w-2xl text-[clamp(16px,1.3vw,19px)] font-medium leading-relaxed text-ink-2">{pt.d}</p>}
              </div>
              {cap && (
                <figure className="hidden w-[300px] shrink-0 overflow-hidden rounded-[18px] bg-[#0b1a2e] p-2 shadow-xl md:block">
                  <div className="aspect-[16/10] overflow-hidden rounded-[12px] bg-white">
                    <img src={cap.src} alt={cap.alt} className="h-full w-full scale-[1.7] object-cover" style={{ objectPosition: crops[i % crops.length], transformOrigin: crops[i % crops.length] }} loading="lazy" />
                  </div>
                  <figcaption className="px-2 pb-1 pt-2 text-[11px] text-white/50">Capture réelle de Divalto infinity</figcaption>
                </figure>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
