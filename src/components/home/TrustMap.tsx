import { tunisia } from "@/lib/tunisia";

/* Confiance : la carte de la Tunisie (Natural Earth) avec les deux agences, les repères vérifiés. */

export default function TrustMap() {
  const [tx, ty] = tunisia.tunis;
  const [sx, sy] = tunisia.sousse;
  return (
    <section className="relative isolate overflow-hidden bg-white text-ink" aria-labelledby="trust-title">
      <div className="pointer-events-none absolute left-[-10%] top-[-20%] -z-10 h-[80%] w-[60%] rounded-full bg-[radial-gradient(circle,rgba(70,157,214,0.16),transparent_65%)]" aria-hidden />
      <div className="container-x grid items-center gap-12 py-[clamp(80px,10vw,150px)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        {/* Carte */}
        <div className="relative mx-auto w-full max-w-[380px] lg:order-2">
          <svg viewBox={tunisia.viewBox} className="h-auto w-full" role="img" aria-label="Carte de la Tunisie : agences Mediasoft à Tunis (Ariana) et à Sousse">
            <defs>
              <linearGradient id="tn-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1d6fb8" stopOpacity="0.18" />
                <stop offset="1" stopColor="#1d6fb8" stopOpacity="0.04" />
              </linearGradient>
              <pattern id="tn-dots" width="7" height="7" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.1" fill="#1d6fb8" fillOpacity="0.35" />
              </pattern>
            </defs>
            <path d={tunisia.d} fill="url(#tn-fill)" />
            <path d={tunisia.d} fill="url(#tn-dots)" />
            <path d={tunisia.d} fill="none" stroke="#1d6fb8" strokeOpacity="0.7" strokeWidth="1.2" />
            <path d={`M${tx} ${ty} Q ${tx + 40} ${(ty + sy) / 2} ${sx} ${sy}`} fill="none" stroke="#f26b2f" strokeWidth="2" strokeDasharray="3 5" className="flow-dash" />
            {[
              [tx, ty, "#469dd6"],
              [sx, sy, "#f26b2f"],
            ].map(([x, y, c], i) => (
              <g key={i}>
                <circle cx={x as number} cy={y as number} r="16" fill={c as string} opacity="0.25" className="map-pulse" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 0.8}s` }} />
                <circle cx={x as number} cy={y as number} r="6" fill={c as string} stroke="#ffffff" strokeWidth="2" />
              </g>
            ))}
          </svg>
          <div className="absolute whitespace-nowrap rounded-2xl bg-white px-3.5 py-2.5 shadow-[0_12px_30px_-12px_rgb(11_26_46/0.35)] ring-1 ring-line" style={{ left: `${(tx / 300) * 100 - 62}%`, top: `${(ty / 520) * 100 - 5}%` }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-brand">Siège</p>
            <p className="text-[15px] font-semibold">Tunis · Ennasr</p>
          </div>
          <div className="absolute whitespace-nowrap rounded-2xl bg-white px-3.5 py-2.5 shadow-[0_12px_30px_-12px_rgb(11_26_46/0.35)] ring-1 ring-line" style={{ left: `${(sx / 300) * 100 - 52}%`, top: `${(sy / 520) * 100 + 3}%` }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">Agence</p>
            <p className="text-[15px] font-semibold">Sousse · Sahloul</p>
          </div>
        </div>

        {/* Repères */}
        <div className="lg:order-1">
          <p className="eyebrow">Notre ancrage</p>
          <h2 id="trust-title" className="mt-4 font-display text-[clamp(30px,3.4vw,50px)] font-bold leading-[1.05] tracking-[-0.035em]">
            Aux côtés des entreprises tunisiennes.
          </h2>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-soft">
            Une équipe à Tunis, une autre à Sousse : assez proches pour passer vous voir, équipées pour intervenir à distance quand
            il le faut.
          </p>

          <div className="mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]" aria-label="Secteurs accompagnés : industrie, négoce, télécom, banque, services">
            <div className="flex w-max animate-[marquee-x_28s_linear_infinite] gap-3" aria-hidden>
              {[0, 1].flatMap((k) =>
                ["Industrie", "Négoce", "Télécom", "Banque", "Services", "De la TPE au groupe"].map((t) => (
                  <span key={`${k}-${t}`} className="whitespace-nowrap rounded-full border border-line-strong px-4 py-2 text-[14px] font-medium text-ink-2">
                    {t}
                  </span>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
