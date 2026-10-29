"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

/* Qui est Mediasoft : fondée en 2001 par des spécialistes de l'informatique et de la gestion.
   Le visuel (dessin fourni par Mediasoft, recréé en SVG animé) en grand à gauche, le texte à droite.
   Quand la section arrive à l'écran : les halos s'allument, les deux cercles glissent et se rejoignent,
   l'intersection bleu marine apparaît, l'orbite se dessine, « mediasoft » et les quatre tuiles arrivent.
   Ensuite : des points tournent sur l'orbite et les tuiles flottent doucement. */

const EASE = "cubic-bezier(.2,.7,.2,1)";
const SHIFT = 150; // distance de départ des cercles (unités du dessin)
const ORBIT =
  "M923.398 422.85 C941.369 594.867 800.405 756.759 608.546 784.445 C416.687 812.132 246.587 695.129 228.616 523.112 C210.645 351.095 351.609 189.204 543.468 161.517 C735.327 133.83 905.427 250.833 923.398 422.85 Z";

const tiles = [
  { x: 127.195, y: 417.967, delay: 1.5 },
  { x: 500.649, y: 120.896, delay: 1.65 },
  { x: 875.753, y: 418.685, delay: 1.8 },
  { x: 501.911, y: 724.134, delay: 1.95 },
];

