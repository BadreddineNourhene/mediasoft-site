"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Truck, Boxes, Cog, Landmark, FileSpreadsheet, Eye, Users, Zap, BarChart3 } from "lucide-react";
import { DIV_INK as INK, DIV_ORANGE as ORANGE } from "@/lib/divaltoHome";

/* « Sans ERP / Avec Divalto » : les cinq services de l'entreprise, d'abord isolés avec leurs fichiers,
   puis reliés autour d'une base de données unique où l'information circule. Bascule auto au premier passage.
   Puis les bénéfices, tirés des pages d'origine (dossier Logiciel ERP, GPAO). */

const services = [
  { icon: ShoppingCart, t: "Ventes", a: { x: 14, y: 18 }, b: { x: 50, y: 8 } },
  { icon: Truck, t: "Achats", a: { x: 80, y: 12 }, b: { x: 90, y: 40 } },
  { icon: Boxes, t: "Stocks", a: { x: 88, y: 62 }, b: { x: 74, y: 88 } },
  { icon: Cog, t: "Production", a: { x: 46, y: 86 }, b: { x: 26, y: 88 } },
  { icon: Landmark, t: "Finance", a: { x: 8, y: 66 }, b: { x: 10, y: 40 } },
];

const benefits = [
  { icon: Eye, t: "Visibilité", d: "Les fonctions de business intelligence donnent une vision claire de l’activité, à jour." },
  { icon: Users, t: "Coordination", d: "L’information est la même pour tous, de la commande client aux saisies des opérateurs." },
  { icon: Zap, t: "Automatisation", d: "Vos flux sont modélisés — qui valide, qui vérifie, qui réalise — avec actions et alertes automatiques." },
  { icon: BarChart3, t: "Décision", d: "Coûts et ressources mieux gérés, indicateurs et tableaux de bord pour décider vite." },
];

export default function DivaltoConnected() {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setOn(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !touched.current) {
          window.setTimeout(() => !touched.current && setOn(true), 1800);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  const pick = (v: boolean) => {
    touched.current = true;
    setOn(v);
  };

  return (
    <section className="relative overflow-hidden bg-white py-[clamp(80px,10vw,140px)]" aria-labelledby="div-con-title">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="eyebrow">L’entreprise connectée</p>
            <h2 id="div-con-title" className="mt-4 font-display text-[clamp(32px,3.8vw,56px)] font-bold leading-[1.04] tracking-[-0.04em]" style={{ color: INK }}>
              Vos services travaillent <span style={{ color: ORANGE }}>sur les mêmes données.</span>
            </h2>
          </div>
          <p className="max-w-md text-[16.5px] leading-relaxed text-ink-soft lg:justify-self-end">
            Un ERP remplace la multitude de logiciels et évite que vos équipes passent leur temps à échanger des fichiers entre services.
          </p>
        </div>

        <div ref={ref} className="mt-12 grid items-center gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <div role="tablist" aria-label="Comparer" className="inline-flex rounded-full border border-line bg-[#fff7f0] p-1.5">
              {[
                [false, "Sans ERP"],
                [true, "Avec Divalto"],
              ].map(([v, l]) => (
                <button key={String(v)} role="tab" aria-selected={on === v} onClick={() => pick(v as boolean)} className={`rounded-full px-5 py-2.5 text-[14.5px] font-semibold transition-all duration-300 ${on === v ? "text-white shadow-lg" : "text-ink-soft hover:text-ink"}`} style={on === v ? { background: v ? ORANGE : INK } : undefined}>
                  {l as string}
                </button>
              ))}
            </div>
            <div key={String(on)} className="s100-swap mt-8">
              <p className="font-display text-[clamp(24px,2.4vw,32px)] font-bold leading-snug tracking-[-0.03em]" style={{ color: INK }}>
                {on ? "Une information saisie une fois sert à tous." : "Chaque service a ses fichiers."}
              </p>
              <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-ink-soft">
                {on
                  ? "Ventes, achats, stocks, production et finance partagent une seule base de données. Une modification est mise à jour en temps réel dans tous les modules."
                  : "Les informations passent d’un service à l’autre à la main : doubles saisies, versions différentes, décisions prises sur des chiffres déjà dépassés."}
              </p>
            </div>
          </div>

          <div className="relative mx-auto aspect-[1.25/1] w-full max-w-[640px] overflow-hidden rounded-[36px] transition-colors duration-700" style={{ background: on ? INK : "#f6f2ee" }}>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              {services.map((s, i) => {
                const p = on ? s.b : s.a;
                const n = services[(i + 1) % services.length];
                const q = on ? n.b : n.a;
                return on ? (
                  <g key={s.t}>
                    <line x1="50" y1="50" x2={p.x} y2={p.y} stroke={ORANGE} strokeOpacity="0.5" strokeWidth="0.5" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 1.5 }} />
                    <line x1="50" y1="50" x2={p.x} y2={p.y} stroke={ORANGE} strokeWidth="2" strokeDasharray="2 14" vectorEffect="non-scaling-stroke" className="div-flow" />
                  </g>
                ) : (
                  <line key={s.t} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#a3968b" strokeWidth="1.8" strokeDasharray="3 7" vectorEffect="non-scaling-stroke" opacity={i % 2 ? 0.9 : 0.55} />
                );
              })}
            </svg>
            <div className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[26px] px-5 py-4 text-center transition-all duration-700 ${on ? "scale-100 opacity-100" : "scale-75 opacity-0"}`} style={{ background: ORANGE }}>
              <span className="font-display text-[13px] font-bold uppercase tracking-[0.1em] text-white/80">divalto infinity</span>
              <span className="mt-1 font-display text-[16px] font-bold leading-tight text-white">Une seule base<br />de données</span>
            </div>
            {services.map(({ icon: Icon, t, a, b }, i) => {
              const p = on ? b : a;
              return (
                <div key={t} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 transition-all duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)]" style={{ left: `${p.x}%`, top: `${p.y}%`, transitionDelay: `${i * 60}ms` }}>
                  <span className="relative grid h-12 w-12 place-items-center rounded-2xl shadow-lg transition-colors duration-700 sm:h-14 sm:w-14" style={{ background: on ? "#fff" : "#fff", color: on ? ORANGE : "#8a7e74" }}>
                    <Icon size={21} aria-hidden />
                    {!on && (
                      <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-lg bg-[#e9e2db] text-[#8a7e74]">
                        <FileSpreadsheet size={13} aria-hidden />
                      </span>
                    )}
                  </span>
                  <span className={`text-[12px] font-semibold transition-colors duration-700 sm:text-[13px] ${on ? "text-white" : "text-[#6f645b]"}`}>{t}</span>
                </div>
              );
            })}
            <span className="absolute bottom-3 right-4 text-[10.5px] font-medium" style={{ color: on ? "rgba(255,255,255,0.35)" : "rgba(13,20,36,0.35)" }}>
              Illustration
            </span>
          </div>
        </div>

        {/* Bénéfices */}
        <div className="mt-20 grid gap-px overflow-hidden rounded-[30px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, t, d }) => (
            <div key={t} className="group bg-white p-7 transition-colors hover:bg-[#fff7f0] md:p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl text-white transition-transform group-hover:-rotate-6" style={{ background: ORANGE }}>
                <Icon size={21} aria-hidden />
              </span>
              <p className="mt-6 font-display text-[22px] font-bold tracking-[-0.03em]" style={{ color: INK }}>
                {t}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
