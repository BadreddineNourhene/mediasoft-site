"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Bell, CheckCircle2, Cloud, HardDrive, Monitor, RotateCcw, Search, ShieldCheck, Smartphone, UserPlus } from "lucide-react";
import { acronisFeatures } from "@/lib/m365";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Acronis Cyber Protect Cloud : les six avantages en cartes empilées au défilement (même principe que Bitrix24).
   Textes courts tirés des descriptions d'origine, et une fenêtre d'application illustrative par carte (aucune donnée réelle). */

const tones = ["#1d6fb8", "#f26b2f", "#1d6fb8", "#f26b2f", "#1d6fb8", "#f26b2f"];

const shorts = [
  "Physique, virtuel, cloud ou mobile : une seule solution protège plus de 20 plates-formes.",
  "Un e-mail, un fichier ou un contact retrouvé en quelques secondes, sans arrêter l’activité.",
  "Nouveaux utilisateurs, groupes et sites : ils sont protégés dès leur création.",
  "Un e-mail ou un fichier retrouvé en quelques secondes, dans Outlook, Teams, OneDrive et SharePoint.",
  "Rapports, widgets et alertes : vous savez à tout moment où en sont vos sauvegardes.",
  "Une stratégie appliquée à des centaines d’utilisateurs en une seule fois.",
];

const icon = (name: string, cls = "h-5 w-5") => <img src={`/img/m365/${name}.svg`} alt="" className={cls} loading="lazy" />;

/* Fenêtre d'application : barre de titre, puis contenu */
function Win({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_30px_60px_-30px_rgb(11_26_46/0.45)] ring-1 ring-line">
      <div className="flex items-center gap-2 border-b border-line bg-[#f7f9fc] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[12px] font-semibold text-ink-soft">{title}</span>
      </div>
      <div className="p-4 text-[13px] text-ink">{children}</div>
    </div>
  );
}

const Ok = ({ label = "Protégé" }: { label?: string }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11.5px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
    <ShieldCheck size={12} aria-hidden /> {label}
  </span>
);

