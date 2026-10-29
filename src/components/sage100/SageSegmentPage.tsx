"use client";

import { useMemo, useState } from "react";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import { Arrow } from "@/components/ui";
import { links } from "@/lib/site";
import { SAGE_GREEN, sage100Links } from "@/lib/sage100";

/* Pages « Petites entreprises » et « Moyennes et grandes entreprises » : un comparateur « Quelle offre Sage pour vous ? ».
   Le visiteur choisit la taille de son entreprise et ses besoins ; le produit le plus adapté est mis en avant.
   Produits et descriptions repris des pages d'origine de sage.tn ; captures réelles des logiciels. */

type Size = "tpe" | "pme" | "eti";
type Need = "compta" | "ventes" | "stock" | "treso" | "paie" | "conges";

const SIZES: { k: Size; t: string; d: string }[] = [
  { k: "tpe", t: "TPE", d: "Moins de 10 salariés" },
  { k: "pme", t: "PME", d: "10 à 250 salariés" },
  { k: "eti", t: "ETI", d: "Plus de 250 salariés" },
];
const NEEDS: { k: Need; t: string }[] = [
  { k: "compta", t: "Comptabilité" },
  { k: "ventes", t: "Devis et factures" },
  { k: "stock", t: "Stocks et achats" },
  { k: "treso", t: "Trésorerie" },
  { k: "paie", t: "Paie" },
  { k: "conges", t: "Congés et absences" },
];

type Product = { name: string; text: string; img: string; sizes: Size[]; needs: Need[]; href: string; cta: string };

const PRODUCTS: Product[] = [
  {
    name: "Sage 50",
    text: "Comptabilité, devis, factures, stock et trésorerie : une solution connectée, pensée pour les TPE, accessible où que vous soyez.",
    img: "/img/produits/s50-tableau.webp",
    sizes: ["tpe"],
    needs: ["compta", "ventes", "stock", "treso"],
    href: links.contact,
    cta: "Demander une démo",
  },
  {
    name: "Sage 100 Entreprise",
    text: "Ventes et comptabilité réunies, informations centralisées et reportings automatisés, dans un système évolutif pour les PME.",
    img: "/img/sage100/ent/ent-commerciale.webp",
    sizes: ["pme", "eti"],
    needs: ["compta", "ventes", "stock", "treso"],
    href: sage100Links.entreprise,
    cta: "Découvrir Sage 100 Entreprise",
  },
  {
    name: "Sage 100 Comptabilité",
    text: "Automatisez vos processus comptables et suivez votre activité en temps réel, avec une connexion Cloud.",
    img: "/img/sage100/compta/compta-generale.webp",
    sizes: ["pme", "eti"],
    needs: ["compta", "treso"],
    href: sage100Links.comptabilite,
    cta: "Découvrir Sage 100 Comptabilité",
  },
  {
    name: "Sage 100 Gestion commerciale",
    text: "Du devis à la facture, avec les stocks et les achats : une force de vente organisée et efficace.",
    img: "/img/sage100/gc/gc-ventes.webp",
    sizes: ["pme", "eti"],
    needs: ["ventes", "stock"],
    href: sage100Links.gestion,
    cta: "Découvrir Sage 100 Gestion commerciale",
  },
  {
    name: "Sage 100 Paie et RH",
    text: "Bulletins de paie et déclarations sociales réalisés facilement et rapidement, en toute conformité.",
    img: "/img/sage-segments/moyennes-et-grandes-entreprises-3.webp",
    sizes: ["pme", "eti"],
    needs: ["paie"],
    href: links.contact,
    cta: "Demander une démo",
  },
  {
    name: "Sage Espace Employés",
    text: "Un SIRH 100 % cloud pour les absences et congés : sans papier, sans ressaisie, sans tâches chronophages.",
    img: "/img/produits/s100-employes.webp",
    sizes: ["pme", "eti"],
    needs: ["conges"],
    href: links.contact,
    cta: "Demander une démo",
  },
];

const COPY: Record<"tpe" | "pme", { crumb: string; title: string; accent: string; lead: string }> = {
  tpe: {
    crumb: "Petites entreprises",
    title: "Les logiciels Sage",
    accent: "pour les TPE et petites entreprises.",
    lead: "Des solutions simples pour rendre votre petite entreprise plus efficace et plus rentable.",
  },
  pme: {
    crumb: "Moyennes et grandes entreprises",
    title: "Les logiciels Sage",
    accent: "pour les PME et ETI.",
    lead: "Développez votre activité à votre rythme avec un logiciel de gestion d’entreprise.",
  },
};

