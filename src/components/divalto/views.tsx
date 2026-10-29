import { Clock, Quote } from "lucide-react";
import { Arrow } from "@/components/ui";
import AppWindow from "@/components/visual/AppWindow";
import { links } from "@/lib/site";
import { dcaps, DIV_INK as INK, DIV_ORANGE as ORANGE } from "@/lib/divaltoHome";
import {
  catHref, categories, dHref, erp, ERP_SLUG, familyPages, findPage, modulePages, promesseMetier, resourcePages, sectorPages,
  type CapKey, type CategorySlug, type FamilyPage, type ModulePage, type ResourcePage, type SectorPage,
} from "@/lib/divalto";
import { DivaltoCta } from "./DivaltoClosing";
import { Crumbs, DIcon, PlatformMap, PrimaryCta, RelatedLinks, Reveal, TwoTone } from "./kit";
import { AtoutsStack, ErpTabs, ReadingProgress, SceneExplorer, Toc } from "./interactive";
import { AffaireIllus, DematIllus, GpaoIllus } from "./Illustrations";

/* Gabarits des pages de la section Divalto. Chaque type de page a sa composition :
   module (écran + circuit), solution métier (enjeux → réponses), famille, dossier éditorial, ERP, catégorie. */

function Cap({ k, title }: { k: CapKey; title: string }) {
  const c = dcaps[k];
  return (
    <figure className="relative">
      <div className="pointer-events-none absolute -inset-5 rounded-[36px] opacity-35 blur-2xl" style={{ background: ORANGE }} aria-hidden />
      <div className="relative">
        <AppWindow src={c.src} alt={c.alt} title={title} eager />
      </div>
      <figcaption className="mt-3 text-right text-[11.5px] text-ink-soft">Capture réelle de Divalto</figcaption>
    </figure>
  );
}

function SectionTitle({ eyebrow, title, accent, lead, light = false }: { eyebrow: string; title: string; accent?: string; lead?: string; light?: boolean }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr] lg:items-end">
      <div>
        <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}>{eyebrow}</p>
        <h2 className={`mt-4 font-display text-[clamp(30px,3.6vw,52px)] font-bold leading-[1.04] tracking-[-0.04em] ${light ? "!text-white" : ""}`} style={light ? undefined : { color: INK }}>
          {title} {accent && <span style={{ color: ORANGE }}>{accent}</span>}
        </h2>
      </div>
      {lead && <p className={`max-w-md text-[16.5px] leading-relaxed lg:justify-self-end ${light ? "text-white/65" : "text-ink-soft"}`}>{lead}</p>}
    </div>
  );
}

/* Répartition des atouts sur 12 colonnes : 5 → 3 + 2, 7 → 4 + 3, sinon lignes pleines */
const rowsFor: Record<number, number[]> = { 1: [1], 2: [2], 3: [3], 4: [4], 5: [3, 2], 6: [3, 3], 7: [4, 3], 8: [4, 4] };
const spanClass: Record<number, string> = { 1: "lg:col-span-12", 2: "lg:col-span-6", 3: "lg:col-span-4", 4: "lg:col-span-3" };
function spanOf(n: number, i: number) {
  const rows = rowsFor[n] ?? [4, 4, 4];
  let k = i;
  for (const r of rows) {
    if (k < r) return spanClass[r];
    k -= r;
  }
  return "lg:col-span-3";
}

