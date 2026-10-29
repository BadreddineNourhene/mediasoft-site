"use client";

import { useState } from "react";
import { Check, ChevronDown, Minus } from "lucide-react";

export type CompareRow = { title: string; values: (boolean | string)[]; details?: string[] };

function Cell({ v }: { v: boolean | string }) {
  if (typeof v === "string") return <span className="font-semibold text-ink">{v}</span>;
  return v ? (
    <span className="inline-flex items-center gap-2 font-medium text-brand">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-brand text-white">
        <Check size={14} strokeWidth={3} aria-hidden />
      </span>
      <span className="sr-only md:not-sr-only md:text-[14px]">Inclus</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 text-ink-soft">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-mist-2">
        <Minus size={14} aria-hidden />
      </span>
      <span className="sr-only md:not-sr-only md:text-[14px]">Non inclus</span>
    </span>
  );
}

/* Tableau comparatif : lignes dépliables pour le détail, en-têtes collants, défilement horizontal sur mobile. */
export default function CompareTable({
  columns,
  rows,
  caption,
  lastColor,
}: {
  columns: string[];
  rows: CompareRow[];
  caption: string;
  /** Couleur de la pastille et du nom de la dernière colonne (sinon orange). */
  lastColor?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="card relative overflow-hidden">
      <div className="relative overflow-x-auto" data-lenis-prevent>
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-night text-white">
              <th scope="col" className="w-[44%] px-6 py-5 text-[13px] font-semibold uppercase tracking-[0.1em] text-white/70">
                Fonctionnalités
              </th>
              {columns.map((c, i) => (
                <th key={c} scope="col" className="px-4 py-5 text-[14.5px] font-semibold" style={lastColor && i === columns.length - 1 ? { color: lastColor } : undefined}>
                  <span
                    className={`mr-2 inline-block h-2 w-2 rounded-full ${i === columns.length - 1 ? (lastColor ? "" : "bg-accent") : "bg-brand-sky"}`}
                    style={lastColor && i === columns.length - 1 ? { background: lastColor } : undefined}
                    aria-hidden
                  />
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const expanded = open === i;
              return (
                <tr key={r.title} className="border-t border-line align-top transition-colors hover:bg-mist/60">
                  <th scope="row" className="px-6 py-5 font-normal">
                    {r.details?.length ? (
                      <button
                        type="button"
                        onClick={() => setOpen(expanded ? null : i)}
                        aria-expanded={expanded}
                        className="flex w-full items-start justify-between gap-3 text-left text-[15.5px] font-semibold text-ink hover:text-brand"
                      >
                        {r.title}
                        <ChevronDown size={18} className={`mt-0.5 shrink-0 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} aria-hidden />
                      </button>
                    ) : (
                      <span className="text-[15.5px] font-semibold text-ink">{r.title}</span>
                    )}
                    {r.details?.length ? (
                      <ul className={`mt-3 grid gap-2 text-[14px] leading-relaxed text-ink-soft ${expanded ? "" : "hidden"}`}>
                        {r.details.map((d) => (
                          <li key={d} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-sky" aria-hidden />
                            {d}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </th>
                  {r.values.map((v, j) => (
                    <td key={j} className="px-4 py-5">
                      <Cell v={v} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
