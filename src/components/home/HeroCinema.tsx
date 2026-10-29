"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { links } from "@/lib/site";
import { heroVideo } from "@/lib/showcase";
import { Arrow } from "@/components/ui";

/* Ouverture : décor sombre, le film des logiciels fondu dans le fond,
   et des notifications d'application qui suivent le logiciel à l'écran. */

const signals = [
  { app: "Sage 50c", logo: "/img/logos/logo-ciel.png", text: "Facture client enregistrée", color: "#1f4fd1" },
  { app: "Sage 100c", logo: "/img/logos/Sage_Logo_Brilliant_Green_RGB.webp", text: "Écritures comptables à jour", color: "#00d639" },
  { app: "Divalto", logo: "/img/logos/logo-divalto.png", text: "Niveau de stock recalculé", color: "#f26b2f" },
  { app: "Bitrix24", logo: "/img/logos/logo-bitrix24.png", text: "Nouveau contact ajouté au CRM", color: "#2fc6f6" },
  { app: "Microsoft", logo: "/img/logos/logo-microsoft-365.png", text: "Tableau de bord Power BI partagé", color: "#d83b01" },
  { app: "Mediasoft IA", logo: "/img/logos/logo-mediasoft-2025.png", text: "Agent IA créé pour l’équipe commerciale", color: "#469dd6" },
];

