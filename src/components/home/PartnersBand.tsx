"use client";

import LogoLoop from "@/components/reactbits/LogoLoop";
import { partnerLogos } from "@/lib/site";

/* Réglage optique de chaque logo : une même hauteur ne donne pas une même taille visuelle
   (Bitrix24 très large, Ciel avec son « ! » haut, Sage avec le jambage du « g »).
   h = hauteur de l'image en px ; y = décalage vertical pour aligner les lettres sur une même ligne. */
const optical: Record<string, { h: number; y: number }> = {
  Sage: { h: 28, y: 3 },
  Ciel: { h: 27, y: -1 },
  Divalto: { h: 18, y: 0 },
  "Microsoft 365": { h: 26, y: -1 },
  Bitrix24: { h: 19, y: 0 },
};

export default function PartnersBand() {
  return (
    <section aria-label="Revendeur et partenaire" className="border-y border-line bg-white">
      <div className="container-x flex flex-col items-center gap-3 py-4 md:flex-row md:gap-10">
        <p className="shrink-0 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Revendeur &amp; partenaire</p>
        <div className="w-full min-w-0 flex-1">
          <LogoLoop
            logos={partnerLogos.map((l) => {
              const o = optical[l.alt] ?? { h: 32, y: 0 };
              return {
                href: l.href,
                title: l.alt,
                ariaLabel: l.alt,
                node: (
                  <span className="flex h-[34px] items-center">
                    <img src={l.src} alt={l.alt} draggable={false} className="block w-auto" style={{ height: o.h, transform: `translateY(${o.y}px)` }} />
                  </span>
                ),
              };
            })}
            speed={60}
            logoHeight={34}
            gap={56}
            pauseOnHover
            fadeOut
            fadeOutColor="#ffffff"
            scaleOnHover
            ariaLabel="Nos partenaires éditeurs"
          />
        </div>
      </div>
    </section>
  );
}
