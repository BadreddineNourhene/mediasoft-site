import { Check, Mail, FileText, Server, Inbox } from "lucide-react";
import { DIV_INK as INK, DIV_ORANGE as ORANGE } from "@/lib/divaltoHome";

/* Illustrations animées des modules sans capture réelle (signalées « Illustration »).
   Les libellés reprennent les fonctions décrites sur les pages d'origine. */

function Frame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <figure className="relative overflow-hidden rounded-[26px] p-6 shadow-[0_40px_80px_-30px_rgba(13,20,36,0.55)] md:p-8" style={{ background: INK }}>
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-30 blur-3xl" style={{ background: ORANGE }} aria-hidden />
      <p className="relative text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">{title}</p>
      <div className="relative mt-5">{children}</div>
      <figcaption className="relative mt-5 text-[11px] text-white/35">Illustration</figcaption>
    </figure>
  );
}

export function GpaoIllus() {
  const steps = ["Données techniques", "Ordres de fabrication", "Planification", "Suivi en temps réel"];
  return (
    <Frame title="GPAO · cycle de production">
      <div className="relative">
        <div className="absolute left-0 right-0 top-[26px] h-[3px] rounded-full bg-white/10" aria-hidden />
        <div className="div-belt absolute left-0 top-[19px] h-4 w-4 rounded-[5px]" style={{ background: ORANGE }} aria-hidden />
        <ol className="relative grid grid-cols-4 gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-col items-center text-center">
              <span className="div-pulse grid h-[54px] w-[54px] place-items-center rounded-2xl border border-white/10 bg-white/[0.06] font-display text-[15px] font-bold text-white" style={{ animationDelay: `${i * 0.9}s` }}>
                0{i + 1}
              </span>
              <span className="mt-3 text-[11.5px] font-semibold leading-tight text-white/75">{s}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-7 grid grid-cols-3 gap-2 text-center">
        {["À l’affaire", "En série", "Traçabilité lot"].map((t) => (
          <span key={t} className="rounded-xl bg-white/[0.06] px-2 py-2.5 text-[12px] font-semibold text-white/80">
            {t}
          </span>
        ))}
      </div>
    </Frame>
  );
}

export function AffaireIllus() {
  const rows = [
    { t: "Commercial", s: 0, w: 22 },
    { t: "Bureau d’études", s: 14, w: 26 },
    { t: "Achats", s: 30, w: 20 },
    { t: "Production", s: 42, w: 30 },
    { t: "Installation", s: 68, w: 16 },
    { t: "SAV", s: 80, w: 20 },
  ];
  return (
    <Frame title="Gestion à l’affaire · plan de charge">
      <ul className="space-y-2.5">
        {rows.map((r, i) => (
          <li key={r.t} className="grid grid-cols-[96px_1fr] items-center gap-3">
            <span className="truncate text-[12px] font-semibold text-white/70">{r.t}</span>
            <span className="relative h-5 rounded-full bg-white/[0.06]">
              <span className="div-grow absolute top-0 h-5 rounded-full" style={{ left: `${r.s}%`, width: `${r.w}%`, background: i % 2 ? "#ff7a33" : ORANGE, animationDelay: `${i * 0.25}s` }} />
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11.5px] font-semibold">
        {[
          ["Alloué", "bg-white/[0.06] text-white/80"],
          ["Engagé", "bg-white/[0.1] text-white"],
          ["Réalisé", "text-[#0d1424]"],
        ].map(([t, c], i) => (
          <span key={t} className={`rounded-xl px-2 py-2.5 ${c}`} style={i === 2 ? { background: ORANGE } : undefined}>
            Budget {t.toLowerCase()}
          </span>
        ))}
      </div>
    </Frame>
  );
}

export function DematIllus() {
  const inputs = [
    { icon: Inbox, t: "Courriers" },
    { icon: Mail, t: "E-mails" },
    { icon: Server, t: "EDI" },
    { icon: FileText, t: "FTP" },
  ];
  return (
    <Frame title="Dématérialisation · factures fournisseurs">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <ul className="space-y-2">
          {inputs.map(({ icon: Icon, t }, i) => (
            <li key={t} className="div-doc flex items-center gap-2 rounded-xl bg-white/[0.06] px-3 py-2 text-[12px] font-semibold text-white/80" style={{ animationDelay: `${i * 0.6}s` }}>
              <Icon size={14} style={{ color: ORANGE }} aria-hidden />
              {t}
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-center gap-1 text-white/40" aria-hidden>
          <span className="div-flowx h-[2px] w-10 rounded-full" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center">
          <span className="font-display text-[14px] font-bold text-white">ERP</span>
          <ul className="mt-3 space-y-2 text-left text-[11.5px] text-white/75">
            {["Données extraites", "Rapprochée de la commande", "Comptabilisée"].map((t, i) => (
              <li key={t} className="div-tick-in flex items-center gap-2" style={{ animationDelay: `${1 + i * 0.7}s` }}>
                <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full" style={{ background: ORANGE }}>
                  <Check size={10} className="text-white" aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}
