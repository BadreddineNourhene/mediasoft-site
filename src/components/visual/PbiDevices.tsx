"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { RefreshCw, Users } from "lucide-react";

gsap.registerPlugin(useGSAP);

/* Illustration Power BI pour la page Microsoft 365 : le même rapport sur un ordinateur portable et sur un
   téléphone (« partagés, de la direction jusqu'aux équipes »), avec des notifications qui s'allument.
   Rapport dessiné, données d'exemple signalées comme telles. */

const Y = "#f5ce0d";
const NIGHT = "#0f0d05";
const curve = [62, 58, 64, 52, 55, 44, 47, 36, 40, 28, 30, 18];
const curve2 = [70, 68, 70, 64, 66, 60, 61, 56, 57, 50, 52, 46];
const toPath = (pts: number[]) => pts.map((p, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * 100},${p}`).join(" ");
const rows = [
  { label: "Grand Tunis", v: "412 k", w: 92 },
  { label: "Sahel", v: "298 k", w: 68 },
  { label: "Sfax", v: "205 k", w: 47 },
  { label: "Sud", v: "121 k", w: 28 },
];
const kpis = [
  { k: "CA", v: "1,28 M" },
  { k: "Marge", v: "34,6 %" },
  { k: "Clients", v: "386" },
  { k: "Panier", v: "694 DT" },
];
const notes = [
  { icon: RefreshCw, k: "Power BI", t: "Rapport actualisé", pos: "right-[-2%] top-[-6%]" },
  { icon: Users, k: "Partage", t: "Envoyé à l’équipe commerciale", pos: "left-[-6%] top-[48%]" },
];

function Report() {
  return (
    <div className="flex h-full flex-col text-[8px] text-white md:text-[9px]" style={{ background: "#16140b" }}>
      {/* Barre du rapport */}
      <div className="flex items-center justify-between border-b border-white/10 px-[3%] py-[1.6%]">
        <div className="flex items-center gap-1.5">
          <img src="/img/logos/logo-power-bi-icon.svg" alt="" className="h-3 w-3" />
          <span className="font-semibold">Ventes · Direction</span>
        </div>
        <div className="flex gap-1">
          {["Synthèse", "Clients", "Produits"].map((t, i) => (
            <span key={t} className="rounded px-1.5 py-0.5" style={i ? { color: "rgba(255,255,255,0.5)" } : { background: Y, color: NIGHT, fontWeight: 600 }}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[1.5fr_1fr] gap-[2%] p-[2.5%]">
        {/* Courbe du chiffre d'affaires */}
        <div className="flex min-h-0 flex-col rounded-md bg-white/[0.05] p-[4%]">
          <div className="flex justify-between">
            <span className="font-semibold">Chiffre d’affaires</span>
            <span className="text-emerald-400">▲ 12 %</span>
          </div>
          <svg viewBox="0 0 100 80" preserveAspectRatio="none" className="mt-1 min-h-0 w-full flex-1">
            <defs>
              <linearGradient id="pbi-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={Y} stopOpacity="0.45" />
                <stop offset="100%" stopColor={Y} stopOpacity="0" />
              </linearGradient>
            </defs>
            {[20, 40, 60].map((y) => (
              <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
            ))}
            <path data-area d={`${toPath(curve)} L100,80 L0,80 Z`} fill="url(#pbi-area)" />
            <path d={toPath(curve2)} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            <path data-line d={toPath(curve)} fill="none" stroke={Y} strokeWidth="2.5" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1" />
          </svg>
        </div>
        {/* Classement par région */}
        <div className="flex min-h-0 flex-col justify-between rounded-md bg-white/[0.05] p-[5%]">
          <span className="font-semibold">Par région</span>
          {rows.map((r) => (
            <div key={r.label}>
              <div className="flex justify-between text-white/60">
                <span>{r.label}</span>
                <span className="font-semibold text-white">{r.v}</span>
              </div>
              <div className="mt-0.5 h-1 rounded-full bg-white/10">
                <div data-bar className="h-full origin-left rounded-full" style={{ width: `${r.w}%`, background: Y }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Indicateurs */}
      <div className="grid grid-cols-4 gap-[2%] px-[2.5%] pb-[2.5%]">
        {kpis.map((k) => (
          <div key={k.k} className="rounded-md bg-white/[0.05] px-[8%] py-[6%]">
            <p className="text-white/50">{k.k}</p>
            <p className="text-[10px] font-bold md:text-[12px]">{k.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneReport() {
  return (
    <div className="flex h-full flex-col gap-2 p-2.5 text-[8px] text-white" style={{ background: "#16140b" }}>
      <div className="flex items-center gap-1.5">
        <img src="/img/logos/logo-power-bi-icon.svg" alt="" className="h-3 w-3" />
        <span className="font-semibold">Ventes</span>
      </div>
      {kpis.slice(0, 2).map((k) => (
        <div key={k.k} className="rounded-lg bg-white/[0.06] p-2">
          <p className="text-white/50">{k.k}</p>
          <p className="text-[13px] font-bold">{k.v}</p>
        </div>
      ))}
      <div className="flex flex-1 items-end gap-[3px] rounded-lg bg-white/[0.06] p-2">
        {[35, 48, 42, 60, 55, 72, 68, 86, 100].map((h, i, a) => (
          <span
            key={i}
            data-pbar
            className="flex-1 origin-bottom rounded-t-[2px]"
            style={{ height: `${h}%`, background: i === a.length - 1 ? Y : "rgba(245,206,13,0.45)" }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-white/[0.06] p-2">
        <svg viewBox="0 0 42 42" className="h-9 w-9 -rotate-90">
          <circle cx="21" cy="21" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
          <circle cx="21" cy="21" r="15.9" fill="none" stroke={Y} strokeWidth="6" strokeDasharray="62 38" />
        </svg>
        <div>
          <p className="text-white/50">Objectif</p>
          <p className="text-[11px] font-bold">62 %</p>
        </div>
      </div>
    </div>
  );
}

export default function PbiDevices({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from("[data-laptop]", { y: 40, opacity: 0, duration: 1 })
          .from("[data-phone]", { y: 60, x: 20, opacity: 0, duration: 1 }, "-=0.6")
          .fromTo("[data-line]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, "-=0.6")
          .from("[data-area]", { opacity: 0, duration: 1 }, "<0.4")
          .from("[data-bar]", { scaleX: 0, duration: 0.9, stagger: 0.08 }, "<")
          .from("[data-pbar]", { scaleY: 0, duration: 0.7, stagger: 0.05 }, "<");
        // Notifications : une à la fois, en boucle
        const n = gsap.utils.toArray<HTMLElement>("[data-note]");
        gsap.set(n, { opacity: 0, y: 12, scale: 0.96 });
        const loop = gsap.timeline({ repeat: -1, delay: 2 });
        n.forEach((el) => {
          loop.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" }).to(el, { opacity: 0, y: -10, duration: 0.4 }, "+=2.2");
        });
        // Légère flottaison du téléphone
        gsap.to("[data-phone]", { y: -10, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.5 });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-line]", { strokeDashoffset: 0 });
        gsap.set("[data-note]", { opacity: (i) => (i ? 0 : 1) });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className={`relative mx-auto w-full max-w-[700px] pb-[7%] pr-[6%] ${className}`} aria-hidden>
      {/* Ordinateur portable */}
      <div data-laptop>
        <div className="relative mx-auto w-[88%] rounded-t-[14px] rounded-b-[4px] bg-[#1b1a14] p-[1.6%] pb-[2.2%] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
          <span className="absolute left-1/2 top-[0.6%] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-white/25" />
          <div className="aspect-[16/10] overflow-hidden rounded-[4px]">
            <Report />
          </div>
        </div>
        <div className="relative mx-auto h-[10px] w-full rounded-b-[14px] rounded-t-[3px] bg-gradient-to-b from-[#d9dde4] to-[#9aa1ad] shadow-[0_18px_30px_-12px_rgba(0,0,0,0.6)] md:h-[14px]">
          <span className="absolute left-1/2 top-0 h-[40%] w-[14%] -translate-x-1/2 rounded-b-[6px] bg-[#7d8592]" />
        </div>
      </div>

      {/* Téléphone, posé devant à droite */}
      <div data-phone className="absolute bottom-0 right-0 w-[24%] min-w-[110px]">
        <div className="rounded-[22px] bg-[#1b1a14] p-[5%] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/15">
          <div className="mx-auto mb-[4%] h-[5px] w-[30%] rounded-full bg-white/15" />
          <div className="aspect-[9/17] overflow-hidden rounded-[16px]">
            <PhoneReport />
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notes.map(({ icon: Icon, k, t, pos }) => (
        <div
          key={t}
          data-note
          className={`absolute ${pos} flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 text-[#0f0d05] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)]`}
        >
          <span className="grid h-8 w-8 place-items-center rounded-xl" style={{ background: Y }}>
            <Icon size={16} aria-hidden />
          </span>
          <span>
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-black/50">{k}</span>
            <span className="block text-[13.5px] font-semibold">{t}</span>
          </span>
        </div>
      ))}

      <span className="absolute bottom-0 left-[6%] rounded-full bg-white/10 px-2.5 py-1 text-[10.5px] font-semibold text-white/70">Données d’exemple</span>
    </div>
  );
}