export default function AboutOrigin() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [motion, setMotion] = useState(true);
  useEffect(() => {
    setMotion(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.35 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const t = (d: number, dur = 1.4) => `transform ${dur}s ${EASE} ${d}s, opacity ${dur}s ${EASE} ${d}s`;
  const slide = (dx: number) => ({ transform: `translateX(${on ? 0 : dx}px)`, transition: t(0.15) });
  const fade = (d: number, dur = 0.9) => ({ opacity: on ? 1 : 0, transition: t(d, dur) });

  return (
    <section className="relative overflow-hidden bg-white py-[clamp(80px,10vw,140px)]" aria-labelledby="about-title">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-12">
        <div className="lg:order-2">
          <p className="eyebrow">Qui sommes-nous</p>
          <h2 id="about-title" className="mt-4 font-display text-[clamp(32px,3.6vw,54px)] font-bold leading-[1.04] tracking-[-0.035em]">
            Nés entre l’informatique <span className="text-accent">et la gestion.</span>
          </h2>
          <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-ink-soft">
            Mediasoft a été fondée en {site.founded} par des spécialistes des deux mondes. Nos consultants lisent un bilan aussi bien qu’un paramétrage, et parlent votre métier avant de parler technique.
          </p>
        </div>

        <div ref={ref} className="relative mx-auto w-full lg:order-1 lg:-ml-6" style={{ maxWidth: "min(820px, calc((100svh - 150px) * 1.28))" }}>
          <svg
            viewBox="60 90 1010 790"
            className="block h-auto w-full overflow-visible"
            role="img"
            aria-label="Mediasoft, à l’intersection de l’informatique (développement, systèmes, réseaux, IA) et de la gestion (comptabilité, finance, commerce, production, paie)"
          >
            <defs>
              <radialGradient id="ao-halo-b" cx="304.007" cy="465.981" r="345.737" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#c4e4ff" stopOpacity="0.85" />
                <stop offset="0.302" stopColor="#c4e4ff" stopOpacity="0.741" />
                <stop offset="1" stopColor="#c4e4ff" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="ao-halo-o" cx="808.399" cy="466.633" r="345.737" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ffd8be" stopOpacity="0.9" />
                <stop offset="0.3018" stopColor="#ffd8be" stopOpacity="0.776" />
                <stop offset="1" stopColor="#ffd8be" stopOpacity="0" />
              </radialGradient>
              <filter id="ao-blur" filterUnits="userSpaceOnUse" x="144.317" y="628.286" width="822" height="168" colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation="18" />
              </filter>
              <linearGradient id="ao-blue" x1="205.317" y1="250.286" x2="649.317" y2="694.286" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#258de8" />
                <stop offset="1" stopColor="#0870d3" />
              </linearGradient>
              <linearGradient id="ao-orange" x1="463.317" y1="250.286" x2="907.317" y2="694.286" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ff9455" />
                <stop offset="1" stopColor="#ff5b32" />
              </linearGradient>
              <linearGradient id="ao-navy" x1="463.317" y1="250.286" x2="907.317" y2="694.286" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#103b79" />
                <stop offset="1" stopColor="#06295f" />
              </linearGradient>
              <linearGradient id="ao-swoosh" x1="498.888" y1="0" x2="613.16" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#0071bc" />
                <stop offset="0.5" stopColor="#77badf" />
                <stop offset="1" stopColor="#e2fbff" />
              </linearGradient>
              {/* L'intersection suit le cercle bleu */}
              <clipPath id="ao-clip-blue">
                <circle cx="427.317" cy="472.286" r="222" style={slide(-SHIFT)} />
              </clipPath>
              <path id="ao-orbit" d={ORBIT} />
            </defs>

            {/* Halos et ombre au sol */}
            <g style={fade(0, 1.2)}>
              <circle cx="304.007" cy="465.981" r="345.737" fill="url(#ao-halo-b)" />
              <circle cx="808.399" cy="466.633" r="345.737" fill="url(#ao-halo-o)" />
              <g filter="url(#ao-blur)">
                <ellipse cx="555.317" cy="712.286" rx="355" ry="28" fill="#14365f" opacity="0.1" />
              </g>
            </g>

            {/* Orbite qui se dessine, arc orange */}
            <path
              d={ORBIT}
              fill="none"
              stroke="#8dbcf0"
              strokeWidth="1.3"
              opacity="0.9"
              pathLength={1}
              strokeDasharray="1"
              style={{ strokeDashoffset: on ? 0 : 1, transition: `stroke-dashoffset 2s ${EASE} 0.5s` }}
            />
            <path d="M594.697 164.422 C700.548 169.608 784.391 234.434 837.841 317.411" fill="none" stroke="#ffb38b" strokeWidth="1.3" style={fade(1.6)} />

            {/* Points sur l'orbite : ils tournent lentement */}
            <g style={fade(1.2)}>
              {[
                { c: "#075ab5", b: 0 },
                { c: "#ff6b2e", b: -9 },
                { c: "#075ab5", b: -18 },
                { c: "#ff6b2e", b: -27 },
              ].map((d, i) =>
                motion ? (
                  <circle key={i} r="5" fill={d.c}>
                    <animateMotion dur="36s" begin={`${d.b}s`} repeatCount="indefinite">
                      <mpath href="#ao-orbit" />
                    </animateMotion>
                  </circle>
                ) : (
                  <circle key={i} r="5" fill={d.c} cx={[393, 747, 415, 737][i]} cy={[230, 202, 753, 721][i]} />
                )
              )}
            </g>

            {/* Cercle Informatique */}
            <g style={slide(-SHIFT)}>
              <circle cx="427.317" cy="472.286" r="222" fill="url(#ao-blue)" />
            </g>
            {/* Cercle Gestion */}
            <g style={slide(SHIFT)}>
              <circle cx="685.317" cy="472.286" r="222" fill="url(#ao-orange)" />
            </g>
            {/* Intersection bleu marine */}
            <g clipPath="url(#ao-clip-blue)">
              <circle cx="685.317" cy="472.286" r="222" fill="url(#ao-navy)" style={slide(SHIFT)} />
            </g>
            <g style={slide(-SHIFT)}>
              <circle cx="427.317" cy="472.286" r="222" fill="none" stroke="#fff" strokeOpacity="0.78" strokeWidth="2" />
              <g fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="340.317" y="367.286" width="44" height="31" rx="2" />
                <path d="M335.317 403.286 L389.317 403.286 L385.317 408.286 L339.317 408.286 Z" />
              </g>
              <g fill="#fff" textAnchor="middle">
                <text x="360.317" y="439.286" fontSize="27" fontWeight="700" style={{ fontFamily: "var(--font-display), Arial, sans-serif" }}>Informatique</text>
                <g fontSize="18" style={{ fontFamily: "var(--font-body), Arial, sans-serif" }}>
                  <text x="360.317" y="493.286">Développement,</text>
                  <text x="360.317" y="518.286">systèmes, réseaux, IA</text>
                </g>
              </g>
            </g>
            <g style={slide(SHIFT)}>
              <circle cx="685.317" cy="472.286" r="222" fill="none" stroke="#fff" strokeOpacity="0.78" strokeWidth="2" />
              <g fill="none" stroke="#fff" strokeWidth="3.5" strokeLinejoin="round">
                <rect x="765.317" y="390.286" width="9" height="18" rx="1" />
                <rect x="780.317" y="378.286" width="9" height="30" rx="1" />
                <rect x="795.317" y="366.286" width="9" height="42" rx="1" />
              </g>
              <g fill="#fff" textAnchor="middle">
                <text x="782.317" y="439.286" fontSize="27" fontWeight="700" style={{ fontFamily: "var(--font-display), Arial, sans-serif" }}>Gestion</text>
                <g fontSize="18" style={{ fontFamily: "var(--font-body), Arial, sans-serif" }}>
                  <text x="782.317" y="480.286">Comptabilité,</text>
                  <text x="782.317" y="505.286">finance, commerce,</text>
                  <text x="782.317" y="530.286">production, paie</text>
                </g>
              </g>
            </g>

            {/* « mediasoft » au centre, puis son trait */}
            <g style={{ ...fade(1.25, 0.8), transform: on ? "none" : "translateY(10px)" }}>
              <text x="555.317" y="471.411" fontSize="29" fontWeight="700" letterSpacing="0.3" fill="#fff" textAnchor="middle" style={{ fontFamily: "var(--font-display), Arial, sans-serif" }}>
                mediasoft
              </text>
            </g>
            <path
              d="M502.034 485.197 C538.057 502.588 573.99 502.588 610.013 485.197 C611.008 484.717 612.204 485.134 612.684 486.129 C613.164 487.123 612.747 488.319 611.752 488.799 C574.63 506.72 537.417 506.72 500.295 488.799 C499.3 488.319 498.883 487.123 499.363 486.129 C499.843 485.134 501.039 484.717 502.034 485.197"
              fill="url(#ao-swoosh)"
              style={{ clipPath: on ? "inset(0 0 0 0)" : "inset(0 100% 0 0)", transition: `clip-path 0.9s ${EASE} 1.55s` }}
            />

            {/* Quatre tuiles : elles apparaissent l'une après l'autre, puis flottent */}
            {tiles.map((p, i) => (
              <g
                key={i}
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transform: on ? "scale(1)" : "scale(0.4)",
                  opacity: on ? 1 : 0,
                  transition: `transform 0.7s cubic-bezier(.34,1.56,.64,1) ${p.delay}s, opacity 0.5s ease ${p.delay}s`,
                }}
              >
                <g className={motion ? "ao-float" : ""} style={{ animationDelay: `${i * -1.1}s` }}>
                  <rect x={p.x} y={p.y} width="108.541" height="108.541" rx="25.242" fill="#fff" style={{ filter: "drop-shadow(0 10px 18px rgba(20,54,95,0.12))" }} />
                  {i === 0 && (
                    <g fill="none" stroke="#12417c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="156.223" y="441.995" width="50.484" height="15.145" rx="3.786" />
                      <rect x="156.223" y="463.451" width="50.484" height="15.145" rx="3.786" />
                      <rect x="156.223" y="484.907" width="50.484" height="15.145" rx="3.786" />
                      <path d="M166.32 449.568 L168.844 449.568 M175.155 449.568 L177.679 449.568 M166.32 471.023 L168.844 471.023 M175.155 471.023 L177.679 471.023 M166.32 492.479 L168.844 492.479 M175.155 492.479 L177.679 492.479" />
                    </g>
                  )}
                  {i === 1 && (
                    <path d="M533.988 185.264 C520.105 185.264 521.367 162.546 539.036 162.546 C542.823 144.876 570.589 149.925 571.851 166.332 C589.521 166.332 588.258 186.526 573.113 186.526 Z" fill="none" stroke="#12417c" strokeWidth="3.5" strokeLinejoin="round" />
                  )}
                  {i === 2 && (
                    <g fill="none" stroke="#12417c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="930.664" cy="459.975" r="10.097" />
                      <circle cx="953.382" cy="466.286" r="8.835" />
                      <circle cx="910.471" cy="466.286" r="8.835" />
                      <path d="M912.995 492.79 L912.995 485.217 C912.995 475.12 921.83 470.072 930.664 470.072 C939.499 470.072 948.334 475.12 948.334 485.217 L948.334 492.79 M896.587 494.052 L896.587 487.741 C896.587 481.431 901.636 476.382 909.209 475.12 M967.265 494.052 L967.265 487.741 C967.265 481.431 962.217 476.382 954.644 475.12" />
                    </g>
                  )}
                  {i === 3 && (
                    <g fill="none" stroke="#12417c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M556.182 753.162 L580.162 761.997 L580.162 780.928 C580.162 796.074 567.541 804.908 556.182 811.219 C544.823 804.908 532.202 796.074 532.202 780.928 L532.202 761.997 Z" />
                      <path d="M544.823 780.928 L552.395 788.501 L567.541 770.832" />
                    </g>
                  )}
                </g>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
