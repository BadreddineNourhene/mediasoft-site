import { ChevronRight } from "lucide-react";
import { Arrow } from "@/components/ui";
import { links } from "@/lib/site";
import { SAGE_GREEN, sage100Links } from "@/lib/sage100";

/* Pages « Petites entreprises » et « Moyennes et grandes entreprises » de sage.tn, reprises dans le nouveau site :
   textes et visuels des pages WordPress d'origine. Les produits sans page dans le nouveau site mènent à la demande de démo. */

type Product = { name: string; text: string; img: string; href: string; cta: string };
type Segment = { crumb: string; eyebrow: string; title: string; lead: string; hero: string; groups: { t?: string; items: Product[] }[] };

const IMG = "/img/sage-segments";

export const segments: Record<"tpe" | "pme", Segment> = {
  tpe: {
    crumb: "Petites entreprises",
    eyebrow: "TPE et petites entreprises",
    title: "Les logiciels de gestion dédiés aux TPE et petites entreprises.",
    lead: "Découvrez des solutions simples pour rendre votre petite entreprise plus efficace et plus rentable.",
    hero: `${IMG}/petites-entreprises-0.webp`,
    groups: [
      {
        t: "Comptabilité & gestion commerciale",
        items: [
          {
            name: "Sage 50",
            text: "Comptabilité, devis, factures, stock et trésorerie. Une solution connectée, pensée pour les TPE et accessible quand vous voulez, où que vous soyez.",
            img: `${IMG}/petites-entreprises-1.webp`,
            href: links.contact,
            cta: "Demander une démo de Sage 50",
          },
        ],
      },
    ],
  },
  pme: {
    crumb: "Moyennes et grandes entreprises",
    eyebrow: "PME et ETI",
    title: "Les logiciels de gestion dédiés aux PME et ETI.",
    lead: "Développez votre activité à votre rythme avec un logiciel de gestion d’entreprise.",
    hero: `${IMG}/moyennes-et-grandes-entreprises-0.webp`,
    groups: [
      {
        t: "Comptabilité, finance et gestion commerciale",
        items: [
          {
            name: "Sage 100",
            text: "Un logiciel de gestion intégrée avec une connexion Cloud pour les PME. Automatisez vos processus, obtenez des rapports en temps réel et libérez du temps pour développer votre entreprise.",
            img: `${IMG}/moyennes-et-grandes-entreprises-1.webp`,
            href: "/sage.tn/sage-100/",
            cta: "Découvrir Sage 100",
          },
        ],
      },
      {
        t: "Ressources humaines",
        items: [
          {
            name: "Sage Espace Employés",
            text: "Un SIRH 100 % cloud pour gérer les absences et congés de vos salariés. Éliminez le papier, supprimez les erreurs de ressaisie et réduisez les tâches chronophages.",
            img: `${IMG}/moyennes-et-grandes-entreprises-2.webp`,
            href: links.contact,
            cta: "Demander une démo",
          },
          {
            name: "Sage 100 Paie et RH",
            text: "Réalisez facilement et rapidement vos bulletins de paie et vos déclarations sociales, en toute conformité.",
            img: `${IMG}/moyennes-et-grandes-entreprises-3.webp`,
            href: links.contact,
            cta: "Demander une démo",
          },
        ],
      },
      {
        t: "ERP pour PME",
        items: [
          {
            name: "Sage 100 Entreprise",
            text: "Gérez les ventes et la comptabilité, centralisez les informations et automatisez les reportings, avec un système évolutif conçu pour les PME.",
            img: `${IMG}/moyennes-et-grandes-entreprises-4.webp`,
            href: sage100Links.entreprise,
            cta: "Découvrir Sage 100 Entreprise",
          },
        ],
      },
    ],
  },
};

export default function SageSegmentPage({ k }: { k: "tpe" | "pme" }) {
  const s = segments[k];
  let n = 0;
  return (
    <>
      <section className="relative overflow-hidden bg-[#03100a] pb-[clamp(60px,7vw,100px)] pt-[clamp(40px,5vw,70px)] text-white" aria-labelledby="seg-title">
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
                <span aria-current="page" className="font-medium text-white">{s.crumb}</span>
              </li>
            </ol>
          </nav>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div>
              <p className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-white/80">
                <span className="grid h-7 place-items-center rounded-full bg-white px-2.5">
                  <img src="/img/logos/Sage_Logo_Brilliant_Green_RGB.webp" alt="Sage" className="h-5 w-auto" />
                </span>
                {s.eyebrow}
              </p>
              <h1 id="seg-title" className="mt-7 font-display text-[clamp(34px,4vw,58px)] font-bold leading-[1.03] tracking-[-0.045em] !text-white">
                {s.title}
              </h1>
              <p className="mt-6 max-w-[540px] text-[clamp(16px,1.25vw,18.5px)] leading-relaxed text-white/70">{s.lead}</p>
              <a href={links.contact} className="group mt-9 inline-flex min-h-[52px] items-center gap-3 rounded-full py-2 pl-7 pr-2 text-[15.5px] font-semibold text-[#03100a] transition-transform duration-300 hover:scale-[1.03]" style={{ background: SAGE_GREEN }}>
                Demander une démo
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#03100a] text-white">
                  <Arrow size={16} />
                </span>
              </a>
            </div>
            <img src={s.hero} alt="" className="mx-auto block h-auto max-h-[460px] w-auto rounded-[24px]" />
          </div>
        </div>
      </section>

      <section className="bg-white py-[clamp(70px,9vw,120px)]" aria-label="Les solutions Sage">
        <div className="container-x grid gap-[clamp(56px,7vw,96px)]">
          {s.groups.map((g) => (
            <div key={g.t ?? "g"}>
              {g.t && <p className="eyebrow !text-[#066b1f]">{g.t}</p>}
              <div className="mt-6 grid gap-12">
                {g.items.map((p) => {
                  const flip = n++ % 2 === 1;
                  return (
                    <article key={p.name} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                      <div className={flip ? "lg:order-2" : ""}>
                        <h2 className="font-display text-[clamp(28px,2.8vw,42px)] font-bold leading-[1.05] tracking-[-0.04em]">{p.name}</h2>
                        <p className="mt-4 max-w-lg text-[16.5px] leading-relaxed text-ink-soft">{p.text}</p>
                        <a href={p.href} className="group mt-7 inline-flex items-center gap-3 rounded-full bg-[#03100a] py-2 pl-6 pr-2 text-[15px] font-semibold text-white transition-transform duration-300 hover:scale-[1.03]">
                          {p.cta}
                          <span className="grid h-9 w-9 place-items-center rounded-full text-white" style={{ background: "#0a8a2a" }}>
                            <Arrow size={16} />
                          </span>
                        </a>
                      </div>
                      <div className="rounded-[26px] bg-[#effaf2] p-4 md:p-6">
                        <img src={p.img} alt={p.name} className="mx-auto block h-auto w-full max-w-[560px]" loading="lazy" />
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