export default function HeroCinema() {
  const video = useRef<HTMLVideoElement>(null);
  const [chapter, setChapter] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [history, setHistory] = useState<number[]>([0]);
  const current = useRef(0);
  const userMuted = useRef(false); // le visiteur a coupé le son lui-même
  const userPaused = useRef(false); // le visiteur a mis la vidéo en pause

  useEffect(() => {
    const v = video.current!;
    // Lecture automatique AVEC le son. Les navigateurs bloquent le son sans action du visiteur :
    // dans ce cas la vidéo démarre sans le son, et le son s'active au premier clic, toucher ou touche du clavier
    // (le défilement et la molette ne comptent pas comme un geste pour les navigateurs).
    let unlock: (() => void) | null = null;
    const events = ["pointerdown", "keydown", "touchend", "click"] as const;
    const stopUnlock = () => unlock && events.forEach((e) => window.removeEventListener(e, unlock!));
    {
      v.muted = false;
      v.play()
        .then(() => {
          setPlaying(true);
          setMuted(false);
        })
        .catch(() => {
          v.muted = true;
          setMuted(true);
          v.play().then(() => setPlaying(true)).catch(() => {});
          unlock = () => {
            stopUnlock();
            if (userMuted.current) return;
            v.muted = false;
            v.play()
              .then(() => {
                setPlaying(true);
                setMuted(v.muted);
              })
              .catch(() => {
                // Son refusé : on reste muet mais la vidéo continue
                v.muted = true;
                setMuted(true);
                v.play().then(() => setPlaying(true)).catch(() => {});
              });
          };
          events.forEach((e) => window.addEventListener(e, unlock!, { passive: true }));
        });
    }
    const onTime = () => {
      let idx = 0;
      heroVideo.chapters.forEach((c, i) => {
        if (v.currentTime >= c.start) idx = i;
      });
      if (current.current !== idx) {
        current.current = idx;
        setChapter(idx);
        setHistory((h) => [idx, ...h.filter((x) => x !== idx)].slice(0, 3));
      }
    };
    v.addEventListener("timeupdate", onTime);
    const sync = () => {
      setMuted(v.muted);
      setPlaying(!v.paused);
    };
    v.addEventListener("volumechange", sync);
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    // Pause quand la vidéo sort de l'écran, reprise quand elle revient (sauf si le visiteur l'a mise en pause)
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) {
        if (!v.paused) {
          v.pause();
          setPlaying(false);
        }
      } else if (!userPaused.current) {
        // Retour sur la vidéo : reprise, avec le son si le navigateur l'autorise (sauf si le visiteur l'a coupé)
        if (!userMuted.current) v.muted = false;
        v.play()
          .then(() => setPlaying(true))
          .catch(() => {
            v.muted = true;
            v.play().then(() => setPlaying(true)).catch(() => {});
          });
      }
    });
    io.observe(v);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("volumechange", sync);
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
      io.disconnect();
      stopUnlock();
    };
  }, []);

  const play = () => video.current!.play().then(() => setPlaying(true)).catch(() => {});
  const togglePlay = () => {
    const v = video.current!;
    if (v.paused) {
      userPaused.current = false;
      play();
    } else {
      userPaused.current = true;
      v.pause();
      setPlaying(false);
    }
  };
  const toggleSound = () => {
    const v = video.current!;
    v.muted = !v.muted;
    userMuted.current = v.muted;
    setMuted(v.muted);
    if (v.paused) play();
  };
  const seek = (i: number) => {
    const v = video.current!;
    v.currentTime = heroVideo.chapters[i].start + 0.05;
    if (v.paused) play();
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#050b16] text-white" aria-labelledby="hero-title">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute right-[-10%] top-[10%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(29,111,184,0.35),transparent_65%)]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[60%] w-[50%] rounded-full bg-[radial-gradient(circle,rgba(242,107,47,0.14),transparent_65%)]" />
        <div className="grid-lines absolute inset-0 opacity-25 [mask-image:radial-gradient(60%_60%_at_70%_45%,black,transparent)]" />
      </div>

      {/* Le film en fond, sur toute la largeur de la page */}
      <video
        ref={video}
        className="absolute inset-0 -z-10 h-full w-full origin-[80%_45%] scale-[1.18] object-cover object-[70%_50%] max-lg:origin-center max-lg:scale-100"
        poster={heroVideo.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Démonstration des logiciels Sage 50c, Sage 100c, Divalto, Bitrix24 et Microsoft (Microsoft 365, Power BI)"
      >
        <source src={heroVideo.srcSm} type="video/mp4" media="(max-width: 767px)" />
        <source src={heroVideo.src} type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#050b16] via-[#050b16]/60 via-35% to-transparent to-60% max-lg:via-[#050b16]/85 max-lg:to-[#050b16]/40" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#050b16] to-transparent" aria-hidden />

      <div className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col">
        {/* Notifications (les 3 dernières, la plus récente en haut) */}
        <ol className="pointer-events-none absolute right-[3%] top-[8%] hidden w-[300px] flex-col gap-2.5 md:flex" aria-live="polite">
          {history.map((idx, k) => {
            const s = signals[idx];
            return (
              <li
                key={idx}
                className="flex items-center gap-3 rounded-2xl bg-white/[0.08] p-3 pr-4 ring-1 ring-white/15 backdrop-blur-xl transition-all duration-700"
                style={{ opacity: 1 - k * 0.3, transform: `scale(${1 - k * 0.04})`, transformOrigin: "top right" }}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white p-1.5">
                  <img src={s.logo} alt="" className="max-h-full max-w-full object-contain" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-white/55">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} aria-hidden />
                    {s.app}
                  </span>
                  <span className="block truncate text-[14px] font-medium text-white">{s.text}</span>
                </span>
              </li>
            );
          })}
        </ol>

        {/* Texte */}
        <div className="container-x relative z-10 flex flex-1 items-center py-12">
          <div className="max-w-[470px]">
            <p className="eyebrow eyebrow-light">Gestion · Web · IA — depuis 2001</p>
            <h1 id="hero-title" className="mt-5 font-display text-[clamp(30px,2.9vw,42px)] font-bold leading-[1.08] tracking-[-0.04em] !text-white">
              Moins de saisie. <span className="text-brand-sky">Plus de décisions.</span>
            </h1>
            <p className="mt-5 max-w-sm text-[15.5px] leading-relaxed text-white/75">
              Sage, Divalto, Bitrix24, Microsoft : Mediasoft installe, adapte et fait vivre les logiciels qui pilotent votre entreprise. Nous développons aussi vos applications web et vos agents IA sur mesure.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href={links.contact} className="btn btn-light !min-h-[48px] !px-6 text-[15px]">
                Parler à un consultant <Arrow />
              </a>
              <a href="#solutions" className="btn btn-outline-light !min-h-[48px] text-[15px]">
                Découvrir nos solutions
              </a>
            </div>
          </div>
        </div>

      {/* Commandes du film */}
      <div className="container-x relative z-10 flex flex-wrap items-center gap-2 pb-8">
        <button
          type="button"
          onClick={togglePlay}
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition-transform hover:scale-105"
          aria-label={playing ? "Mettre la vidéo en pause" : "Lire la vidéo"}
        >
          {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
        </button>
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={!muted}
          aria-label={muted ? "Activer le son" : "Couper le son"}
          title={muted ? "Activer le son" : "Couper le son"}
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition-transform hover:scale-105"
        >
          {muted ? <VolumeX size={18} aria-hidden /> : <Volume2 size={18} aria-hidden />}
        </button>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Choisir un logiciel dans la vidéo">
          {heroVideo.chapters.map((c, i) => (
            <button
              key={c.label}
              type="button"
              onClick={() => seek(i)}
              aria-current={chapter === i ? "true" : undefined}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                chapter === i ? "bg-white text-ink" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
