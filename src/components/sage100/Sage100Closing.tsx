import { Phone } from "lucide-react";
import { Arrow, SmartLink } from "@/components/ui";
import { links, site } from "@/lib/site";
import { sage100Links, SAGE_GREEN } from "@/lib/sage100";
import Reveal from "@/components/sage100/Reveal";

/* Fin de page : ce que les équipes y gagnent (3 colonnes à filets), l'accompagnement Mediasoft
   en quatre temps, puis l'invitation à demander une démo. */

const gains = [
  { n: "01", t: "Gagnez en productivité", d: "Les tâches administratives sont automatisées et les saisies répétitives réduites." },
  { n: "02", t: "Maîtrisez votre chaîne commerciale", d: "Du devis à la facturation, en passant par les achats et les stocks." },
  { n: "03", t: "Anticipez vos besoins", d: "Informations financières et tableaux de bord en temps réel pour mieux gérer la trésorerie." },
];

const steps = [
  { t: "Conseil", d: "Nous regardons comment vous travaillez pour retenir la formule et les modules qui vous ressemblent.", href: sage100Links.conseil },
  { t: "Personnalisation", d: "Paramétrage, modules spécifiques, connecteurs : Sage 100 prend la forme de votre entreprise.", href: null },
  { t: "Formation", d: "Vos utilisateurs sont formés pour adopter l’outil dès le premier jour.", href: sage100Links.formation },
  { t: "Assistance", d: "Help desk, assistance à distance et deux agences, à Tunis et à Sousse.", href: sage100Links.assistance },
];

export function Sage100Gains() {
  return (
    <section className="bg-[#f4fbf6] py-[clamp(80px,10vw,130px)]" aria-labelledby="s100-g-title">
      <div className="container-x">
        <p className="eyebrow !text-[#066b1f]">Pour vos équipes</p>
        <h2 id="s100-g-title" className="mt-4 max-w-3xl font-display text-[clamp(32px,3.8vw,56px)] font-bold leading-[1.04] tracking-[-0.04em]">
          Moins de tâches répétitives. <span className="text-[#066b1f]">Plus de décisions éclairées.</span>
        </h2>
        {/* Animation à l'arrivée : le filet se trace, puis chaque colonne monte (chiffre, titre, texte) en décalé */}
        <Reveal className="s100-g relative mt-14 grid md:grid-cols-3">
          <span className="s100-g-line absolute inset-x-0 top-0 h-px origin-left bg-[#066b1f]/25" aria-hidden />
          {gains.map((g, i) => (
            <div key={g.n} className={`s100-g-col group relative py-9 md:px-8 md:py-12 ${i === 0 ? "md:pl-0" : ""}`} style={{ ["--d" as string]: `${i * 0.18}s` }}>
              {i > 0 && <span className="s100-g-vline absolute left-0 top-0 hidden h-full w-px origin-top bg-[#066b1f]/20 md:block" aria-hidden />}
              <span className="block overflow-hidden">
                <span className="s100-g-num block font-display text-[clamp(44px,4.4vw,64px)] font-bold leading-none tracking-[-0.05em] text-[#079a2e]">{g.n}</span>
              </span>
              <span className="s100-g-bar mt-4 block h-[3px] w-10 origin-left rounded-full bg-[#079a2e] transition-[width] duration-500 group-hover:w-20" aria-hidden />
              <h3 className="s100-g-txt mt-5 font-display text-[22px] font-bold tracking-[-0.03em]">{g.t}</h3>
              <p className="s100-g-txt mt-3 max-w-xs text-[15.5px] leading-relaxed text-ink-soft">{g.d}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Sage100Mediasoft() {
  return (
    <section className="relative overflow-hidden bg-[#010805] py-[clamp(80px,10vw,140px)] text-white" aria-labelledby="s100-ms-title">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden />
      <div className="pointer-events-none absolute -left-[10%] -top-[30%] h-[90%] w-[55%] rounded-full opacity-[0.06] blur-[120px]" style={{ background: SAGE_GREEN }} aria-hidden />
      <div className="container-x relative">
        <div className="max-w-3xl">
          <p className="eyebrow eyebrow-light !text-[#00d639]">L’accompagnement Mediasoft</p>
          <h2 id="s100-ms-title" className="mt-4 font-display text-[clamp(32px,3.8vw,56px)] font-bold leading-[1.04] tracking-[-0.04em] !text-white">
            Le logiciel fait la moitié du chemin. <span style={{ color: SAGE_GREEN }}>Nous faisons l’autre.</span>
          </h2>
          <p className="mt-6 max-w-xl border-l-2 border-[#00d639] pl-5 text-[17px] leading-relaxed text-white/70">
            Depuis 2001, Mediasoft conseille, installe et accompagne les solutions Sage des entreprises tunisiennes, avec des équipes à Tunis et à Sousse.
          </p>
        </div>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-white/10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} className="group relative flex flex-col bg-[#010805] p-8 transition-colors duration-300 hover:bg-[#041a0c] md:p-9">
              <span className="font-display text-[13px] font-bold" style={{ color: SAGE_GREEN }}>0{i + 1}</span>
              <h3 className="mt-5 font-display text-[24px] font-bold tracking-[-0.03em] !text-white">{s.t}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/60">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Sage100Cta() {
  const phone = site.techPhones[0];
  return (
    <section className="bg-white py-[clamp(70px,9vw,120px)]" aria-labelledby="s100-cta-title">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[40px] bg-[#03100a] px-8 py-14 text-white md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-[10%] -top-[40%] h-[140%] w-[60%] rounded-full opacity-30 blur-[120px]" style={{ background: SAGE_GREEN }} aria-hidden />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h2 id="s100-cta-title" className="font-display text-[clamp(32px,4vw,58px)] font-bold leading-[1.02] tracking-[-0.045em] !text-white">
                Voyons ensemble si Sage 100 <span style={{ color: SAGE_GREEN }}>est fait pour vous.</span>
              </h2>
              <p className="mt-5 max-w-lg text-[16.5px] leading-relaxed text-white/65">
                Une démonstration, vos questions, vos contraintes : un consultant Mediasoft vous montre Sage 100 en situation.
              </p>
              <p className="mt-6 text-[14px] text-white/50">
                Vous êtes{" "}
                <SmartLink href={sage100Links.tpe} className="font-semibold text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white">
                  une petite entreprise
                </SmartLink>{" "}
                ou{" "}
                <SmartLink href={sage100Links.pme} className="font-semibold text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white">
                  une PME ou une ETI
                </SmartLink>{" "}
                ?
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
              <a href={links.contact} className="group inline-flex min-h-[56px] items-center justify-between gap-3 rounded-full py-2 pl-7 pr-2 text-[16px] font-semibold text-[#03100a] transition-transform duration-300 hover:scale-[1.03] lg:min-w-[300px]" style={{ background: SAGE_GREEN }}>
                Demander une démo
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#03100a] text-white transition-transform duration-300 group-hover:translate-x-1">
                  <Arrow size={17} />
                </span>
              </a>
              <a href={phone.href} className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-full border border-white/20 px-7 text-[16px] font-semibold text-white transition-colors hover:bg-white/5 lg:min-w-[300px]">
                <Phone size={17} aria-hidden /> {phone.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
