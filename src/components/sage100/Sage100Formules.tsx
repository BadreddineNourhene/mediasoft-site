"use client";

import { useState } from "react";
import { Arrow, SmartLink } from "@/components/ui";
import { formules, modules, SAGE_GREEN } from "@/lib/sage100";

/* Choisir sa formule : un sélecteur à trois positions et, à droite, la pile des cinq modules Sage 100
   qui s'allument selon la formule (Entreprise les réunit tous). */

export default function Sage100Formules() {
  const [k, setK] = useState("entreprise");
  const f = formules.find((x) => x.key === k)!;

  return (
    <section id="formules" className="scroll-mt-24 bg-white py-[clamp(80px,10vw,140px)]" aria-labelledby="s100-f-title">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Formules</p>
            <h2 id="s100-f-title" className="mt-4 font-display text-[clamp(32px,3.8vw,56px)] font-bold leading-[1.04] tracking-[-0.04em]">
              Commencez par ce dont vous avez besoin.
            </h2>
          </div>
          <div role="tablist" aria-label="Formules Sage 100" className="inline-flex w-fit flex-wrap gap-1 rounded-full border border-line bg-mist p-1.5">
            {formules.map((x) => {
              const on = x.key === k;
              return (
                <button
                  key={x.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setK(x.key)}
                  className={`relative rounded-full px-5 py-2.5 text-[14.5px] font-semibold transition-all duration-300 ${on ? "bg-[#03100a] text-white shadow-lg" : "text-ink-soft hover:text-ink"}`}
                >
                  {x.name}
                  {x.popular && (
                    <span className="ml-2 rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide" style={{ background: SAGE_GREEN, color: "#03100a" }}>
                      Populaire
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-14 grid gap-10 overflow-hidden rounded-[36px] border border-line lg:grid-cols-[1.05fr_0.95fr] lg:gap-0">
          <div key={f.key} className="s100-swap p-8 md:p-12 lg:p-14">
            {f.popular && <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#0a8a2a]">La plus populaire</p>}
            <h3 className="mt-2 font-display text-[clamp(30px,3vw,44px)] font-bold tracking-[-0.04em]">Sage 100 {f.name}</h3>
            <p className="mt-3 text-[17px] text-ink-soft">{f.tagline}</p>
            <ul className="mt-8 border-t border-line">
              {f.points.map((p) => (
                <li key={p} className="flex items-start gap-4 border-b border-line py-3.5 text-[15.5px] text-ink">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: SAGE_GREEN }} aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <SmartLink href={f.href} className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#03100a] py-2 pl-6 pr-2 text-[15px] font-semibold text-white transition-transform duration-300 hover:scale-[1.03]">
              {f.cta}
              <span className="grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1" style={{ background: SAGE_GREEN, color: "#03100a" }}>
                <Arrow size={16} />
              </span>
            </SmartLink>
          </div>

          {/* Pile des modules */}
          <div className="relative flex items-center bg-[#03100a] p-8 md:p-12 lg:p-14">
            <div className="pointer-events-none absolute right-[-20%] top-[-20%] h-[70%] w-[70%] rounded-full opacity-25 blur-[100px]" style={{ background: SAGE_GREEN }} aria-hidden />
            <div className="relative w-full">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">Modules inclus</p>
              <ul className="mt-6 space-y-3">
                {modules.map((m, i) => {
                  const on = f.modules.includes(m);
                  return (
                    <li
                      key={m}
                      className="flex items-center justify-between rounded-2xl border px-5 py-4 transition-all duration-500"
                      style={{
                        transitionDelay: `${on ? i * 70 : 0}ms`,
                        borderColor: on ? "rgba(0,214,57,0.55)" : "rgba(255,255,255,0.08)",
                        background: on ? "rgba(0,214,57,0.12)" : "rgba(255,255,255,0.02)",
                        transform: on ? "translateX(0)" : "translateX(12px)",
                      }}
                    >
                      <span className={`font-display text-[17px] font-semibold tracking-[-0.02em] transition-colors duration-500 ${on ? "text-white" : "text-white/30"}`}>Sage 100 {m}</span>
                      <span className="grid h-7 w-7 place-items-center rounded-full transition-all duration-500" style={{ background: on ? SAGE_GREEN : "rgba(255,255,255,0.06)" }} aria-hidden>
                        <span className={`h-2 w-2 rounded-full ${on ? "bg-[#03100a]" : "bg-white/20"}`} />
                      </span>
                      <span className="sr-only">{on ? "inclus" : "non inclus"}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
