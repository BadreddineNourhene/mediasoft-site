"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

/* Questions fréquentes des décideurs : réponses courtes et factuelles (balisage FAQPage pour les moteurs de recherche).
   À gauche, le titre qui reste visible ; à droite, questions numérotées en cartes. */
const faq = [
  {
    q: "Qui est Mediasoft ?",
    a: "Une société tunisienne créée en 2001 par des spécialistes de l’informatique et de la gestion. Nous conseillons, installons et accompagnons les logiciels de gestion des entreprises.",
  },
  {
    q: "Quels logiciels intégrez-vous ?",
    a: "Sage 100c et Sage 50c (Ciel), Divalto Infinity, Bitrix24 et les solutions Microsoft : Microsoft 365 et Power BI.",
  },
  {
    q: "Proposez-vous des solutions web et IA sur mesure ?",
    a: "Oui. Nous concevons des sites web, des applications et des agents d’intelligence artificielle adaptés à votre activité, de l’atelier de cadrage jusqu’au suivi après la mise en service.",
  },
  {
    q: "Que se passe-t-il après la mise en service ?",
    a: "Nous formons vos utilisateurs et restons disponibles : Help desk, assistance à distance et équipes à Tunis et à Sousse.",
  },
  {
    q: "Où êtes-vous situés ?",
    a: "Notre siège est à Ennasr II (Ariana) et notre agence à Sahloul (Sousse).",
  },
];

const num = (n: number) => String(n).padStart(2, "0");

export default function Faq() {
  const [open, setOpen] = useState(0);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section className="bg-white py-[clamp(80px,10vw,140px)]" aria-labelledby="faq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">Questions fréquentes</p>
          <h2 id="faq-title" className="mt-4 font-display text-[clamp(30px,3.4vw,50px)] font-bold leading-[1.05] tracking-[-0.035em]">
            Ce que les dirigeants nous demandent.
          </h2>
          <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-ink-soft">
            Les réponses aux questions qui reviennent le plus souvent avant un projet.
          </p>

        </div>

        <ul className="space-y-3">
          {faq.map((f, i) => {
            const on = open === i;
            return (
              <li
                key={f.q}
                className={`rounded-[22px] border transition-colors duration-300 ${on ? "border-brand/25 bg-mist" : "border-line bg-white hover:border-brand/25"}`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(on ? -1 : i)}
                  aria-expanded={on}
                  className="flex w-full items-center gap-5 px-6 py-5 text-left md:px-7 md:py-6"
                >
                  <span className={`font-display text-[14px] font-bold tabular-nums transition-colors ${on ? "text-brand" : "text-ink-soft/60"}`}>{num(i + 1)}</span>
                  <span className={`flex-1 font-display text-[clamp(17px,1.5vw,21px)] font-semibold tracking-[-0.02em] transition-colors ${on ? "text-brand" : "text-ink"}`}>{f.q}</span>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-300 ${on ? "rotate-45 bg-brand text-white" : "bg-mist text-ink"}`}>
                    <Plus size={18} aria-hidden />
                  </span>
                </button>
                <div className={`grid transition-[grid-template-rows,opacity] duration-500 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <p className="overflow-hidden text-[16px] leading-relaxed text-ink-soft">
                    <span className="block px-6 pb-6 pl-[calc(1.5rem+14px+1.25rem+0.5rem)] pr-14 md:px-7 md:pl-[calc(1.75rem+14px+1.25rem+0.5rem)]">{f.a}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