/* ---------- Module ---------- */
export function ModuleView({ p }: { p: ModulePage }) {
  const illus = p.key === "gpao" ? <GpaoIllus /> : p.key === "affaire" ? <AffaireIllus /> : p.key === "demat" ? <DematIllus /> : null;
  return (
    <>
      <section className="relative overflow-hidden bg-[#fff7f0] pb-[clamp(70px,8vw,110px)] pt-[clamp(36px,4vw,56px)]">
        <div className="pointer-events-none absolute -right-[10%] -top-[30%] h-[80vh] w-[55vw] rounded-full opacity-20 blur-[110px]" style={{ background: ORANGE }} aria-hidden />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-30" aria-hidden />
        <div className="container-x relative">
          <Crumbs items={[{ label: "Modules", href: catHref("pour-vos-besoins") }, { label: p.name }]} />
          <div className="mt-10 grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-[#ff5500]/25 bg-white py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-ink-2">
                <span className="grid h-7 w-7 place-items-center rounded-full text-white" style={{ background: ORANGE }}>
                  <DIcon name={p.key} size={14} />
                </span>
                Module {p.name} · divalto infinity
              </p>
              <TwoTone title={p.title} accent={p.accent} className="mt-6 text-[clamp(38px,4.4vw,64px)] leading-[1.02]" />
              <p className="mt-6 max-w-[540px] text-[clamp(16.5px,1.25vw,18.5px)] leading-relaxed text-ink-soft">{p.lead}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <PrimaryCta href={links.contact}>Demander une démo</PrimaryCta>
                <a href="#fonctions" className="inline-flex min-h-[52px] items-center rounded-full border border-ink/15 bg-white px-6 text-[15px] font-semibold text-ink hover:border-ink/40">
                  Voir les fonctions
                </a>
              </div>
            </div>
            <div>{p.cap ? <Cap k={p.cap} title={`divalto infinity · ${p.name}`} /> : illus}</div>
          </div>
        </div>
      </section>

      {/* Promesse */}
      <section className="border-b border-line bg-white">
        <div className="container-x grid md:grid-cols-3">
          {p.promise.map((t, i) => (
            <Reveal key={t} delay={i * 90} className={`py-8 md:px-8 md:py-10 ${i ? "border-t border-line md:border-l md:border-t-0" : "md:pl-0"}`}>
              <span className="font-display text-[13px] font-bold" style={{ color: ORANGE }}>
                Vous pourrez
              </span>
              <p className="mt-2 font-display text-[clamp(20px,1.8vw,25px)] font-bold leading-snug tracking-[-0.03em]" style={{ color: INK }}>
                {t}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Fonctions */}
      <section id="fonctions" className="scroll-mt-32 bg-white py-[clamp(80px,9vw,130px)]">
        <div className="container-x">
          <SectionTitle eyebrow="Fonctions" title="Ce que le module fait" accent="pour vous." lead="Survolez ou choisissez une fonction pour la découvrir en détail." />
          <div className="mt-14">
            <SceneExplorer scenes={p.scenes} />
          </div>
        </div>
      </section>

      {/* Atouts : bande défilante */}
      <section className="relative overflow-hidden py-[clamp(80px,9vw,120px)] text-white" style={{ background: INK }}>
        <div className="pointer-events-none absolute -right-[10%] top-[-20%] h-[80%] w-[50%] rounded-full opacity-25 blur-[120px]" style={{ background: ORANGE }} aria-hidden />
        <div className="container-x relative">
          <SectionTitle eyebrow="Atouts" title={p.pointsTitle} light />
        </div>
        <div className="container-x relative">
          <AtoutsStack points={p.points} cap={p.cap ? { src: dcaps[p.cap].src, alt: dcaps[p.cap].alt } : undefined} />
        </div>
      </section>

      {/* Dans la plateforme */}
      <section className="bg-[#fff7f0] py-[clamp(80px,9vw,130px)]">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Une seule plateforme</p>
            <h2 className="mt-4 font-display text-[clamp(30px,3.6vw,50px)] font-bold leading-[1.04] tracking-[-0.04em]" style={{ color: INK }}>
              {p.name} partage ses données <span style={{ color: ORANGE }}>avec tout l’ERP.</span>
            </h2>
            <p className="mt-5 max-w-md text-[16.5px] leading-relaxed text-ink-soft">Une information saisie une fois sert partout : ventes, production, entrepôt et finance travaillent sur les mêmes données.</p>
            {p.definition && (
              <div className="mt-9 rounded-[24px] border border-[#ff5500]/20 bg-white p-6 md:p-7">
                <p className="font-display text-[18px] font-bold tracking-[-0.02em]" style={{ color: INK }}>
                  {p.definition.q}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{p.definition.a}</p>
                {p.definition.items && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.definition.items.map((it) => (
                      <li key={it} className="rounded-full bg-[#fff0e6] px-3 py-1.5 text-[13px] font-medium text-ink-2">
                        {it}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </Reveal>
          <Reveal delay={120}>
            <PlatformMap highlight={[p.slug, ...p.related.filter((s) => modulePages.some((m) => m.slug === s))]} />
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-[clamp(70px,8vw,110px)]">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Pour aller plus loin</p>
            <p className="mt-4 max-w-xs font-display text-[24px] font-bold leading-snug tracking-[-0.025em]" style={{ color: INK }}>
              Les modules et ressources liés à {p.name}.
            </p>
          </div>
          <RelatedLinks title="À découvrir aussi" slugs={[...p.related, ERP_SLUG]} />
        </div>
      </section>
      <DivaltoCta />
    </>
  );
}

/* ---------- Solution métier ---------- */
export function SectorView({ p }: { p: SectorPage }) {
  const fam = familyPages.find((f) => f.slug === p.family);
  const siblings = fam ? fam.sectors.filter((s) => s !== p.slug).slice(0, 5) : [];
  return (
    <>
      <section className="relative overflow-hidden pb-[clamp(70px,8vw,110px)] pt-[clamp(36px,4vw,56px)] text-white" style={{ background: INK }}>
        <div className="pointer-events-none absolute -left-[10%] top-[10%] h-[70vh] w-[50vw] rounded-full opacity-20 blur-[120px]" style={{ background: ORANGE }} aria-hidden />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden />
        <div className="container-x relative">
          <Crumbs light items={[{ label: "Solutions métiers", href: catHref("solutions-metiers") }, { label: p.name }]} />
          <div className="mt-10 grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.05] py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-white/80">
                <span className="grid h-7 w-7 place-items-center rounded-full text-white" style={{ background: ORANGE }}>
                  <DIcon name={p.icon} size={14} />
                </span>
                {p.product ?? `Solution Divalto · ${p.name}`}
              </p>
              <TwoTone light title={p.title} accent={p.accent} className="mt-6 text-[clamp(36px,4.3vw,62px)] leading-[1.02]" />
              <p className="mt-6 max-w-[560px] text-[clamp(16.5px,1.25vw,18.5px)] leading-relaxed text-white/70">{p.lead}</p>
              {p.editor && <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/45">{p.editor}</p>}
              <div className="mt-9 flex flex-wrap gap-3">
                <PrimaryCta href={links.contact} light>
                  Parler de mon projet
                </PrimaryCta>
                {p.seeAlso && (
                  <a href={dHref(p.seeAlso)} className="inline-flex min-h-[52px] items-center rounded-full border border-white/25 px-6 text-[15px] font-semibold text-white hover:bg-white/5">
                    Voir la solution détaillée
                  </a>
                )}
              </div>
            </div>
            {/* Composition : icône métier, publics en orbite */}
            <div className="relative mx-auto w-full max-w-[520px]">
              {p.cap ? (
                <div className="relative">
                  <AppWindow src={dcaps[p.cap].src} alt={dcaps[p.cap].alt} title={p.name} eager />
                  <span className="absolute -left-4 -top-6 grid h-20 w-20 place-items-center rounded-[22px] text-white shadow-[0_20px_40px_-10px_rgba(255,85,0,0.7)]" style={{ background: ORANGE }}>
                    <DIcon name={p.icon} size={34} />
                  </span>
                  <p className="mt-3 text-right text-[11.5px] text-white/40">Capture réelle de Divalto</p>
                </div>
              ) : (
                <div className="relative aspect-[2/1] sm:aspect-square">
                  <div className="div-spin absolute inset-[6%] hidden sm:block rounded-full border border-dashed border-white/15" aria-hidden />
                  <div className="absolute inset-[22%] hidden rounded-full border border-white/10 sm:block" aria-hidden />
                  <span className="absolute left-1/2 top-1/2 grid h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[28%] text-white shadow-[0_30px_60px_-15px_rgba(255,85,0,0.7)] max-sm:h-auto max-sm:w-[34%] max-sm:aspect-square" style={{ background: ORANGE }}>
                    <DIcon name={p.icon} size={56} />
                  </span>
                  {(p.audience?.items ?? p.answers?.map((a) => a.t) ?? []).slice(0, 6).map((t, i, arr) => {
                    const a = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
                    return (
                      <span key={t} className="div-float absolute hidden -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/12 bg-[#151d31] px-3.5 py-2 text-[12.5px] font-semibold text-white/85 shadow-lg sm:block" style={{ left: `${50 + Math.cos(a) * 42}%`, top: `${50 + Math.sin(a) * 42}%`, animationDelay: `${i * 0.5}s` }}>
                        {t}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Public */}
      {p.audience && (
        <section className="bg-white py-[clamp(60px,7vw,100px)]">
          <div className="container-x grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <Reveal>
              <p className="eyebrow">À qui s’adresse la solution</p>
              <p className="mt-4 max-w-sm font-display text-[clamp(24px,2.4vw,32px)] font-bold leading-snug tracking-[-0.03em]" style={{ color: INK }}>
                {p.audience.title}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <ul className="flex flex-wrap gap-2.5">
                {p.audience.items.map((t) => (
                  <li key={t} className="rounded-full border border-[#ff5500]/25 bg-[#fff7f0] px-4 py-2.5 text-[15px] font-semibold text-ink-2">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {/* Enjeux → réponses */}
      <section className="bg-[#fff7f0] py-[clamp(80px,9vw,130px)]">
        <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          {p.challenges && (
            <Reveal>
              <p className="eyebrow">Vos enjeux</p>
              <ol className="mt-6 space-y-5">
                {p.challenges.map((c, i) => (
                  <li key={c} className="flex gap-5">
                    <span className="mt-1 font-display text-[13px] font-bold tabular-nums" style={{ color: ORANGE }}>
                      0{i + 1}
                    </span>
                    <span className="font-display text-[clamp(20px,1.9vw,27px)] font-bold leading-snug tracking-[-0.03em]" style={{ color: INK }}>
                      {c}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          )}
          {p.answers && (
            <Reveal delay={120} className={p.challenges ? "" : "lg:col-span-2"}>
              <p className="eyebrow">{p.answersTitle ?? "La réponse Divalto"}</p>
              <ul className={`mt-6 grid gap-3 ${p.challenges ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                {p.answers.map((a) => (
                  <li key={a.t} className="relative overflow-hidden rounded-[22px] border border-[#ff5500]/15 bg-white p-6">
                    <span className="absolute inset-x-0 top-0 h-1" style={{ background: ORANGE }} aria-hidden />
                    <p className="font-display text-[18px] font-bold tracking-[-0.02em]" style={{ color: INK }}>
                      {a.t}
                    </p>
                    {a.d && <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">{a.d}</p>}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </section>

      {(p.extra || p.quote) && (
        <section className="bg-white py-[clamp(70px,8vw,110px)]">
          <div className="container-x grid gap-10 lg:grid-cols-2">
            {p.extra && (
              <Reveal>
                <p className="eyebrow">Fonctions métier</p>
                <p className="mt-4 font-display text-[clamp(24px,2.4vw,32px)] font-bold tracking-[-0.03em]" style={{ color: INK }}>
                  {p.extra.t}
                </p>
                {p.extra.d && <p className="mt-2 text-[15.5px] text-ink-soft">{p.extra.d}</p>}
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {p.extra.items?.map((t) => (
                    <li key={t} className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3 text-[15px] font-medium text-ink">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: ORANGE }} aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            {p.quote && (
              <Reveal delay={100}>
                <figure className="relative h-full rounded-[30px] p-8 text-white md:p-10" style={{ background: INK }}>
                  <Quote size={34} style={{ color: ORANGE }} aria-hidden />
                  <blockquote className="mt-5 font-display text-[clamp(19px,1.7vw,23px)] font-semibold leading-snug tracking-[-0.02em]">« {p.quote.text} »</blockquote>
                  <figcaption className="mt-6 text-[14px] text-white/60">{p.quote.who}</figcaption>
                </figure>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* Garantie solution métier + modules */}
      <section className="py-[clamp(80px,9vw,130px)] text-white" style={{ background: INK }}>
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div>
            {!p.thin ? (
              <>
                <p className="eyebrow eyebrow-light">La garantie solution métier</p>
                <h2 className="mt-4 font-display text-[clamp(28px,3.2vw,46px)] font-bold leading-[1.05] tracking-[-0.04em] !text-white">
                  Prête pour votre métier, <span style={{ color: ORANGE }}>rapide à déployer.</span>
                </h2>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {promesseMetier.map((g) => (
                    <li key={g.t} className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5">
                      <p className="font-display text-[17px] font-bold text-white">{g.t}</p>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-white/60">{g.d}</p>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="eyebrow eyebrow-light">Une seule plateforme</p>
                <h2 className="mt-4 font-display text-[clamp(28px,3.2vw,46px)] font-bold leading-[1.05] tracking-[-0.04em] !text-white">
                  Les modules de l’ERP <span style={{ color: ORANGE }}>au service de votre métier.</span>
                </h2>
                <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/65">Un consultant Mediasoft étudie votre activité et vous présente la configuration Divalto adaptée.</p>
              </>
            )}
          </div>
          <div>
            <p className="mb-4 text-center text-[12px] font-bold uppercase tracking-[0.14em] text-white/45">Modules mobilisés</p>
            <PlatformMap dark highlight={p.modules} />
          </div>
        </div>
      </section>

      <section className="bg-white py-[clamp(70px,8vw,110px)]">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          {siblings.length > 0 && <RelatedLinks title={`Autres solutions · ${fam!.name}`} slugs={siblings} />}
          <div>
            <RelatedLinks title="Votre famille de métiers" slugs={fam ? [fam.slug] : []} />
            <a href={catHref("solutions-metiers")} className="group mt-8 inline-flex items-center gap-2 font-semibold" style={{ color: INK }}>
              Toutes les solutions métiers
              <span className="grid h-8 w-8 place-items-center rounded-full text-white transition-transform group-hover:translate-x-1" style={{ background: ORANGE }}>
                <Arrow size={15} />
              </span>
            </a>
          </div>
        </div>
      </section>
      <DivaltoCta />
    </>
  );
}

/* ---------- Famille de secteurs ---------- */
export function FamilyView({ p }: { p: FamilyPage }) {
  const secs = p.sectors.map((s) => sectorPages.find((x) => x.slug === s)!).filter(Boolean);
  return (
    <>
      <section className="relative overflow-hidden bg-[#fff7f0] pb-[clamp(70px,8vw,110px)] pt-[clamp(36px,4vw,56px)]">
        <div className="pointer-events-none absolute -right-[10%] -top-[30%] h-[80vh] w-[55vw] rounded-full opacity-20 blur-[110px]" style={{ background: ORANGE }} aria-hidden />
        <div className="container-x relative">
          <Crumbs items={[{ label: "Secteurs", href: catHref("pour-votre-secteur") }, { label: p.name }]} />
          <div className="mt-10 grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-[#ff5500]/25 bg-white py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-ink-2">
                <span className="grid h-7 w-7 place-items-center rounded-full text-white" style={{ background: ORANGE }}>
                  <DIcon name={p.icon} size={14} />
                </span>
                Logiciel ERP-CRM · {p.name}
              </p>
              <TwoTone title={p.title} accent={p.accent} className="mt-6 text-[clamp(38px,4.4vw,64px)] leading-[1.02]" />
              <p className="mt-6 max-w-[540px] text-[clamp(16.5px,1.25vw,18.5px)] leading-relaxed text-ink-soft">{p.lead}</p>
              <div className="mt-9">
                <PrimaryCta href={links.contact}>Parler de mon projet</PrimaryCta>
              </div>
            </div>
            {p.cap && <Cap k={p.cap} title={`Divalto · ${p.name}`} />}
          </div>
        </div>
      </section>

      <section className="bg-white py-[clamp(80px,9vw,130px)]">
        <div className="container-x">
          <SectionTitle eyebrow="Les enjeux" title="Nous répondons aux enjeux" accent="de votre métier." lead={p.audience} />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {p.enjeux.map((e, i) => (
              <li key={e} className="group bg-white p-7 transition-colors hover:bg-[#fff7f0]">
                <span className="font-display text-[34px] font-bold leading-none tracking-[-0.05em] transition-colors" style={{ color: ORANGE }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-5 font-display text-[17.5px] font-bold leading-snug tracking-[-0.02em]" style={{ color: INK }}>
                  {e}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-[clamp(80px,9vw,130px)] text-white" style={{ background: INK }}>
        <div className="container-x">
          <SectionTitle light eyebrow="Solutions métiers" title="Des solutions packagées" accent="pour chaque métier." />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {secs.map((s) => (
              <li key={s.slug}>
                <a href={dHref(s.slug)} className="group flex h-full flex-col rounded-[26px] border border-white/10 bg-white/[0.04] p-7 transition-all hover:-translate-y-1 hover:border-[#ff5500]/60">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ background: ORANGE }}>
                    <DIcon name={s.icon} size={22} />
                  </span>
                  <p className="mt-6 font-display text-[21px] font-bold tracking-[-0.025em] text-white">{s.name}</p>
                  <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-white/60">{s.title} {s.accent}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold" style={{ color: ORANGE }}>
                    Découvrir <Arrow size={15} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#fff7f0] py-[clamp(80px,9vw,120px)]">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Les modules clés</p>
            <h2 className="mt-4 font-display text-[clamp(28px,3.2vw,46px)] font-bold leading-[1.05] tracking-[-0.04em]" style={{ color: INK }}>
              Une plateforme, <span style={{ color: ORANGE }}>les modules qu’il vous faut.</span>
            </h2>
            <div className="mt-8">
              <RelatedLinks title="Modules" slugs={p.modules} />
            </div>
          </Reveal>
          <PlatformMap highlight={p.modules} />
        </div>
      </section>
      <DivaltoCta />
    </>
  );
}

/* ---------- Dossier ---------- */
export function ResourceView({ p }: { p: ResourcePage }) {
  return (
    <>
      <ReadingProgress />
      <section className="relative overflow-hidden bg-[#fff7f0] pb-[clamp(56px,6vw,90px)] pt-[clamp(36px,4vw,56px)]">
        <div className="pointer-events-none absolute -right-[10%] -top-[30%] h-[70vh] w-[50vw] rounded-full opacity-20 blur-[110px]" style={{ background: ORANGE }} aria-hidden />
        <div className="container-x relative">
          <Crumbs items={[{ label: "Ressources" }, { label: p.name }]} />
          <p className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-ink-2">
            <Clock size={14} style={{ color: ORANGE }} aria-hidden /> Dossier · {p.minutes} min de lecture
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(36px,4.6vw,66px)] font-bold leading-[1.03] tracking-[-0.045em]" style={{ color: INK }}>
            {p.title}
          </h1>
          <p className="mt-6 max-w-2xl text-[clamp(17px,1.35vw,20px)] leading-relaxed text-ink-soft">{p.lead}</p>
        </div>
      </section>

      <section className="bg-white py-[clamp(60px,7vw,100px)]">
        <div className="container-x grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-20">
          <aside className="hidden lg:block">
            <div className="sticky top-36">
              <Toc items={p.sections.map((s) => ({ id: s.id, h: s.h }))} />
            </div>
          </aside>
          <article className="max-w-[720px]">
            <div className="rounded-[24px] p-6 text-white md:p-8" style={{ background: INK }}>
              <p className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: ORANGE }}>
                À retenir
              </p>
              <ul className="mt-4 space-y-2.5">
                {p.takeaways.map((t) => (
                  <li key={t} className="flex gap-3 text-[16px] leading-relaxed text-white/85">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ORANGE }} aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            {p.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-36 pt-14">
                <p className="font-display text-[13px] font-bold tabular-nums" style={{ color: ORANGE }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 font-display text-[clamp(26px,2.6vw,36px)] font-bold leading-tight tracking-[-0.035em]" style={{ color: INK }}>
                  {s.h}
                </h2>
                {s.p.map((t) => (
                  <p key={t} className="mt-4 text-[17.5px] leading-[1.75] text-ink-2">
                    {t}
                  </p>
                ))}
                {s.items && (
                  <ul className="mt-5 space-y-2.5">
                    {s.items.map((t) => (
                      <li key={t} className="flex gap-3 rounded-2xl bg-[#fff7f0] px-5 py-3.5 text-[16px] leading-relaxed text-ink-2">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ORANGE }} aria-hidden />
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <div className="mt-16">
              <RelatedLinks title="Continuer la lecture" slugs={p.related} />
            </div>
          </article>
        </div>
      </section>
      <DivaltoCta />
    </>
  );
}

/* ---------- ERP divalto infinity ---------- */
export function ErpView() {
  return (
    <>
      <section className="relative overflow-hidden pb-[clamp(70px,8vw,110px)] pt-[clamp(36px,4vw,56px)] text-white" style={{ background: INK }}>
        <div className="pointer-events-none absolute -right-[10%] top-[-20%] h-[90vh] w-[60vw] rounded-full opacity-25 blur-[120px]" style={{ background: ORANGE }} aria-hidden />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden />
        <div className="container-x relative">
          <Crumbs light items={[{ label: "ERP divalto infinity" }]} />
          <div className="mt-10 grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-1.5 text-[13px] font-semibold text-white/80">ERP pour PME et ETI · 100 % cloud</p>
              <TwoTone light title="Toute l’entreprise," accent="sur une seule plateforme." className="mt-6 text-[clamp(38px,4.6vw,66px)] leading-[1.02]" />
              <p className="mt-6 max-w-[540px] text-[clamp(16.5px,1.25vw,18.5px)] leading-relaxed text-white/70">
                Divalto infinity est un logiciel ERP complet dédié aux PME et aux ETI. 100 % cloud, il rassemble les outils de votre quotidien et s’adapte à votre activité.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <PrimaryCta href={links.contact} light>
                  Demander une démo
                </PrimaryCta>
                <a href="#modules" className="inline-flex min-h-[52px] items-center rounded-full border border-white/25 px-6 text-[15px] font-semibold text-white hover:bg-white/5">
                  Explorer les modules
                </a>
              </div>
            </div>
            <PlatformMap dark highlight={modulePages.map((m) => m.slug)} />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="container-x grid sm:grid-cols-2 lg:grid-cols-4">
          {erp.reasons.map((r, i) => (
            <Reveal key={r.t} delay={i * 80} className={`py-8 sm:px-6 lg:py-10 ${i ? "border-t border-line sm:border-t-0 lg:border-l" : "sm:pl-0"} ${i === 2 ? "sm:border-t lg:border-t-0" : ""} ${i === 3 ? "sm:border-l sm:border-t lg:border-t-0" : ""} ${i === 1 ? "sm:border-l" : ""}`}>
              <p className="font-display text-[22px] font-bold tracking-[-0.03em]" style={{ color: INK }}>
                {r.t}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{r.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="modules" className="scroll-mt-32 bg-[#fff7f0] py-[clamp(80px,9vw,130px)]">
        <div className="container-x">
          <SectionTitle eyebrow="Modules" title="Sept modules," accent="une seule base de données." lead="Gestion commerciale, production, affaires, entrepôt, finance, maintenance et qualité : choisissez un module." />
          <div className="mt-12">
            <ErpTabs modules={erp.modules} />
          </div>
        </div>
      </section>

      <section className="py-[clamp(80px,9vw,120px)] text-white" style={{ background: INK }}>
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow eyebrow-light">Définition</p>
            <h2 className="mt-4 font-display text-[clamp(28px,3.2vw,46px)] font-bold leading-[1.05] tracking-[-0.04em] !text-white">
              Un ERP, <span style={{ color: ORANGE }}>c’est quoi ?</span>
            </h2>
            <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-white/70">
              Un ERP (Enterprise Resource Planning) pilote l’entreprise. Sa particularité : réunir dans un même logiciel et une seule base de données toutes les fonctions de gestion — comptabilité, gestion commerciale, stocks… L’information circule sans ressaisie entre les services.
            </p>
            <a href={dHref("logiciel-erp")} className="mt-8 inline-flex items-center gap-2 font-semibold" style={{ color: ORANGE }}>
              Lire notre dossier Logiciel ERP <Arrow size={15} />
            </a>
          </div>
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-8">
            <p className="font-display text-[22px] font-bold text-white">Votre secteur a sa solution métier</p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/60">Industrie, négoce, services terrain : des progiciels packagés pour aller plus vite.</p>
            <a href={catHref("solutions-metiers")} className="mt-7 inline-flex items-center gap-2 font-semibold text-white">
              Voir les solutions métiers <Arrow size={15} />
            </a>
          </div>
        </div>
      </section>
      <DivaltoCta />
    </>
  );
}

/* ---------- Catégories ---------- */
export function CategoryView({ slug }: { slug: CategorySlug }) {
  const c = categories[slug];
  return (
    <>
      <section className="relative overflow-hidden bg-[#fff7f0] pb-[clamp(56px,6vw,90px)] pt-[clamp(36px,4vw,56px)]">
        <div className="pointer-events-none absolute -right-[10%] -top-[30%] h-[70vh] w-[50vw] rounded-full opacity-20 blur-[110px]" style={{ background: ORANGE }} aria-hidden />
        <div className="container-x relative">
          <Crumbs items={[{ label: c.title }]} />
          <TwoTone title={c.h} accent={c.accent} className="mt-10 max-w-4xl text-[clamp(38px,4.8vw,70px)] leading-[1.02]" />
          <p className="mt-6 max-w-2xl text-[clamp(17px,1.35vw,20px)] leading-relaxed text-ink-soft">{c.lead}</p>
        </div>
      </section>

      {slug === "pour-vos-besoins" && (
        <section className="bg-white py-[clamp(60px,7vw,110px)]">
          <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <ul className="border-t border-line">
              {modulePages.map((m, i) => (
                <li key={m.slug} className="border-b border-line">
                  <a href={dHref(m.slug)} className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl text-white transition-transform group-hover:scale-110" style={{ background: i % 2 ? INK : ORANGE }}>
                      <DIcon name={m.key} size={20} />
                    </span>
                    <span>
                      <span className="block font-display text-[clamp(20px,2vw,27px)] font-bold tracking-[-0.03em] text-ink transition-colors group-hover:text-[#d64700]">{m.name}</span>
                      <span className="mt-1 block text-[15px] text-ink-soft">{m.promise.join(" · ")}</span>
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-line transition-all group-hover:translate-x-1 group-hover:border-transparent group-hover:bg-[#ff5500] group-hover:text-white">
                      <Arrow size={16} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div>
              <PlatformMap highlight={modulePages.map((m) => m.slug)} />
              <p className="mt-6 text-center text-[14.5px] text-ink-soft">
                Maintenance (GMAO-GRM) et qualité (SMQ) complètent l’ERP :{" "}
                <a href={dHref(ERP_SLUG)} className="font-semibold text-ink underline decoration-[#ff5500] underline-offset-4">
                  voir divalto infinity
                </a>
              </p>
            </div>
          </div>
        </section>
      )}

      {slug === "pour-votre-secteur" && (
        <section className="bg-white py-[clamp(60px,7vw,110px)]">
          <div className="container-x grid gap-5 lg:grid-cols-3">
            {familyPages.map((f, i) => (
              <article key={f.slug} className="flex flex-col overflow-hidden rounded-[30px] border border-line" style={i === 1 ? { background: INK } : undefined}>
                <a href={dHref(f.slug)} className="group block p-8">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl text-white" style={{ background: ORANGE }}>
                    <DIcon name={f.icon} size={24} />
                  </span>
                  <h2 className={`mt-7 font-display text-[28px] font-bold tracking-[-0.035em] ${i === 1 ? "!text-white" : ""}`} style={i === 1 ? undefined : { color: INK }}>
                    {f.name}
                  </h2>
                  <p className={`mt-2 text-[15px] leading-relaxed ${i === 1 ? "text-white/60" : "text-ink-soft"}`}>{f.audience}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-semibold" style={{ color: ORANGE }}>
                    Découvrir <Arrow size={15} />
                  </span>
                </a>
                <ul className={`mt-auto border-t px-8 py-5 ${i === 1 ? "border-white/10" : "border-line bg-[#fff7f0]"}`}>
                  {f.sectors.map((s) => (
                    <li key={s}>
                      <a href={dHref(s)} className={`flex items-center justify-between py-2 text-[14.5px] font-medium ${i === 1 ? "text-white/80 hover:text-white" : "text-ink-2 hover:text-[#d64700]"}`}>
                        {findPage(s) && "name" in findPage(s)! ? (findPage(s) as SectorPage).name : s}
                        <Arrow size={14} />
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {slug === "solutions-metiers" && (
        <>
          <section className="bg-white py-[clamp(60px,7vw,110px)]">
            <div className="container-x">
              <ul className="grid gap-px overflow-hidden rounded-[30px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                {sectorPages.map((s) => (
                  <li key={s.slug}>
                    <a href={dHref(s.slug)} className="group flex h-full items-start gap-5 bg-white p-7 transition-colors hover:bg-[#fff7f0]">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white transition-transform group-hover:-rotate-6" style={{ background: ORANGE }}>
                        <DIcon name={s.icon} size={22} />
                      </span>
                      <span>
                        <span className="block font-display text-[19px] font-bold leading-snug tracking-[-0.02em]" style={{ color: INK }}>
                          {s.name}
                        </span>
                        <span className="mt-1.5 block text-[14px] leading-relaxed text-ink-soft">
                          {s.title} {s.accent}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="py-[clamp(70px,8vw,110px)] text-white" style={{ background: INK }}>
            <div className="container-x">
              <SectionTitle light eyebrow="La garantie solution métier" title="Pourquoi une solution métier" accent="va plus vite." />
              <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {promesseMetier.map((g) => (
                  <li key={g.t} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-6">
                    <p className="font-display text-[18px] font-bold text-white">{g.t}</p>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-white/60">{g.d}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
      <DivaltoCta />
    </>
  );
}

export { resourcePages };
