"use client";

import { useState } from "react";
import { links } from "@/lib/site";
import { Arrow } from "@/components/ui";

/* Ce que nous faisons : les métiers de Mediasoft (audit, conseil, personnalisation, formation, support).
   Liste interactive à gauche, grande photo (série validée en noir et blanc aux bleus conservés) à droite. */
const items = [
  {
    title: "Audit & conseil",
    text: "Nous regardons comment vous travaillez avant de recommander quoi que ce soit. Le bon logiciel est celui qui vous ressemble.",
    img: "/img/methode/methode-01-analyse.webp",
    alt: "Bureau vu du dessus : ordinateur portable, carnets et loupe",
  },
  {
    title: "Personnalisation",
    text: "Paramétrage, modules spécifiques, connecteurs : la solution prend la forme de votre entreprise, pas l’inverse.",
    img: "/img/methode/methode-03-realisation.webp",
    alt: "Code source affiché sur un ordinateur portable dans une lumière bleue",
  },
  {
    title: "Formation",
    text: "Un outil n’a de valeur que s’il est adopté. Nous formons vos utilisateurs pour qu’il le soit.",
    img: "/img/methode/methode-02-recherche.webp",
    alt: "Ordinateur portable affichant un tableau de bord",
  },
  {
    title: "Support",
    text: "Help desk, assistance à distance et deux agences : après la mise en service, nous restons là.",
    img: "/img/methode/methode-04-test.webp",
    alt: "Lunettes posées devant un écran affichant du code",
  },
];

export default function Expertise() {
  const [active, setActive] = useState(0);
  return (
    <section className="relative overflow-hidden bg-[#050b16] py-[clamp(80px,10vw,150px)] text-white" aria-labelledby="expertise-title">
      <div className="pointer-events-none absolute right-[-15%] top-[-10%] h-[70%] w-[55%] rounded-full bg-[radial-gradient(circle,rgba(29,111,184,0.28),transparent_65%)]" aria-hidden />
      <div className="container-x relative">
        <p className="eyebrow eyebrow-light">Ce que nous faisons</p>
        <h2 id="expertise-title" className="mt-4 max-w-2xl font-display text-[clamp(32px,3.6vw,54px)] font-bold leading-[1.04] tracking-[-0.035em] !text-white">
          Du premier rendez-vous <span className="text-brand-sky">au quotidien.</span>
        </h2>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <ol className="border-t border-white/10">
            {items.map((it, i) => {
              const on = active === i;
              return (
                <li key={it.title} className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-expanded={on}
                    className="group flex w-full items-baseline gap-5 py-6 text-left md:py-7"
                  >
                    <span className={`font-display text-[14px] font-semibold transition-colors ${on ? "text-accent" : "text-white/35"}`}>0{i + 1}</span>
                    <span className="flex-1">
                      <span className={`block font-display text-[clamp(24px,2.4vw,36px)] font-bold tracking-[-0.03em] transition-colors ${on ? "text-white" : "text-white/45 group-hover:text-white/80"}`}>
                        {it.title}
                      </span>
                      <span className={`grid transition-[grid-template-rows,opacity] duration-500 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <span className="overflow-hidden">
                          <span className="block max-w-md pt-3 text-[16px] leading-relaxed text-white/70">{it.text}</span>
                        </span>
                      </span>
                    </span>
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full transition-all ${on ? "scale-100 bg-accent" : "scale-0 bg-white"}`} aria-hidden />
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="relative aspect-[4/3.4] overflow-hidden rounded-[28px] lg:aspect-auto lg:min-h-[480px]">
            {items.map((it, i) => (
              <img
                key={it.img}
                src={it.img}
                alt={it.alt}
                className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700"
                style={{ opacity: active === i ? 1 : 0, transform: `scale(${active === i ? 1 : 1.06})` }}
                loading="lazy"
                width={1100}
                height={1100}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050b16]/80 via-transparent to-transparent" aria-hidden />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <p className="font-display text-[clamp(22px,2vw,30px)] font-bold">{items[active].title}</p>
              <a href={links.contact} className="btn btn-light !min-h-[44px] shrink-0 !px-5 text-[14.5px]">
                En parler <Arrow size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
