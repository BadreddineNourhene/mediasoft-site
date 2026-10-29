import { Phone, Target, Factory } from "lucide-react";
import { Arrow, SmartLink } from "@/components/ui";
import { links, site } from "@/lib/site";
import { doors, resources, DIV_INK, DIV_ORANGE } from "@/lib/divaltoHome";

/* Fin de page : deux portes d'entrée (un besoin ou un secteur), les dossiers à lire,
   l'accompagnement Mediasoft avec la photo du stand, puis l'invitation à nous contacter. */

const steps = [
  { t: "Conseil", d: "Nous regardons comment vous travaillez avant de recommander quoi que ce soit." },
  { t: "Personnalisation", d: "Paramétrage, modules spécifiques, connecteurs : Divalto prend la forme de votre entreprise." },
  { t: "Formation", d: "Vos utilisateurs sont formés pour adopter l’outil dès le premier jour." },
  { t: "Assistance", d: "Help desk, assistance à distance et deux agences, à Tunis et à Sousse." },
];

export function DivaltoDoors() {
  return (
    <section className="bg-white py-[clamp(80px,10vw,140px)]" aria-labelledby="div-doors-title">
      <div className="container-x">
        <p className="eyebrow">Nos services</p>
        <h2 id="div-doors-title" className="mt-4 max-w-3xl font-display text-[clamp(32px,3.8vw,56px)] font-bold leading-[1.04] tracking-[-0.04em]" style={{ color: DIV_INK }}>
          Par où commencer ? <span className="text-ink-soft/70">Par ce que vous connaissez le mieux.</span>
        </h2>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {/* Porte 1 : un besoin */}
          <article className="group relative overflow-hidden rounded-[32px] border border-line bg-[#fff7f0] p-8 transition-colors duration-500 hover:border-[#ff5500]/40 md:p-12">
            <span className="grid h-14 w-14 place-items-center rounded-2xl text-white" style={{ background: DIV_ORANGE }}>
              <Target size={24} aria-hidden />
            </span>
            <h3 className="mt-8 font-display text-[clamp(26px,2.6vw,36px)] font-bold tracking-[-0.035em]" style={{ color: DIV_INK }}>
              Je pars d’un besoin
            </h3>
            <ul className="mt-6 flex flex-wrap gap-2">
              {doors.besoins.items.map((t) => (
                <li key={t} className="rounded-full border border-[#ff5500]/25 bg-white px-3.5 py-1.5 text-[13.5px] font-semibold text-ink-2">
                  {t}
                </li>
              ))}
            </ul>
            <SmartLink href={doors.besoins.href} className="mt-10 inline-flex items-center gap-2 font-semibold" style={{ color: DIV_INK }}>
              Pour vos besoins
              <span className="grid h-9 w-9 place-items-center rounded-full text-white transition-transform group-hover:translate-x-1" style={{ background: DIV_ORANGE }}>
                <Arrow size={16} />
              </span>
            </SmartLink>
          </article>

          {/* Porte 2 : un secteur */}
          <article className="group relative overflow-hidden rounded-[32px] p-8 text-white md:p-12" style={{ background: DIV_INK }}>
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-50" style={{ background: DIV_ORANGE }} aria-hidden />
            <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-white/10" style={{ color: DIV_ORANGE }}>
              <Factory size={24} aria-hidden />
            </span>
            <h3 className="relative mt-8 font-display text-[clamp(26px,2.6vw,36px)] font-bold tracking-[-0.035em] !text-white">Je pars de mon secteur</h3>
            <ul className="relative mt-6 border-t border-white/10">
              {doors.secteurs.map((s) => (
                <li key={s.name} className="border-b border-white/10">
                  <SmartLink href={s.href} className="flex items-center justify-between py-4 text-[17px] font-semibold text-white/85 transition-colors hover:text-white">
                    {s.name}
                    <Arrow size={16} />
                  </SmartLink>
                </li>
              ))}
            </ul>
            <SmartLink href={doors.secteursHref} className="relative mt-8 inline-flex items-center gap-2 text-[15px] font-semibold" style={{ color: DIV_ORANGE }}>
              Pour votre secteur <Arrow size={15} />
            </SmartLink>
          </article>
        </div>

        {/* Ressources */}
        <div className="mt-20 grid gap-8 lg:grid-cols-[0.6fr_1.4fr]">
          <div>
            <p className="eyebrow">Ressources</p>
            <p className="mt-4 max-w-xs font-display text-[22px] font-bold leading-snug tracking-[-0.02em]" style={{ color: DIV_INK }}>
              Des dossiers pour y voir clair avant de choisir.
            </p>
          </div>
          <ol className="border-t border-line">
            {resources.map((r, i) => (
              <li key={r.name} className="border-b border-line">
                <SmartLink href={r.href} className="group flex items-center gap-6 py-5">
                  <span className="font-display text-[13px] font-bold tabular-nums text-ink-soft/60">0{i + 1}</span>
                  <span className="flex-1 font-display text-[clamp(18px,1.7vw,23px)] font-semibold tracking-[-0.02em] text-ink transition-colors group-hover:text-[#d64700]">{r.name}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-all group-hover:border-transparent group-hover:bg-[#ff5500] group-hover:text-white">
                    <span className="transition-transform group-hover:translate-x-0.5">
                      <Arrow size={15} />
                    </span>
                  </span>
                </SmartLink>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function DivaltoMediasoft() {
  return (
    <section className="bg-[#fff7f0] py-[clamp(80px,10vw,140px)]" aria-labelledby="div-ms-title">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <figure className="relative">
          <div className="absolute -inset-3 rotate-[2deg] rounded-[36px]" style={{ background: DIV_ORANGE, opacity: 0.18 }} aria-hidden />
          <img src="/img/photos/stand-mediasoft-divalto.webp" alt="Stand Mediasoft aux couleurs de Divalto" width={720} height={558} className="relative block h-auto w-full rounded-[30px] object-cover" loading="lazy" />
        </figure>
        <div>
          <p className="eyebrow">Revendeur Divalto en Tunisie</p>
          <h2 id="div-ms-title" className="mt-4 font-display text-[clamp(30px,3.6vw,52px)] font-bold leading-[1.04] tracking-[-0.04em]" style={{ color: DIV_INK }}>
            Un ERP se choisit. <span style={{ color: DIV_ORANGE }}>Il se réussit avec un partenaire.</span>
          </h2>
          <p className="mt-5 max-w-lg text-[16.5px] leading-relaxed text-ink-soft">
            Depuis 2001, Mediasoft conseille, installe et accompagne les logiciels de gestion des PME et ETI tunisiennes, avec des équipes à Tunis et à Sousse.
          </p>
          <ol className="mt-9 border-t border-[#ff5500]/20">
            {steps.map((s, i) => (
              <li key={s.t} className="grid grid-cols-[auto_1fr] gap-x-5 border-b border-[#ff5500]/20 py-5">
                <span className="font-display text-[13px] font-bold" style={{ color: DIV_ORANGE }}>
                  0{i + 1}
                </span>
                <span>
                  <span className="block font-display text-[19px] font-bold tracking-[-0.02em]" style={{ color: DIV_INK }}>
                    {s.t}
                  </span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-ink-soft">{s.d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function DivaltoCta() {
  const phone = site.techPhones[0];
  return (
    <section className="bg-white py-[clamp(70px,9vw,120px)]" aria-labelledby="div-cta-title">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[40px] px-8 py-14 text-white md:px-16 md:py-20" style={{ background: `linear-gradient(120deg, ${DIV_ORANGE}, #d64700)` }}>
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-20" aria-hidden />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h2 id="div-cta-title" className="font-display text-[clamp(32px,4vw,58px)] font-bold leading-[1.02] tracking-[-0.045em] !text-white">
                Parlons de votre métier.
                <br />
                Nous parlerons de Divalto ensuite.
              </h2>
              <p className="mt-5 max-w-lg text-[16.5px] leading-relaxed text-white/85">Un consultant Mediasoft étudie votre activité et vous montre la solution Divalto qui lui correspond.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
              <a href={links.contact} className="group inline-flex min-h-[56px] items-center justify-between gap-3 rounded-full bg-white py-2 pl-7 pr-2 text-[16px] font-semibold transition-transform duration-300 hover:scale-[1.03] lg:min-w-[300px]" style={{ color: DIV_INK }}>
                Contactez-nous
                <span className="grid h-10 w-10 place-items-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1" style={{ background: DIV_INK }}>
                  <Arrow size={17} />
                </span>
              </a>
              <a href={phone.href} className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-full border border-white/40 px-7 text-[16px] font-semibold text-white transition-colors hover:bg-white/10 lg:min-w-[300px]">
                <Phone size={17} aria-hidden /> {phone.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
