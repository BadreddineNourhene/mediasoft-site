/* Illustration Power BI : tableau de bord animé (données d'exemple, signalées comme telles). */
const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const bars = [38, 52, 44, 63, 58, 72, 66, 84, 77, 92, 86, 100];
/* Objectif mensuel, tracé en pointillés au-dessus des colonnes (en % de la hauteur). */
const target = [45, 48, 52, 55, 58, 62, 65, 68, 72, 75, 79, 84];
const kpis = [
  { label: "Chiffre d’affaires", value: "1,28 M DT", trend: "+12 %", color: "#f5ce0d", spark: [30, 42, 38, 55, 52, 68, 80] },
  { label: "Marge brute", value: "34,6 %", trend: "+2,1 pts", color: "#469dd6", spark: [50, 46, 52, 58, 55, 62, 66] },
  { label: "Commandes", value: "1 846", trend: "+8 %", color: "#f26b2f", spark: [40, 48, 44, 50, 62, 58, 72] },
];
const segments = [
  { label: "Gros", share: 46, color: "#f5ce0d" },
  { label: "Détail", share: 31, color: "#469dd6" },
  { label: "Export", share: 23, color: "#f26b2f" },
];
const regions = [
  { label: "Grand Tunis", share: 92 },
  { label: "Sahel", share: 68 },
  { label: "Sfax", share: 47 },
];

