"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { showcases, type Showcase } from "@/lib/showcase";
import { Arrow, SmartLink } from "@/components/ui";
import M365Orbit from "@/components/visual/M365Orbit";
import Laptop from "@/components/visual/Laptop";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* « Nos solutions. » : titre géant fixe, panneaux produits qui défilent à l'horizontale (ordinateur)
   ou s'empilent (mobile). Chaque panneau a sa couleur et ses vraies captures. */

/* Capture posée telle quelle, sans cadre de fenêtre : coins arrondis et ombre pour les écrans à plat,
   simple ombre portée pour les appareils détourés (ordinateur sans fond).
   « box » : même format pour la 2e capture de chaque panneau (celui de la capture Sage 100c, 1,57:1), cadrée en haut à gauche. */
function Shot({ src, alt, box = false }: { src: string; alt: string; box?: boolean }) {
  const cutout = src.includes("-detoure");
  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      className={`block h-auto w-full ${box ? "aspect-[1.57/1] object-cover object-left-top" : ""} ${cutout ? "drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]" : "rounded-[14px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] ring-1 ring-black/10"}`}
    />
  );
}

/* Agrandir une capture au clic : la vignette du panneau est réduite, le clic l'ouvre en pleine qualité. */
/* Captures fixes dans le panneau : pas d'agrandissement au clic (demande de Mediasoft). */
function Zoomable({ children }: { src: string; alt: string; children: ReactNode }) {
  return <div className="relative block w-full">{children}</div>;
}


function Screens({ s }: { s: Showcase }) {
  if (s.visual === "m365") return <M365Orbit className="mx-auto lg:!max-w-[min(540px,calc(100svh-215px))]" />;
  const [a, b, c] = s.screens!;
  return (
    <div className="relative mx-auto aspect-[1.25/1] w-full max-w-[640px]">
      <div data-par="0.4" className="absolute left-[0%] top-[4%] w-[80%]">
        <Zoomable src={a.src} alt={a.alt}>
          <Laptop src={a.src} alt={a.alt} eager />
        </Zoomable>
      </div>
      {b && (
        <div data-par="0.9" className="absolute bottom-[6%] right-[0%] w-[56%]">
          <Zoomable src={b.src} alt={b.alt}>
            <Shot src={b.src} alt={b.alt} box={!b.fit} />
          </Zoomable>
        </div>
      )}
      {c && (
        <div data-par="1.3" className="absolute bottom-[0%] left-[4%] w-[40%]">
          <Zoomable src={c.src} alt={c.alt}>
            <Shot src={c.src} alt={c.alt} />
          </Zoomable>
        </div>
      )}
    </div>
  );
}

