import { ChevronRight } from "lucide-react";
import { Arrow } from "@/components/ui";
import { links } from "@/lib/site";
import { B24_CYAN, B24_NIGHT } from "@/lib/bitrix24";
import { univers, type Univers } from "@/lib/bitrix24Univers";

/* Page d'un univers Bitrix24 (CRM, Centre de contact…) : même ouverture sombre que la page Bitrix24,
   puis les fonctions en blocs texte + visuel alternés, et les autres univers. */
export default function Bitrix24Univers({ u }: { u: Univers }) {
  const others = univers.filter((x) => x.slug !== u.slug);
  return (
    <>
      <section className="relative overflow-hidden pb-[clamp(60px,7vw,100px)] pt-[clamp(40px,5vw,70px)] text-white" style={{ background: B24_NIGHT }} aria-labelledby="univ-title">
        <div className="pointer-events-none absolute -right-[10%] top-[-20%] h-[80vh] w-[70vw] rounded-full opacity-[0.22] blur-[120px]" style={{ background: B24_CYAN }} aria-hidden />
        <div className="pointer-events-none absolute -left-[15%] bottom-[-30%] h-[60vh] w-[50vw] rounded-full bg-brand opacity-[0.25] blur-[120px]" aria-hidden />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />
        <div className="container-x relative">
          <nav aria-label="Fil d’Ariane">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-white/60">
              <li>
                <a href={links.home} className="hover:text-white">Accueil</a>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight size={14} aria-hidden />
                <a href={links.bitrix24} className="hover:text-white">Bitrix24</a>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight size={14} aria-hidden />
                <span aria-current="page" className="font-medium text-white">{u.name}</span>
              </li>
            </ol>
          </nav>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <div>
              <p className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-white/80">
                <span className="grid h-7 place-items-center rounded-full bg-white px-2.5">
                  <img src="/img/logos/logo-bitrix24.png" alt="Bitrix24" className="h-3.5 w-auto" />
                </span>
                {u.name}
              </p>
              <h1 id="univ-title" className="mt-7 font-display text-[clamp(34px,4vw,58px)] font-bold leading-[1.03] tracking-[-0.045em] !text-white">
                {u.title}
              </h1>
              <p className="mt-6 max-w-[540px] text-[clamp(16px,1.25vw,18.5px)] leading-relaxed text-white/70">{u.lead}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href={links.contact} className="group inline-flex min-h-[52px] items-center gap-3 rounded-full py-2 pl-7 pr-2 text-[15.5px] font-semibold transition-transform duration-300 hover:scale-[1.03]" style={{ background: B24_CYAN, color: B24_NIGHT }}>
                  Demander une démo
                  <span className="grid h-9 w-9 place-items-center rounded-full text-white" style={{ background: B24_NIGHT }}>
                    <Arrow size={16} />
                  </span>
                </a>
                <a href={`${links.bitrix24}#outils`} className="btn btn-outline-light !min-h-[52px]">
                  Les six univers
                </a>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[460px] rounded-[28px] bg-white p-5">
              <img src={u.hero} alt={`Bitrix24 : ${u.name}`} className="mx-auto block h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-[clamp(70px,9vw,120px)]" aria-label={`Les fonctions de ${u.name}`}>
        <div className="container-x grid gap-[clamp(56px,7vw,100px)]">
          {u.sections.map((s, i) => (
            <article key={s.t} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className={i % 2 ? "lg:order-2" : ""}>
                <span className="font-display text-[14px] font-bold" style={{ color: "#0b6fd6" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-2 font-display text-[clamp(26px,2.6vw,38px)] font-bold leading-[1.08] tracking-[-0.035em]">{s.t}</h2>
                <p className="mt-4 max-w-lg text-[16.5px] leading-relaxed text-ink-soft">{s.d}</p>
              </div>
              <div className="rounded-[26px] bg-[#f3f9fd] p-4 md:p-6">
                <img src={s.img} alt={`Bitrix24 : ${s.t}`} className="mx-auto block h-auto w-full" loading="lazy" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f3f9fd] py-[clamp(60px,8vw,100px)]" aria-labelledby="univ-others">
        <div className="container-x">
          <h2 id="univ-others" className="font-display text-[clamp(24px,2.4vw,34px)] font-bold tracking-[-0.03em]">
            Les autres univers Bitrix24
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((o) => (
              <li key={o.slug}>
                <a href={`${links.bitrix24}${o.slug}/`} className="group flex h-full items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 font-semibold text-ink ring-1 ring-line transition-colors hover:ring-[#2fc6f6]">
                  {o.name}
                  <Arrow size={16} />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-[28px] px-7 py-8 text-white md:px-10" style={{ background: B24_NIGHT }}>
            <p className="font-display text-[clamp(22px,2.2vw,30px)] font-bold leading-tight tracking-[-0.03em]">
              Voyons ce que Bitrix24 <span style={{ color: B24_CYAN }}>peut faire pour vous.</span>
            </p>
            <a href={links.contact} className="btn !bg-white !text-[#071a33]">
              Demander une démo <Arrow />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