const scenes: ReactNode[] = [
  /* 01 : toutes les charges de travail, reliées à une seule console */
  <div key="0" className="relative mx-auto aspect-[4/3] w-full max-w-[380px]">
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden>
      {[
        [80, 60],
        [320, 60],
        [80, 240],
        [320, 240],
      ].map(([x, y]) => (
        <line key={`${x}${y}`} x1="200" y1="150" x2={x} y2={y} stroke="#1d6fb8" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 6" />
      ))}
    </svg>
    <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[26px] bg-brand text-white shadow-[0_20px_40px_-15px_rgb(29_111_184/0.7)]">
      <ShieldCheck size={40} aria-hidden />
    </div>
    {[
      { I: HardDrive, t: "Physique", pos: "left-[4%] top-[8%]" },
      { I: Monitor, t: "Virtuel", pos: "right-[4%] top-[8%]" },
      { I: Cloud, t: "Cloud", pos: "left-[4%] bottom-[8%]" },
      { I: Smartphone, t: "Mobile", pos: "right-[4%] bottom-[8%]" },
    ].map(({ I, t, pos }) => (
      <div key={t} className={`absolute ${pos} flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 text-[13px] font-semibold text-ink shadow-md ring-1 ring-line`}>
        <I size={17} className="text-brand" aria-hidden /> {t}
      </div>
    ))}
  </div>,

  /* 02 : restauration granulaire d'un élément */
  <Win key="1" title="Restauration · Boîte aux lettres">
    <ul className="grid gap-2">
      {["Réunion de lancement", "Devis client — pièce jointe", "Planning de la semaine"].map((t, i) => (
        <li key={t} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${i === 1 ? "bg-accent-soft ring-1 ring-accent/30" : "bg-mist"}`}>
          {icon("outlook", "h-4 w-4")}
          <span className="flex-1 truncate">{t}</span>
          {i === 1 && <RotateCcw size={15} className="text-accent" aria-hidden />}
        </li>
      ))}
    </ul>
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-mist-2">
      <div className="h-full w-full rounded-full bg-emerald-500" />
    </div>
    <p className="mt-2 flex items-center gap-1.5 font-semibold text-emerald-700">
      <CheckCircle2 size={16} aria-hidden /> Élément restauré en quelques secondes
    </p>
  </Win>,

  /* 03 : protection automatique des nouveaux éléments */
  <Win key="2" title="Microsoft 365 · Protection">
    <div className="mb-3 flex items-center justify-between rounded-xl bg-brand-soft px-3 py-2">
      <span className="font-semibold text-brand">Protection automatique</span>
      <span className="relative h-5 w-9 rounded-full bg-brand">
        <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white" />
      </span>
    </div>
    <ul className="grid gap-2">
      {[
        { i: "outlook", t: "Nouvel utilisateur" },
        { i: "mssteam", t: "Nouveau groupe Teams" },
        { i: "sharepoint", t: "Nouveau site SharePoint" },
      ].map(({ i, t }) => (
        <li key={t} className="flex items-center gap-3 rounded-xl bg-mist px-3 py-2">
          {icon(i, "h-4 w-4")}
          <span className="flex-1">{t}</span>
          <Ok />
        </li>
      ))}
    </ul>
  </Win>,

  /* 04 : recherche dans les sauvegardes */
  <Win key="3" title="Recherche dans les sauvegardes">
    <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 ring-2 ring-brand/40">
      <Search size={16} className="text-brand" aria-hidden />
      <span className="flex-1">facture mars</span>
      <span className="rounded-md bg-brand px-2 py-0.5 text-[11px] font-semibold text-white">Rechercher</span>
    </div>
    <ul className="mt-3 grid gap-2">
      {[
        { i: "outlook", t: "Facture mars.pdf", s: "Outlook" },
        { i: "onedrive", t: "Factures 2026.xlsx", s: "OneDrive" },
        { i: "mssteam", t: "Facture mars — fil Finance", s: "Teams" },
        { i: "sharepoint", t: "Factures / mars", s: "SharePoint" },
      ].map(({ i, t, s }) => (
        <li key={t} className="flex items-center gap-3 rounded-xl bg-mist px-3 py-2">
          {icon(i, "h-4 w-4")}
          <span className="flex-1 truncate">{t}</span>
          <span className="text-[11.5px] text-ink-soft">{s}</span>
        </li>
      ))}
    </ul>
  </Win>,

  /* 05 : surveillance de l'état */
  <Win key="4" title="Tableau de bord · Sauvegardes">
    <div className="grid grid-cols-[auto_1fr] items-center gap-4">
      <svg viewBox="0 0 42 42" className="h-20 w-20 -rotate-90" aria-hidden>
        <circle cx="21" cy="21" r="15.9" fill="none" stroke="#e3eaf3" strokeWidth="6" />
        <circle cx="21" cy="21" r="15.9" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray="96 4" />
      </svg>
      <div>
        <p className="text-[11.5px] text-ink-soft">Sauvegardes réussies</p>
        <div className="mt-2 flex h-10 items-end gap-1">
          {[60, 80, 70, 95, 85, 100, 90].map((h, i) => (
            <span key={i} className="flex-1 rounded-sm bg-emerald-500/80" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
    <div className="mt-3 flex items-center gap-3 rounded-xl bg-accent-soft px-3 py-2 ring-1 ring-accent/30">
      <Bell size={16} className="text-accent" aria-hidden />
      <span className="flex-1">Alerte : événement critique</span>
      <span className="text-[11px] font-semibold text-accent-deep">À l’instant</span>
    </div>
  </Win>,

  /* 06 : gestion de groupe */
  <Win key="5" title="Stratégie de groupe">
    <div className="flex items-center justify-between rounded-xl bg-brand-soft px-3 py-2">
      <span className="font-semibold text-brand">Sauvegarde quotidienne</span>
      <span className="rounded-md bg-brand px-2 py-0.5 text-[11px] font-semibold text-white">Appliquer au groupe</span>
    </div>
    <div className="mt-3 grid grid-cols-6 gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className="relative grid aspect-square place-items-center rounded-full bg-mist text-ink-soft ring-1 ring-line">
          <UserPlus size={14} aria-hidden />
          <span className="absolute -bottom-0.5 -right-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
            <svg viewBox="0 0 10 10" className="h-2 w-2" aria-hidden>
              <path d="M2 5.2 4.2 7.4 8 3" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </span>
        </span>
      ))}
    </div>
    <p className="mt-3 text-[12px] text-ink-soft">Appliquée à tout le groupe en une fois</p>
  </Win>,
];

export default function AcronisStack() {
  const root = useRef<HTMLDivElement>(null);
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
    <div ref={root}>
      <ol className="mt-12 space-y-6 lg:space-y-[12vh]">
        {acronisFeatures.map((f, i) => (
          <li key={f.title} data-acard className="lg:sticky" style={{ top: `${98 + i * 20}px` }}>
            <div
              data-ainner
              className="origin-top overflow-hidden rounded-[30px] bg-[#f6f9fc] p-7 shadow-[0_-20px_60px_-34px_rgb(11_26_46/0.55)] ring-1 ring-line md:p-10"
            >
              <div className="grid items-center gap-8 lg:grid-cols-[1fr_420px] lg:gap-12">
                <div>
                  <span className="font-display text-[clamp(38px,3.6vw,54px)] font-bold leading-none tracking-[-0.05em]" style={{ color: tones[i] }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-[clamp(26px,2.8vw,40px)] font-bold leading-[1.04] tracking-[-0.04em] text-ink">{f.title}.</h3>
                  <p className="mt-4 max-w-xl text-[clamp(16px,1.2vw,18px)] leading-relaxed text-ink-2">{shorts[i]}</p>
                </div>
                <div
                  className="rounded-[24px] p-5 md:p-7"
                  style={{ background: `radial-gradient(120% 120% at 100% 0%, ${tones[i]}26, transparent 60%), #eef3f9` }}
                  aria-hidden
                >
                  {scenes[i]}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
