import { Download, Headset, Phone } from "lucide-react";
import { links } from "@/lib/site";
import { Arrow, SmartLink } from "@/components/ui";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

/* « Nous sommes là » : bandeau d'assistance présent sur toutes les pages du site d'origine. */
export function SupportBand({ whatsapp = links.whatsapp }: { whatsapp?: string }) {
  const items = [
    {
      href: links.supportDownload,
      Icon: Download,
      title: "Télécharger Mediasoft Support",
      text: "Assistance à distance (TeamViewer)",
      accent: false,
    },
    { href: whatsapp, Icon: Phone, title: "Appelez-nous", text: "Par WhatsApp", accent: true },
    { href: links.helpdesk, Icon: Headset, title: "Assistance Help desk", text: "helpdesk-ms.com", accent: false },
  ];
  return (
    <section className="border-y border-line bg-mist" aria-labelledby="support-title">
      <div className="container-x grid gap-10 py-16 lg:grid-cols-[0.8fr_2fr] lg:items-center lg:py-20">
        <div>
          <span className="eyebrow">Assistance</span>
          <h2 id="support-title" className="mt-4 text-[clamp(30px,3.4vw,44px)]">Nous sommes là</h2>
          <p className="mt-3 text-ink-soft">Support Mediasoft en ligne</p>
        </div>
        <AnimatedContent stagger={0.08} distance={24} duration={0.7} className="grid gap-4 md:grid-cols-3">
          {items.map(({ href, Icon, title, text, accent }) => (
            <SmartLink
              key={title}
              href={href}
              className="card group flex h-full flex-col gap-5 p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_24px_50px_-30px_rgb(11_26_46/0.4)]"
            >
              <span className={`icon-tile ${accent ? "is-accent" : ""}`}>
                <Icon size={22} aria-hidden />
              </span>
              <span>
                <span className="flex items-center gap-2 font-semibold text-ink group-hover:text-brand">
                  {title} <Arrow size={16} />
                </span>
                <span className="mt-1 block text-[14.5px] text-ink-soft">{text}</span>
              </span>
            </SmartLink>
          ))}
        </AnimatedContent>
      </div>
    </section>
  );
}

/* « MediaSoft vous écoute. » : appel à l'action final du site d'origine. */
export function ListenCta({
  label = "Contactez-nous",
  theme,
}: {
  label?: string;
  /** Couleurs d'un éditeur (fond nuit + couleur vive), par ex. Power BI ; sinon bleu nuit Mediasoft. */
  theme?: { night: string; accent: string; accentRgb: string };
}) {
  return (
    <section className="container-x py-20 md:py-28">
      <div
        className={`relative isolate overflow-hidden rounded-[28px] px-6 py-16 text-white md:px-16 md:py-24 ${theme ? "" : "bg-night"}`}
        style={theme ? { background: theme.night } : undefined}
      >
        <img
          src="/img/photos/bureaux.webp"
          alt=""
          className={`absolute inset-0 -z-20 h-full w-full object-cover opacity-35 ${theme ? "grayscale" : ""}`}
          loading="lazy"
          width={1600}
          height={840}
        />
        {theme ? (
          <div
            className="absolute inset-0 -z-10"
            style={{ background: `linear-gradient(100deg, ${theme.night} 25%, ${theme.night}bf 60%, rgb(${theme.accentRgb} / 0.4))` }}
            aria-hidden
          />
        ) : (
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,var(--night)_25%,rgb(8_20_38/0.75)_60%,rgb(29_111_184/0.45))]" aria-hidden />
        )}
        <div className="max-w-2xl">
          <span className="eyebrow eyebrow-light" style={theme ? { color: theme.accent } : undefined}>
            Parlons-en
          </span>
          <h2 className="mt-5 font-display text-[clamp(30px,3.4vw,50px)] font-bold leading-[1.05] tracking-[-0.035em] !text-white">Un projet en tête&nbsp;?</h2>
          <p className="lead mt-5 !text-white/75">
            Décrivez-nous votre activité : nous vous dirons quels outils peuvent vous faire gagner du temps.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href={links.contact} className={`btn ${theme ? "" : "btn-light"}`} style={theme ? { background: theme.accent, color: theme.night } : undefined}>
              {label} <Arrow />
            </a>
            <SmartLink href={links.helpdesk} className="btn btn-outline-light">
              <Headset size={18} aria-hidden /> Assistance Help desk
            </SmartLink>
          </div>
        </div>
      </div>
    </section>
  );
}