export default function SageSegmentPage({ k }: { k: "tpe" | "pme" }) {
  const c = COPY[k];
  const [size, setSize] = useState<Size>(k);
  const [needs, setNeeds] = useState<Need[]>(k === "tpe" ? ["compta", "ventes"] : ["compta", "ventes", "stock"]);
  const toggle = (n: Need) => setNeeds((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));

  // Produits adaptés à la taille, triés par nombre de besoins couverts ; le premier est conseillé
  const ranked = useMemo(() => {
    const fit = PRODUCTS.filter((p) => p.sizes.includes(size));
    return fit
      .map((p) => ({ p, score: needs.filter((n) => p.needs.includes(n)).length }))
      .sort((a, b) => b.score - a.score || b.p.needs.length - a.p.needs.length);
  }, [size, needs]);
  const best = ranked[0];

  return (
    <>
      <section className="relative overflow-hidden bg-[#03100a] pb-[clamp(48px,6vw,80px)] pt-[clamp(36px,5vw,64px)] text-white" aria-labelledby="seg-title">
        <div className="pointer-events-none absolute -right-[10%] top-[-20%] h-[80vh] w-[70vw] rounded-full opacity-[0.22] blur-[120px]" style={{ background: SAGE_GREEN }} aria-hidden />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />
        <div className="container-x relative">
          <nav aria-label="Fil d’Ariane">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-white/60">
              <li>
                <a href={links.home} className="hover:text-white">Accueil</a>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight size={14} aria-hidden />
                <a href="/sage.tn/sage-100/" className="hover:text-white">Sage</a>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight size={14} aria-hidden />
                <span aria-current="page" className="font-medium text-white">{c.crumb}</span>
              </li>
            </ol>
          </nav>
          <div className="mt-10 max-w-3xl">
            <p className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-white/80">
              <span className="grid h-7 place-items-center rounded-full bg-white px-2.5">
                <img src="/img/logos/Sage_Logo_Brilliant_Green_RGB.webp" alt="Sage" className="h-5 w-auto" />
              </span>
              Quelle offre pour vous ?
            </p>
            <h1 id="seg-title" className="mt-7 font-display text-[clamp(36px,4.6vw,64px)] font-bold leading-[1.02] tracking-[-0.045em] !text-white">
              {c.title} <span style={{ color: SAGE_GREEN }}>{c.accent}</span>
            </h1>
            <p className="mt-5 max-w-xl text-[clamp(16px,1.25vw,18.5px)] leading-relaxed text-white/70">{c.lead}</p>
          </div>

          {/* Le comparateur */}
          <div className="mt-10 grid gap-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 md:p-7 lg:grid-cols-[0.9fr_1.1fr]">
            <fieldset>
              <legend className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/60">1 · Votre entreprise</legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s.k}
                    type="button"
                    onClick={() => setSize(s.k)}
                    aria-pressed={size === s.k}
                    className={`rounded-2xl border px-3 py-3 text-left transition-colors ${size === s.k ? "border-[#00d639] bg-[#00d639]/15" : "border-white/10 hover:border-white/30"}`}
                  >
                    <span className="block font-display text-[20px] font-bold text-white">{s.t}</span>
                    <span className="block text-[12px] text-white/60">{s.d}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/60">2 · Vos besoins</legend>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {NEEDS.map((n) => {
                  const on = needs.includes(n.k);
                  return (
                    <button
                      key={n.k}
                      type="button"
                      onClick={() => toggle(n.k)}
                      aria-pressed={on}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[14px] font-medium transition-colors ${on ? "border-[#00d639] bg-[#00d639]/15 text-white" : "border-white/10 text-white/70 hover:border-white/30"}`}
                    >
                      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md ${on ? "bg-[#00d639] text-[#03100a]" : "border border-white/30"}`}>{on && <Check size={13} strokeWidth={3} />}</span>
                      {n.t}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        </div>
      </section>

      {/* Résultat */}
      <section className="bg-white py-[clamp(56px,7vw,96px)]" aria-live="polite" aria-labelledby="seg-result">
        <div className="container-x">
          <h2 id="seg-result" className="sr-only">Les offres Sage adaptées</h2>
          {best && (
            <article key={best.p.name} className="s100-swap grid items-center gap-8 overflow-hidden rounded-[32px] bg-[#effaf2] p-6 md:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-[#03100a] px-3 py-1.5 text-[12.5px] font-semibold text-white">
                  <Sparkles size={14} style={{ color: SAGE_GREEN }} /> Conseillé pour vous
                </p>
                <h3 className="mt-5 font-display text-[clamp(30px,3.2vw,46px)] font-bold leading-[1.04] tracking-[-0.04em]">{best.p.name}</h3>
                <p className="mt-4 max-w-lg text-[16.5px] leading-relaxed text-ink-2">{best.p.text}</p>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-semibold text-ink">
                  {NEEDS.filter((n) => best.p.needs.includes(n.k)).map((n) => (
                    <li key={n.k} className="inline-flex items-center gap-1.5">
                      <Check size={15} strokeWidth={3} className={needs.includes(n.k) ? "text-[#0a8a2a]" : "text-ink-soft/50"} /> {n.t}
                    </li>
                  ))}
                </ul>
                <a href={best.p.href} className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#03100a] py-2 pl-6 pr-2 text-[15px] font-semibold text-white transition-transform duration-300 hover:scale-[1.03]">
                  {best.p.cta}
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0a8a2a] text-white">
                    <Arrow size={16} />
                  </span>
                </a>
              </div>
              <div className="rounded-[20px] bg-white p-3 ring-1 ring-black/5">
                <img src={best.p.img} alt={`Capture de ${best.p.name}`} className="block h-auto w-full rounded-[12px]" />
              </div>
            </article>
          )}

          {ranked.length > 1 && (
            <>
              <p className="mt-14 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-soft">Les autres offres pour les {SIZES.find((s) => s.k === size)?.t}</p>
              <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ranked.slice(1).map(({ p, score }) => (
                  <li key={p.name} className="flex flex-col overflow-hidden rounded-[22px] ring-1 ring-line">
                    <div className="bg-[#f4f8fb] p-3">
                      <img src={p.img} alt={`Capture de ${p.name}`} className="block aspect-[16/9] h-auto w-full rounded-[10px] object-cover object-left-top" loading="lazy" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-[20px] font-bold tracking-[-0.02em]">{p.name}</h3>
                      <p className="mt-1 text-[13px] font-semibold text-[#0a8a2a]">
                        {score ? `${score} besoin${score > 1 ? "s" : ""} couvert${score > 1 ? "s" : ""}` : "Complément utile"}
                      </p>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">{p.text}</p>
                      <a href={p.href} className="link-arrow mt-auto pt-4 text-[14.5px]">
                        {p.cta} <Arrow size={15} />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
}
