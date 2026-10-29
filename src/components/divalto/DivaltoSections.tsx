"use client";

import { useState } from "react";
import { BarChart3, Cloud, Smartphone, Globe } from "lucide-react";
import { Arrow } from "@/components/ui";
import AppWindow from "@/components/visual/AppWindow";
import { dcaps, dmodules, sectors, DIV_INK, DIV_ORANGE } from "@/lib/divaltoHome";

/* Modules : liste à gauche, panneau à droite (vraie capture quand elle existe, sinon le nom du module en grand).
   Secteurs : trois rangées de noms qui défilent en sens opposés, chacun mène à sa solution métier.
   Terrain : la gestion d'interventions, du bureau au mobile. */

export function DivaltoModules() {
  const [k, setK] = useState(dmodules[0].key);
  const m = dmodules.find((x) => x.key === k)!;
  const cap = m.cap ? dcaps[m.cap] : null;

  return (
    <section className="bg-white py-[clamp(80px,10vw,140px)]" aria-labelledby="div-mod-title">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="eyebrow">Logiciel ERP</p>
            <h2 id="div-mod-title" className="mt-4 font-display text-[clamp(32px,3.8vw,56px)] font-bold leading-[1.04] tracking-[-0.04em]" style={{ color: DIV_INK }}>
              Une plateforme. <span style={{ color: DIV_ORANGE }}>Six métiers de l’entreprise.</span>
            </h2>
          </div>
          <p className="max-w-md text-[16.5px] leading-relaxed text-ink-soft lg:justify-self-end">
            Divalto infinity réunit les grandes fonctions de l’entreprise dans un seul ERP. Choisissez un module pour le découvrir.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <ul role="tablist" aria-label="Modules Divalto infinity" className="border-t border-line">
            {dmodules.map((x, i) => {
              const on = x.key === k;
              return (
                <li key={x.key} className="border-b border-line">
                  <button
                    role="tab"
                    aria-selected={on}
                    onClick={() => setK(x.key)}
                    onMouseEnter={() => setK(x.key)}
                    className="group flex w-full items-center gap-5 py-5 text-left"
                  >
                    <span className="font-display text-[13px] font-bold tabular-nums transition-colors" style={{ color: on ? DIV_ORANGE : "rgba(82,98,122,0.5)" }}>
                      0{i + 1}
                    </span>
                    <span className={`flex-1 font-display text-[clamp(20px,1.9vw,27px)] font-bold tracking-[-0.03em] transition-all duration-300 ${on ? "translate-x-1 text-ink" : "text-ink/40 group-hover:text-ink/70"}`}>{x.name}</span>
                    <span className={`h-[2px] rounded-full transition-all duration-500 ${on ? "w-10" : "w-0"}`} style={{ background: DIV_ORANGE }} aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="relative overflow-hidden rounded-[32px] bg-[#fff7f0] p-6 md:p-10">
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-25 blur-3xl" style={{ background: DIV_ORANGE }} aria-hidden />
            <div key={m.key} className="s100-swap relative">
              {cap ? (
                <>
                  <AppWindow src={cap.src} alt={cap.alt} title="Divalto infinity" />
                  <p className="mt-3 text-right text-[11.5px] text-ink-soft">Capture réelle de Divalto infinity</p>
                </>
              ) : (
                <div className="flex aspect-[16/10] flex-col justify-end rounded-[22px] p-8 md:p-10" style={{ background: DIV_INK }}>
                  <span className="font-display text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: DIV_ORANGE }}>
                    Divalto infinity
                  </span>
                  <span className="mt-3 font-display text-[clamp(34px,4.4vw,64px)] font-bold leading-[0.95] tracking-[-0.045em] text-white">{m.name}</span>
                </div>
              )}
              <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-sm text-[16px] leading-relaxed text-ink-2">{m.line}</p>
                <a href={m.href} className="group inline-flex shrink-0 items-center gap-2 font-semibold" style={{ color: DIV_INK }}>
                  Découvrir {m.name}
                  <span className="grid h-8 w-8 place-items-center rounded-full text-white transition-transform group-hover:translate-x-1" style={{ background: DIV_ORANGE }}>
                    <Arrow size={15} />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ items, reverse, speed }: { items: typeof sectors; reverse?: boolean; speed: number }) {
  const set = (hidden: boolean) =>
    items.map((s) => (
      <li key={s.name + hidden} className="shrink-0" aria-hidden={hidden || undefined}>
        <a href={s.href} tabIndex={hidden ? -1 : undefined} className="group flex items-center gap-6 px-6 font-display text-[clamp(30px,4.4vw,64px)] font-bold tracking-[-0.045em] text-white/25 transition-colors duration-300 hover:text-white">
          {s.name}
          <span className="h-3 w-3 rounded-full transition-transform duration-300 group-hover:scale-150" style={{ background: DIV_ORANGE }} />
        </a>
      </li>
    ));
  return (
    <div className="div-marquee group/row overflow-hidden">
      <ul className={`div-track flex w-max ${reverse ? "div-rev" : ""}`} style={{ animationDuration: `${speed}s` }}>
        {set(false)}
        {set(true)}
      </ul>
    </div>
  );
}

export function DivaltoSectors() {
  const a = sectors.slice(0, 5);
  const b = sectors.slice(5, 9);
  const c = sectors.slice(9);
  return (
    <section id="metiers" className="relative scroll-mt-20 overflow-hidden py-[clamp(80px,10vw,140px)] text-white" style={{ background: DIV_INK }} aria-labelledby="div-sec-title">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[50vh] w-[70vw] -translate-x-1/2 rounded-full opacity-[0.18] blur-[130px]" style={{ background: DIV_ORANGE }} aria-hidden />
      <div className="container-x relative grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
        <div>
          <p className="eyebrow eyebrow-light">Solutions métiers</p>
          <h2 id="div-sec-title" className="mt-4 font-display text-[clamp(32px,3.8vw,56px)] font-bold leading-[1.04] tracking-[-0.04em] !text-white">
            Votre secteur est <span style={{ color: DIV_ORANGE }}>déjà prévu.</span>
          </h2>
        </div>
        <p className="max-w-md text-[16.5px] leading-relaxed text-white/65 lg:justify-self-end">
          Des progiciels packagés pour les besoins spécifiques d’un métier : un déploiement rapide et simple. Survolez votre secteur, cliquez pour découvrir sa solution.
        </p>
      </div>
      <div className="relative mt-16 space-y-4 md:space-y-6">
        <Row items={a} speed={46} />
        <Row items={b} speed={40} reverse />
        <Row items={c} speed={44} />
      </div>
    </section>
  );
}

export function DivaltoField() {
  const chips = [
    { icon: Smartphone, t: "Mobilité" },
    { icon: Cloud, t: "Cloud" },
    { icon: BarChart3, t: "BI" },
    { icon: Globe, t: "Interfaces web" },
  ];
  return (
    <section className="bg-[#fff7f0] py-[clamp(80px,10vw,140px)]" aria-labelledby="div-field-title">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative order-2 lg:order-1">
          <div className="absolute inset-[5%] rotate-[-2deg] rounded-[40px]" style={{ background: DIV_ORANGE, opacity: 0.14 }} aria-hidden />
          <div className="relative px-[3%] py-[6%]">
            <AppWindow src={dcaps.interventions.src} alt={dcaps.interventions.alt} title="Divalto · interventions" />
            <p className="mt-3 text-[11.5px] text-ink-soft">Capture réelle de Divalto</p>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <p className="eyebrow">ERP, CRM & gestion d’interventions</p>
          <h2 id="div-field-title" className="mt-4 font-display text-[clamp(30px,3.6vw,52px)] font-bold leading-[1.04] tracking-[-0.04em]" style={{ color: DIV_INK }}>
            Du bureau <span style={{ color: DIV_ORANGE }}>au terrain.</span>
          </h2>
          <p className="mt-5 max-w-md text-[16.5px] leading-relaxed text-ink-soft">
            Interventions à planifier, démarrées, réalisées : vos équipes suivent l’activité depuis le bureau, et vos techniciens la retrouvent sur leur mobile.
          </p>
          <ul className="mt-9 grid grid-cols-2 gap-3">
            {chips.map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-center gap-3 rounded-2xl border border-[#ff5500]/20 bg-white px-4 py-3.5 text-[15px] font-semibold text-ink">
                <span className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: DIV_ORANGE }}>
                  <Icon size={17} aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