function Panel({ s }: { s: Showcase }) {
  const dark = s.theme === "dark";
  return (
    <article
      data-panel
      className="relative flex w-full shrink-0 flex-col overflow-hidden rounded-[32px] lg:h-full lg:min-h-0 lg:w-[82vw] lg:max-w-[1320px] lg:flex-row"
      style={{ background: s.bg, color: s.ink }}
      aria-label={s.name}
    >
      <div className="relative z-10 flex flex-col p-8 md:p-12 lg:w-[42%] lg:justify-between lg:p-14 lg:[@media(max-height:820px)]:p-9 lg:[@media(max-height:680px)]:p-7">
        <div>
          <div className="flex items-center gap-4">
            <span className={`grid h-14 min-w-14 place-items-center rounded-2xl px-3 ${dark ? "bg-white" : "bg-white ring-1 ring-black/5"}`}>
              <img src={s.logo} alt="" className="max-h-8 w-auto max-w-[96px]" loading="lazy" />
            </span>
            <span className="font-display text-[15px] font-semibold opacity-60">{s.index} / {String(showcases.length).padStart(2, "0")}</span>
          </div>
          <h3 className="mt-8 font-display text-[clamp(34px,3.6vw,56px)] lg:[@media(max-height:820px)]:mt-5 lg:[@media(max-height:820px)]:text-[40px] lg:[@media(max-height:680px)]:mt-3 lg:[@media(max-height:680px)]:text-[32px] font-bold leading-[0.95] tracking-[-0.045em]" style={{ color: s.ink }}>
            {s.name}
          </h3>
          <p className="mt-5 max-w-sm text-[clamp(19px,1.7vw,26px)] font-semibold leading-snug lg:[@media(max-height:820px)]:mt-3 lg:[@media(max-height:820px)]:text-[19px]" style={{ color: s.ink }}>
            {s.tagline}
          </p>
          <p className="mt-3 max-w-sm text-[15.5px] leading-relaxed lg:[@media(max-height:720px)]:hidden" style={{ color: s.ink, opacity: 0.7 }}>
            {s.pitch}
          </p>
          <ul className="mt-7 flex flex-wrap gap-2 lg:[@media(max-height:820px)]:mt-4 lg:[@media(max-height:680px)]:mt-3 lg:[@media(max-height:680px)]:gap-1.5">
            {s.chips.map((c) => (
              <li key={c} className="chip" style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.85)", color: s.ink }}>
                <span className="h-2 w-2 rounded-full" style={{ background: s.accent }} aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <SmartLink
          href={s.href}
          className="group mt-10 inline-flex w-fit lg:[@media(max-height:820px)]:mt-5 lg:[@media(max-height:680px)]:mt-3 items-center gap-3 rounded-full py-3 pl-6 pr-3 text-[15.5px] font-semibold transition-transform duration-300 hover:scale-[1.03]"
          style={{ background: s.accent, color: s.key === "sage100" ? "#0b1a2e" : "#fff" }}
        >
          Découvrir {s.name}
          <span className="grid h-9 w-9 place-items-center rounded-full bg-black/15 transition-transform duration-300 group-hover:translate-x-1">
            <Arrow size={16} />
          </span>
        </SmartLink>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-6 pb-10 lg:px-10 lg:pb-0">
        <div
          className="pointer-events-none absolute right-[-10%] top-1/2 aspect-square w-[80%] -translate-y-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: s.accent }}
          aria-hidden
        />
        <div className="relative mx-auto w-full lg:max-w-[min(100%,calc((100svh-260px)*1.25))]">
          <Screens s={s} />
        </div>
      </div>
    </article>
  );
}

export default function SolutionsRail() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth + 48;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top+=60",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const n = Math.min(showcases.length, Math.floor(self.progress * showcases.length) + 1);
              const out = root.current?.querySelector("[data-count]");
              if (out) out.textContent = String(n).padStart(2, "0");
              gsap.set("[data-progress]", { scaleX: self.progress });
            },
          },
        });
        // Pas de parallaxe sur les captures : un décalage d'une fraction de pixel rend leur texte flou.
      });
    },
    { scope: root }
  );

  return (
    <>
    <section id="solutions" ref={root} className="relative overflow-hidden bg-paper py-16 lg:flex lg:h-[calc(100svh-60px)] lg:flex-col lg:py-0" aria-labelledby="solutions-title">
      <div className="container-x flex shrink-0 items-end justify-between gap-6 lg:pb-6 lg:pt-8">
        <h2 id="solutions-title" className="font-display text-[clamp(30px,3.4vw,50px)] font-bold leading-[1.05] tracking-[-0.035em]">
          Intégration de logiciels de gestion
        </h2>
        <div className="hidden items-center gap-4 pb-2 lg:flex" aria-hidden>
          <span className="font-display text-[15px] font-semibold text-ink">
            <span data-count>01</span> <span className="text-ink-soft">/ {String(showcases.length).padStart(2, "0")}</span>
          </span>
          <span className="h-[3px] w-40 overflow-hidden rounded-full bg-line">
            <span data-progress className="block h-full origin-left scale-x-0 bg-brand" />
          </span>
        </div>
      </div>

      <div className="lg:min-h-0 lg:flex-1 lg:pb-8">
        <div ref={track} className="container-x mt-10 grid gap-5 lg:mt-0 lg:flex lg:h-full lg:w-max lg:max-w-none lg:gap-6 lg:pl-[max(32px,calc((100vw-1240px)/2+32px))] lg:pr-12">
          {showcases.map((s) => (
            <Panel key={s.key} s={s} />
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