function Spark({ points, color }: { points: number[]; color: string }) {
  const d = points.map((p, i) => `${(i / (points.length - 1)) * 100},${100 - p}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-6 w-full" aria-hidden>
      <polyline points={`0,100 ${d} 100,100`} fill={color} opacity="0.14" />
      <polyline points={d} fill="none" stroke={color} strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

export default function BiBoard({ className = "", dark = true }: { className?: string; dark?: boolean }) {
  const card = dark ? "bg-white/[0.06] ring-1 ring-white/10" : "bg-white ring-1 ring-line shadow-[0_10px_24px_-18px_rgb(11_26_46/0.35)]";
  const muted = dark ? "text-white/55" : "text-ink-soft";
  const strong = dark ? "text-white" : "text-ink";
  const track = dark ? "bg-white/10" : "bg-line";
  let offset = 0;
  return (
    <figure
      className={`bi-board w-full max-w-[600px] overflow-hidden rounded-[24px] ${dark ? "bg-[#0f0d05] ring-1 ring-white/10" : "bg-mist ring-1 ring-line shadow-[0_40px_80px_-50px_rgb(11_26_46/0.45)]"} ${className}`}
    >
      {/* Barre du rapport : titre, filtres, mention des données d'exemple */}
      <div className={`flex items-center justify-between gap-3 px-4 py-3 md:px-5 ${dark ? "border-b border-white/10" : "border-b border-line bg-white"}`}>
        <div className="flex min-w-0 items-center gap-2">
          <img src="/img/logos/logo-power-bi-icon.svg" alt="" className="h-6 w-6 shrink-0" loading="lazy" />
          <span className={`truncate text-[13px] font-semibold ${strong}`}>Tableau de bord commercial</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className={`hidden rounded-md px-2 py-1 text-[10.5px] font-medium sm:inline ${dark ? "bg-white/10 text-white/70" : "bg-mist text-ink-soft ring-1 ring-line"}`}>Année 2026 ▾</span>
          <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${dark ? "bg-white/10 text-white/70" : "bg-brand-soft text-brand"}`}>Données d’exemple</span>
        </div>
      </div>

      <div className="p-3 md:p-4">
        {/* Indicateurs clés */}
        <div className="grid grid-cols-3 gap-2.5">
          {kpis.map((k) => (
            <div key={k.label} className={`rounded-2xl p-3 ${card}`}>
              <p className={`truncate text-[10.5px] ${muted}`}>{k.label}</p>
              <p className={`mt-1 text-[15px] font-bold tracking-[-0.02em] md:text-[17px] ${strong}`}>{k.value}</p>
              <p className={`text-[10px] font-semibold ${dark ? "text-emerald-400" : "text-emerald-600"}`}>▲ {k.trend}</p>
              <div className="bi-kpi mt-1.5 origin-left">
                <Spark points={k.spark} color={k.color} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2.5 grid grid-cols-[1.6fr_1fr] gap-2.5">
          {/* Chiffre d'affaires par mois, avec la ligne d'objectif */}
          <div className={`rounded-2xl p-3 ${card}`} aria-hidden>
            <div className="flex items-center justify-between">
              <p className={`text-[10.5px] font-semibold ${strong}`}>CA par mois</p>
              <p className={`flex items-center gap-1 text-[9.5px] ${muted}`}>
                <span className="inline-block w-3 border-t-2 border-dashed border-accent" /> Objectif
              </p>
            </div>
            <div className="relative mt-2 h-32 md:h-40">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={`block border-t ${dark ? "border-white/10" : "border-line"}`} />
                ))}
              </div>
              <div className="absolute inset-0 flex items-end gap-1.5">
                {bars.map((h, i) => (
                  <span
                    key={i}
                    className="bi-bar flex-1 origin-bottom rounded-t-[4px]"
                    style={{
                      height: `${h}%`,
                      background: i === bars.length - 1 ? "#f5ce0d" : dark ? "linear-gradient(180deg,rgba(245,206,13,0.7),rgba(245,206,13,0.3))" : "linear-gradient(180deg,#469dd6,#1d6fb8)",
                      animationDelay: `${i * 70}ms`,
                    }}
                  />
                ))}
              </div>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                <polyline
                  points={target.map((t, i) => `${((i + 0.5) / target.length) * 100},${100 - t}`).join(" ")}
                  fill="none"
                  stroke="#f26b2f"
                  strokeWidth="2"
                  strokeDasharray="5 4"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            <div className={`mt-1.5 flex gap-1.5 text-center text-[8.5px] ${muted}`}>
              {months.map((m, i) => (
                <span key={i} className="flex-1">{m}</span>
              ))}
            </div>
          </div>

          {/* Répartition des ventes et classement par région */}
          <div className={`flex flex-col rounded-2xl p-3 ${card}`} aria-hidden>
            <p className={`text-[10.5px] font-semibold ${strong}`}>Ventes par canal</p>
            <div className="mt-2 flex items-center gap-2.5">
              <svg viewBox="0 0 42 42" className="bi-donut h-14 w-14 shrink-0 -rotate-90">
                <circle cx="21" cy="21" r="15.9" fill="none" stroke={dark ? "rgba(255,255,255,0.1)" : "#e3eaf3"} strokeWidth="6" />
                {segments.map((s) => {
                  const c = <circle key={s.label} cx="21" cy="21" r="15.9" fill="none" stroke={s.color} strokeWidth="6" strokeDasharray={`${s.share} ${100 - s.share}`} strokeDashoffset={-offset} />;
                  offset += s.share;
                  return c;
                })}
              </svg>
              <ul className="grid min-w-0 flex-1 gap-1">
                {segments.map((s) => (
                  <li key={s.label} className={`flex items-center gap-1 text-[9px] ${muted}`}>
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
                    <span>{s.label}</span>
                    <span className={`ml-auto whitespace-nowrap font-semibold ${strong}`}>{s.share} %</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className={`mt-3 text-[10.5px] font-semibold ${strong}`}>Par région</p>
            <ul className="mt-1.5 grid gap-1.5">
              {regions.map((r) => (
                <li key={r.label}>
                  <div className={`flex justify-between text-[9.5px] ${muted}`}>
                    <span>{r.label}</span>
                  </div>
                  <div className={`mt-0.5 h-1.5 rounded-full ${track}`}>
                    <div className={`bi-kpi h-full origin-left rounded-full ${dark ? "" : "bg-brand"}`} style={{ width: `${r.share}%`, background: dark ? "#f5ce0d" : undefined }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </figure>
  );
}
