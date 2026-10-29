"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import AppWindow from "@/components/visual/AppWindow";
import Laptop from "@/components/visual/Laptop";
import { caps, questions, SAGE_GREEN, type Question } from "@/lib/sage100";

/* Les questions qu'un dirigeant se pose au quotidien : à gauche les questions (défilement automatique,
   pause au survol), à droite la réponse de Sage 100 avec une vraie capture, ou une illustration signalée comme telle. */

const DURATION = 6500;

function Rapprochement() {
  const rows = [
    ["Virement client", "+ 12 400"],
    ["Prélèvement fournisseur", "− 3 180"],
    ["Remise de chèques", "+ 5 920"],
    ["Frais bancaires", "− 45"],
  ];
  return (
    <div className="relative rounded-[22px] border border-line bg-white p-5 shadow-[0_24px_60px_-30px_rgba(11,26,46,0.35)] md:p-7">
      <div className="grid grid-cols-2 gap-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
        <span>Relevé bancaire</span>
        <span>Comptabilité</span>
      </div>
      <ul className="mt-4 space-y-2.5">
        {rows.map(([l, v], i) => (
          <li key={l} className="s100-match grid grid-cols-2 gap-4" style={{ animationDelay: `${i * 0.45}s` }}>
            {[0, 1].map((side) => (
              <span key={side} className="flex items-center justify-between rounded-xl border border-line bg-mist px-3 py-2.5 text-[13px] text-ink">
                <span className="truncate">{l}</span>
                <span className="ml-2 shrink-0 font-semibold tabular-nums">{v}</span>
              </span>
            ))}
            <span className="s100-tick" aria-hidden />
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[11.5px] text-ink-soft">Illustration · montants fictifs</p>
    </div>
  );
}

function Visual({ v }: { v: Question["visual"] }) {
  if (v === "rapprochement") return <Rapprochement />;
  const c = caps[v];
  if (v === "laptop") return <Laptop src={c.src} alt={c.alt} />;
  return <AppWindow src={c.src} alt={c.alt} title="Sage 100c" />;
}

export default function Sage100Questions() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % questions.length), DURATION);
    return () => window.clearTimeout(id);
  }, [active, paused]);

  const q = questions[active];

  return (
    <section className="bg-white py-[clamp(80px,10vw,140px)]" aria-labelledby="s100-q-title">
      <div className="container-x">
        <div className="max-w-3xl">
          <p className="eyebrow !text-[#066b1f]">Au quotidien</p>
          <h2 id="s100-q-title" className="mt-4 font-display text-[clamp(32px,3.8vw,56px)] font-bold leading-[1.04] tracking-[-0.04em]">
            Les questions du lundi matin, <span className="text-[#066b1f]">et leurs réponses en quelques clics.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <ol className="border-t border-line">
            {questions.map((it, i) => {
              const on = i === active;
              return (
                <li key={it.q} className="relative border-b border-line">
                  <button type="button" onClick={() => setActive(i)} aria-expanded={on} className="group flex w-full items-start gap-5 py-6 text-left">
                    <span className="mt-1.5 font-display text-[13px] font-bold tabular-nums transition-colors" style={{ color: on ? "#066b1f" : "rgba(82,98,122,0.5)" }}>
                      0{i + 1}
                    </span>
                    <span className="flex-1">
                      <span className={`block font-display text-[clamp(19px,1.8vw,25px)] font-semibold leading-snug tracking-[-0.025em] transition-colors ${on ? "text-ink" : "text-ink/45 group-hover:text-ink/75"}`}>
                        {it.q}
                      </span>
                      <span className={`grid transition-[grid-template-rows,opacity] duration-500 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <span className="overflow-hidden">
                          <span className="block pt-3 text-[16px] leading-relaxed text-ink-soft">{it.answer}</span>
                          {/* Les fonctions concernées : une ligne de texte avec un trait vert, plutôt que des pastilles */}
                          <span className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-l-2 border-[#00d639] pl-3 text-[14px] font-semibold text-ink">
                            {it.tags.map((t) => (
                              <span key={t} className="inline-flex items-center gap-1.5">
                                <Check size={15} strokeWidth={3} className="text-[#0a8a2a]" aria-hidden />
                                {t}
                              </span>
                            ))}
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                  {on && (
                    <span className="absolute bottom-[-1px] left-0 h-[2px] w-full overflow-hidden" aria-hidden>
                      <span
                        ref={bar}
                        key={`${active}-${paused}`}
                        className="block h-full origin-left"
                        style={{ background: SAGE_GREEN, animation: paused ? "none" : `s100-progress ${DURATION}ms linear forwards`, transform: paused ? "scaleX(1)" : undefined }}
                      />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#eafcef] via-[#f3f7fc] to-[#e8f2fb] p-6 md:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl" style={{ background: SAGE_GREEN }} aria-hidden />
              <div key={active} className="s100-swap relative">
                <Visual v={q.visual} />
              </div>
              {q.visual !== "rapprochement" && <p className="relative mt-4 text-[11.5px] text-ink-soft">Capture réelle de Sage 100c</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
