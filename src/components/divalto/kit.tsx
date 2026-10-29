"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ShoppingCart, Cog, FolderKanban, Warehouse, Landmark, FileText, Wrench, Factory, Boxes, Recycle, Wheat, Sparkles,
  Wine, Gem, Shirt, Ruler, HardHat, FlaskConical, Store, Headset, ChevronRight, type LucideIcon,
} from "lucide-react";
import { Arrow } from "@/components/ui";
import { DIV_INK, DIV_ORANGE } from "@/lib/divaltoHome";
import { BASE, dHref, labelOf, modulePages } from "@/lib/divalto";

/* Briques communes de la section Divalto : fil d'Ariane, icônes,
   schéma de la plateforme (modules reliés), liens « à découvrir aussi » et apparition au défilement. */

export const ORANGE = DIV_ORANGE;
export const INK = DIV_INK;

const icons: Record<string, LucideIcon> = {
  gc: ShoppingCart, gpao: Cog, affaire: FolderKanban, wms: Warehouse, compta: Landmark, demat: FileText,
  wrench: Wrench, factory: Factory, kanban: FolderKanban, boxes: Boxes, recycle: Recycle, wheat: Wheat, sparkles: Sparkles,
  wine: Wine, gem: Gem, shirt: Shirt, ruler: Ruler, hardhat: HardHat, flask: FlaskConical, store: Store, headset: Headset,
};

export function DIcon({ name, size = 22, className = "" }: { name: string; size?: number; className?: string }) {
  const I = icons[name] ?? Boxes;
  return <I size={size} className={className} aria-hidden />;
}

/* Apparition douce au défilement (respecte « réduire les animations ») */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setOn(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { rootMargin: "0px 0px -12% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] ${on ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Crumbs({ items, light = false }: { items: { label: string; href?: string }[]; light?: boolean }) {
  return (
    <ol className={`flex flex-wrap items-center gap-1.5 text-[13px] ${light ? "text-white/55" : "text-ink-soft"}`} aria-label="Fil d’Ariane">
      <li>
        <a href={`${BASE}/`} className={light ? "hover:text-white" : "hover:text-ink"}>
          Divalto
        </a>
      </li>
      {items.map((c) => (
        <li key={c.label} className="flex items-center gap-1.5">
          <ChevronRight size={13} aria-hidden />
          {c.href ? (
            <a href={c.href} className={light ? "hover:text-white" : "hover:text-ink"}>
              {c.label}
            </a>
          ) : (
            <span className={light ? "text-white/85" : "text-ink"}>{c.label}</span>
          )}
        </li>
      ))}
    </ol>
  );
}

/* Schéma de la plateforme : les six modules autour du cœur Divalto infinity, ceux de la page allumés */
const ring = [
  { x: 50, y: 8 },
  { x: 88, y: 30 },
  { x: 88, y: 70 },
  { x: 50, y: 92 },
  { x: 12, y: 70 },
  { x: 12, y: 30 },
];

export function PlatformMap({ highlight = [], dark = false }: { highlight?: string[]; dark?: boolean }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r="41" fill="none" stroke={dark ? "rgba(255,255,255,0.08)" : "rgba(13,20,36,0.08)"} strokeWidth="0.3" />
        {modulePages.map((m, i) => {
          const on = highlight.includes(m.slug);
          return (
            <g key={m.slug}>
              <line x1="50" y1="50" x2={ring[i].x} y2={ring[i].y} stroke={on ? ORANGE : dark ? "rgba(255,255,255,0.15)" : "rgba(13,20,36,0.12)"} strokeWidth={on ? 0.6 : 0.35} />
              {on && <line x1="50" y1="50" x2={ring[i].x} y2={ring[i].y} stroke={ORANGE} strokeWidth="0.9" strokeDasharray="1.2 6" className="div-flow" />}
            </g>
          );
        })}
      </svg>
      <div className="absolute left-1/2 top-1/2 grid h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-center shadow-[0_20px_50px_-15px_rgba(255,85,0,0.6)]" style={{ background: INK }}>
        <span className="px-2 font-display text-[clamp(11px,1.5vw,15px)] font-bold leading-tight text-white">
          divalto
          <br />
          <span style={{ color: ORANGE }}>infinity</span>
        </span>
      </div>
      {modulePages.map((m, i) => {
        const on = highlight.includes(m.slug);
        return (
          <a
            key={m.slug}
            href={dHref(m.slug)}
            className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 text-center transition-transform hover:scale-105`}
            style={{ left: `${ring[i].x}%`, top: `${ring[i].y}%` }}
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl shadow-lg transition-colors sm:h-14 sm:w-14" style={{ background: on ? ORANGE : dark ? "rgba(255,255,255,0.08)" : "#fff", color: on ? "#fff" : dark ? "rgba(255,255,255,0.6)" : INK, border: on ? "none" : dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #ece4dc" }}>
              <DIcon name={m.key} size={20} />
            </span>
            <span className={`max-w-[110px] text-[11.5px] font-semibold leading-tight sm:text-[12.5px] ${on ? (dark ? "text-white" : "text-ink") : dark ? "text-white/45" : "text-ink-soft"}`}>{m.name}</span>
          </a>
        );
      })}
    </div>
  );
}

/* Liens vers des pages voisines */
export function RelatedLinks({ title, slugs, dark = false }: { title: string; slugs: string[]; dark?: boolean }) {
  return (
    <div>
      <p className={`text-[12px] font-bold uppercase tracking-[0.14em] ${dark ? "text-white/50" : "text-ink-soft"}`}>{title}</p>
      <ul className={`mt-4 border-t ${dark ? "border-white/10" : "border-line"}`}>
        {slugs.map((s) => (
          <li key={s} className={`border-b ${dark ? "border-white/10" : "border-line"}`}>
            <a href={dHref(s)} className={`group flex items-center justify-between gap-4 py-4 font-display text-[18px] font-semibold tracking-[-0.02em] transition-colors ${dark ? "text-white/85 hover:text-white" : "text-ink hover:text-[#d64700]"}`}>
              {labelOf(s)}
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-current/20 transition-all group-hover:translate-x-1" style={{ borderColor: "rgba(255,85,0,0.4)", color: ORANGE }}>
                <Arrow size={15} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Titre en deux temps (fin en orange) */
export function TwoTone({ title, accent, as = "h1", light = false, className = "" }: { title: string; accent: string; as?: "h1" | "h2"; light?: boolean; className?: string }) {
  const Tag = as;
  return (
    <Tag className={`font-display font-bold tracking-[-0.045em] ${light ? "!text-white" : ""} ${className}`} style={light ? undefined : { color: INK }}>
      {title} <span style={{ color: ORANGE }}>{accent}</span>
    </Tag>
  );
}

export function PrimaryCta({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return (
    <a href={href} className={`group inline-flex min-h-[52px] items-center gap-3 rounded-full py-2 pl-6 pr-2 text-[15px] font-semibold transition-transform duration-300 hover:scale-[1.03] ${light ? "bg-white text-ink" : "text-white"}`} style={light ? undefined : { background: INK }}>
      {children}
      <span className="grid h-9 w-9 place-items-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1" style={{ background: ORANGE }}>
        <Arrow size={16} />
      </span>
    </a>
  );
}
