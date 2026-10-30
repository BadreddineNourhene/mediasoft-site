import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { links } from "@/lib/site";
import BlurText from "@/components/reactbits/BlurText";

const NIGHT = "#071a33";

/* En-tête des pages intérieures : fil d'Ariane, titre, texte d'introduction, actions, visuel. */
export default function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  actions,
  visual,
  background,
  tone = "light",
  eyebrowColor,
  leadClassName = "",
  wide = false,
}: {
  crumbs: { label: string; href?: string }[];
  /** Surtitre au-dessus du titre ; facultatif. */
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  actions?: ReactNode;
  visual?: ReactNode;
  /** Fond propre à une page ; sinon le dégradé et la grille par défaut. */
  background?: ReactNode;
  /** « dark » : en-tête bleu nuit (halos et grille fine), textes clairs. */
  tone?: "light" | "dark";
  /** Couleur du surtitre, pour une page aux couleurs d'un éditeur. */
  eyebrowColor?: string;
  /** Classes en plus pour le texte d'introduction (taille, largeur). */
  leadClassName?: string;
  /** Bloc de texte plus large (le chapeau tient sur moins de lignes) */
  wide?: boolean;
}) {
  const dark = tone === "dark";
  const defaultBackground = dark ? (
    <>
      <div className="absolute inset-0 -z-20" style={{ background: NIGHT }} aria-hidden />
      <div className="pointer-events-none absolute -right-[8%] -top-[45%] -z-10 h-[90%] w-[60vw] rounded-full bg-brand-sky opacity-[0.28] blur-[120px]" aria-hidden />
      <div className="pointer-events-none absolute -bottom-[55%] -left-[12%] -z-10 h-[90%] w-[45vw] rounded-full bg-brand opacity-[0.3] blur-[120px]" aria-hidden />
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-[0.6] [mask-image:radial-gradient(75%_90%_at_80%_20%,black,transparent)]" aria-hidden />
    </>
  ) : (
    <>
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(110%_90%_at_85%_0%,var(--mist-2)_0%,var(--paper)_62%)]" aria-hidden />
      <div className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(70%_80%_at_80%_20%,black,transparent)]" aria-hidden />
    </>
  );
  return (
    <section
      className={`relative isolate overflow-hidden border-b ${dark ? "border-white/10 text-white" : "border-line"}`}
      aria-labelledby="page-title"
    >
      {background ?? defaultBackground}
      <div className={`container-x grid gap-12 pb-16 pt-10 md:pb-24 md:pt-14 ${visual ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center" : ""}`}>
        <div className={wide ? "max-w-5xl" : "max-w-3xl"}>
          <nav aria-label="Fil d’Ariane">
            <ol className={`flex flex-wrap items-center gap-1.5 text-[13.5px] ${dark ? "text-white/60" : "text-ink-soft"}`}>
              <li>
                <a href={links.home} className={dark ? "hover:text-white" : "hover:text-brand"}>Accueil</a>
              </li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  <ChevronRight size={14} aria-hidden />
                  {c.href ? (
                    <a href={c.href} className={dark ? "hover:text-white" : "hover:text-brand"}>{c.label}</a>
                  ) : (
                    <span aria-current="page" className={`font-medium ${dark ? "text-white" : "text-ink"}`}>{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          {eyebrow && (
            <span className={`eyebrow mt-12 ${dark ? "eyebrow-light" : ""}`} style={eyebrowColor ? { color: eyebrowColor } : undefined}>
              {eyebrow}
            </span>
          )}
          <h1 id="page-title" className={`h-giant ${eyebrow ? "mt-6" : "mt-12"} !text-[clamp(44px,6.2vw,100px)] ${dark ? "!text-white" : ""}`}>{title}</h1>
          {lead && (
            <BlurText
              text={lead}
              animateBy="words"
              delay={12}
              stepDuration={0.28}
              trigger="load"
              className={`lead mt-6 max-w-2xl ${dark ? "!text-white/70" : ""} ${leadClassName}`}
            />
          )}
          {actions && <div className="mt-9 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {visual && <div className="relative">{visual}</div>}
      </div>
    </section>
  );
}
