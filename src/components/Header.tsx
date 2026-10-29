"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Headset, Mail, MapPin, Menu, X } from "lucide-react";
import { links, nav, site, type NavItem } from "@/lib/site";
import { editorTheme } from "@/lib/editorTheme";
import { Arrow, FacebookIcon, LinkedinIcon, SmartLink, WhatsappIcon } from "@/components/ui";

// Plans Google Maps des deux agences (bandeau du haut)
const MAP_TUNIS = "https://www.google.com/maps?ll=36.85705,10.160652&z=15&t=m&hl=fr&gl=TN&mapclient=embed&cid=14338673014987496657";
const MAP_SOUSSE = "https://www.google.com/maps?ll=35.823281,10.607302&z=16&t=m&hl=fr&gl=US&mapclient=embed&q=Immeuble+Marwa,+Avenue+Yasser+Arafat,+Sahloul,+Sousse,+Tunisie";

// Couleurs des barres : celles de l'éditeur de la page (voir lib/editorTheme).

export default function Header({ current = "" }: { current?: string }) {
  const bar = editorTheme(current);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    document.documentElement.style.overflow = mobile ? "hidden" : "";
    if (mobile) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobile(false);
        setOpen(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobile]);

  const enter = (key: string) => {
    window.clearTimeout(closeTimer.current);
    setOpen(key);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setOpen(null), 140);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-xl focus:bg-ink focus:px-4 focus:py-3 focus:font-semibold focus:text-white"
      >
        Aller au contenu
      </a>

      {/* Bandeau d'informations et menu forment un seul bloc collant : en défilant, le bandeau (40 px) sort par le haut
          et seul le menu reste fixé en haut de l’écran. */}
      <div className="sticky top-0 z-50 lg:top-[-40px]" style={{ ["--bar" as string]: bar.ink, ["--bar-bg" as string]: bar.bg, ["--bar-accent" as string]: bar.accent }}>
      <div className="hidden [background:var(--bar-bg)] text-[13.5px] text-white/70 lg:block">
        <div className="container-x flex h-10 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-white">
              <Mail size={15} aria-hidden /> {site.email}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin size={15} aria-hidden />
              <SmartLink href={MAP_TUNIS} className="hover:text-white" aria-label="Agence d’Ennasr II, Ariana sur Google Maps">Ennasr II, Ariana</SmartLink>
              ·
              <SmartLink href={MAP_SOUSSE} className="hover:text-white" aria-label="Agence de Sahloul, Sousse sur Google Maps">Sahloul, Sousse</SmartLink>
            </span>
          </div>
          <div className="flex items-center gap-5">
            <SmartLink href={links.helpdesk} className="inline-flex items-center gap-2 font-medium text-white hover:text-[#7cc4f5]">
              <Headset size={15} aria-hidden /> Assistance Help desk
            </SmartLink>
            <span className="h-4 w-px bg-white/20" aria-hidden />
            <SmartLink href={links.facebook} aria-label="Facebook" className="hover:text-white">
              <FacebookIcon width={16} height={16} />
            </SmartLink>
            <SmartLink href={links.linkedin} aria-label="LinkedIn" className="hover:text-white">
              <LinkedinIcon width={16} height={16} />
            </SmartLink>
            <SmartLink href={links.whatsapp} aria-label="WhatsApp" className="hover:text-white">
              <WhatsappIcon width={16} height={16} />
            </SmartLink>
          </div>
        </div>
      </div>

      <header
        className={`relative transition-[background-color,box-shadow] duration-300 ${
          scrolled || mobile
            ? "border-t border-white/[0.08] [background:var(--bar-bg)] shadow-[0_14px_30px_-18px_rgb(0_0_0/0.6)]"
            : "border-t border-white/[0.08] [background:var(--bar-bg)]"
        }`}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <a href={links.home} className="flex shrink-0 items-center" aria-label="Mediasoft — accueil">
            <img src="/img/logos/logo-mediasoft-blanc.png" alt="Mediasoft" width={589} height={71} className="h-6 w-auto md:h-[26px]" />
          </a>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <DesktopItem
                  key={item.key}
                  item={item}
                  active={current === item.key}
                  open={open === item.key}
                  onEnter={() => enter(item.key)}
                  onLeave={leave}
                  onToggle={() => setOpen(open === item.key ? null : item.key)}
                />
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a href={links.contact} className="btn hidden !min-h-[32px] !gap-1 !bg-white !px-3.5 !py-0 !text-[12.5px] !text-[var(--bar)] hover:!bg-[#e6f0ff] sm:inline-flex">
              Contactez-nous <Arrow size={12} />
            </a>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5 text-white lg:hidden"
              aria-expanded={mobile}
              aria-controls="menu-mobile"
              aria-label={mobile ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

      </header>
      </div>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        className={`fixed inset-0 z-40 overflow-y-auto bg-white pt-[calc(var(--header-h)+48px)] transition-[opacity,visibility] duration-300 lg:hidden ${
          mobile ? "visible opacity-100" : "invisible opacity-0"
        }`}
        data-lenis-prevent
      >
        <nav aria-label="Navigation mobile" className="container-x pb-10 pt-4">
          <ul className="divide-y divide-line">
            {nav.map((item) => (
              <MobileItem key={item.key} item={item} active={current === item.key} />
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <a href={links.contact} className="btn btn-primary w-full">
              Contactez-nous <Arrow size={12} />
            </a>
            <SmartLink href={links.helpdesk} className="btn btn-ghost w-full">
              <Headset size={18} aria-hidden /> Assistance Help desk
            </SmartLink>
          </div>
          <p className="mt-8 text-sm text-ink-soft">
            <a href={`mailto:${site.email}`} className="font-medium text-ink">{site.email}</a>
            <br />
            {site.techPhones.map((p) => p.label).join(" · ")}
          </p>
        </nav>
      </div>
    </>
  );
}

function DesktopItem({
  item,
  active,
  open,
  onEnter,
  onLeave,
  onToggle,
}: {
  item: NavItem;
  active: boolean;
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onToggle: () => void;
}) {
  const base =
    "relative inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[15px] font-medium transition-colors duration-200";
  const tone = active ? "text-white" : "text-white/75 hover:text-white";
  const dot = active ? (
    <span className="absolute bottom-1 left-1/2 h-[3px] w-4 -translate-x-1/2 rounded-full bg-[var(--bar-accent)]" aria-hidden />
  ) : null;

  if (!item.children) {
    return (
      <li>
        <SmartLink href={item.href!} className={`${base} ${tone}`} aria-current={active ? "page" : undefined}>
          {item.label}
          {dot}
        </SmartLink>
      </li>
    );
  }

  return (
    <li className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button type="button" className={`${base} ${tone}`} aria-expanded={open} onClick={onToggle}>
        {item.label}
        <ChevronDown size={15} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden />
        {dot}
      </button>
      <div
        className={`absolute left-1/2 top-full w-[440px] -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-300 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <ul className="card overflow-hidden p-2 shadow-[0_30px_60px_-30px_rgb(11_26_46/0.45)]">
          {item.children.map((c) => (
            <li key={c.label}>
              <SmartLink
                href={c.href}
                className="group flex items-start gap-4 rounded-2xl p-4 transition-colors hover:bg-mist"
              >
                <span className="grid h-12 w-16 shrink-0 place-items-center rounded-xl border border-line bg-white p-2">
                  {c.logo ? <img src={c.logo} alt="" className="max-h-7 w-auto" loading="lazy" /> : <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />}
                </span>
                <span>
                  <span className="flex items-center gap-2 font-semibold text-ink group-hover:text-brand">
                    {c.label}
                    <Arrow size={15} />
                  </span>
                  <span className="mt-1 block text-[13.5px] leading-snug text-ink-soft">{c.text}</span>
                </span>
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function MobileItem({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  if (!item.children) {
    return (
      <li>
        <SmartLink
          href={item.href!}
          className={`flex items-center justify-between py-4 text-xl font-semibold ${active ? "text-brand" : "text-ink"}`}
          aria-current={active ? "page" : undefined}
        >
          {item.label}
        </SmartLink>
      </li>
    );
  }
  return (
    <li>
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left text-xl font-semibold text-ink"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {item.label}
        <ChevronDown size={20} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      <ul className={`grid gap-2 overflow-hidden transition-all duration-300 ${open ? "pb-4" : "hidden"}`}>
        {item.children.map((c) => (
          <li key={c.label}>
            <SmartLink href={c.href} className="flex items-center gap-4 rounded-2xl bg-mist p-3">
              <span className="grid h-10 w-14 shrink-0 place-items-center rounded-lg bg-white p-1.5">
                {c.logo ? <img src={c.logo} alt="" className="max-h-6 w-auto" loading="lazy" /> : <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />}
              </span>
              <span className="font-semibold text-ink">{c.label}</span>
            </SmartLink>
          </li>
        ))}
      </ul>
    </li>
  );
}
