"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MessageCircle, UserPlus, CheckCircle2, Phone, Video, Paperclip, Globe, ShoppingBag, CalendarDays, Clock3, Check, ShoppingCart, LayoutGrid, Type, Image as ImageIcon, MousePointer2, Plus } from "lucide-react";
import { Arrow } from "@/components/ui";
import AppWindow from "@/components/visual/AppWindow";
import { links, site } from "@/lib/site";
import { b24benefits, b24caps, b24editions, b24services, b24tools, B24_CYAN, B24_NIGHT, type B24Tool } from "@/lib/bitrix24";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Bitrix24 : ouverture sombre (cyan Bitrix24), rail des six univers, avantages en cartes empilées,
   les deux versions, l'accompagnement Mediasoft et le contact. */

const CYAN = B24_CYAN;
const NIGHT = B24_NIGHT;

/* ---------- Ouverture ---------- */
export function B24Hero() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from("[data-l] > span", { yPercent: 110, duration: 1, stagger: 0.12 })
          .from("[data-f]", { y: 18, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.6")
          .from("[data-s]", { y: 40, opacity: 0, duration: 1, stagger: 0.12 }, "-=0.8");
      });
    },
    { scope: root }
  );
  const notes = [
    { icon: UserPlus, k: "CRM", t: "Nouveau prospect depuis le site", pos: "right-[-4%] top-[-7%]" },
    { icon: MessageCircle, k: "Centre de contact", t: "Message WhatsApp reçu", pos: "right-[-2%] top-[34%]" },
    { icon: CheckCircle2, k: "Tâches", t: "Devis envoyé au client", pos: "right-[8%] bottom-[-10%]" },
  ];
  return (
    <section ref={root} className="relative overflow-hidden pb-[clamp(60px,7vw,100px)] pt-[clamp(48px,6vw,84px)] text-white" style={{ background: NIGHT }} aria-labelledby="b24-title">
      <div className="pointer-events-none absolute -right-[10%] top-[-20%] h-[80vh] w-[70vw] rounded-full opacity-[0.22] blur-[120px]" style={{ background: CYAN }} aria-hidden />
      <div className="pointer-events-none absolute -left-[15%] bottom-[-30%] h-[60vh] w-[50vw] rounded-full bg-brand opacity-[0.25] blur-[120px]" aria-hidden />
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div>
          <p data-f className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-white/80">
            <span className="grid h-7 place-items-center rounded-full bg-white px-2.5">
              <img src="/img/logos/logo-bitrix24.png" alt="Bitrix24" className="h-3.5 w-auto" />
            </span>
            Partenaire Bitrix24 en Tunisie
          </p>
          <h1 id="b24-title" className="mt-7 font-display text-[clamp(38px,4.4vw,64px)] font-bold leading-[1.02] tracking-[-0.045em] !text-white">
            <span data-l className="block overflow-hidden pb-[0.06em]">
              <span className="block">Vos clients, vos équipes,</span>
            </span>
            <span data-l className="block overflow-hidden pb-[0.06em]">
              <span className="block" style={{ color: CYAN }}>
                un seul espace de travail.
              </span>
            </span>
          </h1>
          <p data-f className="mt-6 max-w-[520px] text-[clamp(16.5px,1.3vw,19px)] leading-relaxed text-white/70">
            CRM, centre de contact, tâches, messagerie, RH et site web : Bitrix24 réunit tous les outils de votre entreprise. Mediasoft le paramètre selon votre façon de vendre et forme vos équipes.
          </p>
          <div data-f className="mt-9 flex flex-wrap gap-3">
            <a href={links.contact} className="group inline-flex min-h-[54px] items-center gap-3 rounded-full py-2 pl-7 pr-2 text-[15.5px] font-semibold transition-transform duration-300 hover:scale-[1.03]" style={{ background: CYAN, color: NIGHT }}>
              Demander une démo
              <span className="grid h-10 w-10 place-items-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1" style={{ background: NIGHT }}>
                <Arrow size={17} />
              </span>
            </a>
            <a href="#outils" className="btn btn-outline-light !min-h-[54px]">
              Découvrir les outils
            </a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[640px]">
          <img data-s src={b24caps.crm.src} alt={b24caps.crm.alt} className="relative block h-auto w-full rounded-[16px] shadow-[0_50px_90px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10" fetchPriority="high" />
          <div data-s className="absolute -bottom-[16%] -left-[6%] hidden w-[48%] -rotate-[4deg] sm:block">
            <AppWindow src={b24caps.contact.src} alt={b24caps.contact.alt} title="Bitrix24 · Centre de contact" eager />
          </div>
          {notes.map(({ icon: Icon, k, t, pos }, i) => (
            <div key={t} className={`div-note absolute ${pos} hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#0d2a4d]/85 px-3.5 py-2.5 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] backdrop-blur-md md:flex`} style={{ animationDelay: `${1.2 + i * 2.6}s` }}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: CYAN, color: NIGHT }}>
                <Icon size={17} aria-hidden />
              </span>
              <span className="leading-tight">
                <span className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/55">{k}</span>
                <span className="block text-[13.5px] font-semibold text-white">{t}</span>
              </span>
            </div>
          ))}
          <div className="h-20 sm:h-28" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Visuels des univers (captures réelles, ou mini-interfaces dessinées) ---------- */
function Mini({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[22px] bg-white p-5 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] md:p-6">{children}</div>;
}

function ToolVisual({ v }: { v: B24Tool["visual"] }) {
  if (v === "crm" || v === "contact" || v === "funnel" || v === "mobile") return <AppWindow src={b24caps[v].src} alt={b24caps[v].alt} title="Bitrix24" />;
  if (v === "kanban")
    return (
      <Mini>
        <div className="grid grid-cols-3 gap-3 text-[12px]">
          {[
            ["À faire", ["Préparer le devis", "Relancer le client"], "#2fc6f6"],
            ["En cours", ["Maquette du site", "Formation équipe"], "#ffb020"],
            ["Terminé", ["Contrat signé"], "#2ecc71"],
          ].map(([col, items, c]) => (
            <div key={col as string} className="rounded-xl bg-mist p-2.5">
              <p className="mb-2 flex items-center gap-1.5 font-bold text-ink">
                <span className="h-2 w-2 rounded-full" style={{ background: c as string }} />
                {col as string}
              </p>
              {(items as string[]).map((t) => (
                <div key={t} className="mb-2 rounded-lg bg-white p-2 shadow-sm">
                  {t}
                  <div className="mt-1.5 flex items-center gap-1 text-[10.5px] text-ink-soft">
                    <Clock3 size={11} /> 2 j
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Mini>
    );
  if (v === "chat")
    return (
      <Mini>
        <div className="flex items-center justify-between border-b border-line pb-3">
          <p className="font-bold">Équipe commerciale</p>
          <span className="flex gap-2 text-ink-soft">
            <Phone size={16} />
            <Video size={16} />
          </span>
        </div>
        <div className="mt-4 space-y-2.5 text-[13px]">
          <p className="w-fit max-w-[80%] rounded-2xl rounded-tl-sm bg-mist px-3.5 py-2">Le devis est prêt, je le partage ?</p>
          <p className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-sm px-3.5 py-2 text-white" style={{ background: "#0b6fd6" }}>Oui, et on se fait une visio à 15 h.</p>
          <p className="flex w-fit items-center gap-2 rounded-2xl rounded-tl-sm bg-mist px-3.5 py-2">
            <Paperclip size={14} /> devis-client.pdf
          </p>
          <p className="flex items-center gap-2 text-[12px] text-ink-soft">
            <CalendarDays size={13} /> Réunion ajoutée au calendrier · 15:00
          </p>
        </div>
      </Mini>
    );
  if (v === "team")
    return (
      <Mini>
        <p className="font-bold">Demande d’absence</p>
        <div className="mt-4 space-y-2.5 text-[13px]">
          {[
            ["Demande envoyée", true],
            ["Validée par le responsable", true],
            ["Planning de l’équipe mis à jour", true],
            ["Collègues informés", false],
          ].map(([t, done]) => (
            <div key={t as string} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5">
              <span className="grid h-6 w-6 place-items-center rounded-full text-white" style={{ background: done ? "#2ecc71" : "#c9d6e6" }}>
                <Check size={13} />
              </span>
              {t as string}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11.5px] text-ink-soft">Workflow automatique, sans code</p>
      </Mini>
    );
  return <SiteVisual />;
}

/* Sites et boutiques : l'éditeur de sites avec une boutique en cours de construction,
   l'aperçu mobile, et la commande qui arrive dans le CRM. Produits dessinés en CSS. */
const shopItems = [
  { name: "Gourde isotherme", price: "45 DT", bg: "linear-gradient(160deg,#dff6fe,#b6e9fc)", art: "bottle" },
  { name: "Mug céramique", price: "28 DT", bg: "linear-gradient(160deg,#fff1df,#ffd9a8)", art: "mug" },
  { name: "Plante d’intérieur", price: "62 DT", bg: "linear-gradient(160deg,#e3f7ea,#bfe9cc)", art: "plant" },
] as const;

function ShopArt({ art }: { art: (typeof shopItems)[number]["art"] }) {
  if (art === "bottle")
    return (
      <div className="flex flex-col items-center">
        <span className="h-[7%] w-[16%] min-h-[6px] rounded-t-sm bg-[#0b3b75]" />
        <span className="h-[44px] w-[24px] rounded-[8px] shadow-[inset_-5px_0_0_rgba(0,0,0,0.12)] md:h-[54px] md:w-[28px]" style={{ background: "linear-gradient(180deg,#2fc6f6,#0b6fd6)" }} />
      </div>
    );
  if (art === "mug")
    return (
      <div className="relative">
        <span className="block h-[34px] w-[34px] rounded-b-[10px] rounded-t-[3px] bg-[#f26b2f] shadow-[inset_-6px_0_0_rgba(0,0,0,0.12)] md:h-[40px] md:w-[40px]" />
        <span className="absolute right-[-11px] top-[7px] h-[18px] w-[14px] rounded-r-full border-[4px] border-l-0 border-[#f26b2f]" />
      </div>
    );
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[26px] w-[40px]">
        <span className="absolute bottom-0 left-[4px] h-[22px] w-[12px] -rotate-[30deg] rounded-[50%_50%_50%_0] bg-[#2ecc71]" />
        <span className="absolute bottom-0 left-[14px] h-[26px] w-[12px] rounded-full bg-[#1fa65a]" />
        <span className="absolute bottom-0 right-[4px] h-[22px] w-[12px] rotate-[30deg] rounded-[50%_50%_0_50%] bg-[#2ecc71]" />
      </div>
      <span className="h-[22px] w-[34px] bg-[#c8743a] [clip-path:polygon(0_0,100%_0,85%_100%,15%_100%)]" />
    </div>
  );
}

function SiteVisual() {
  return (
    <div className="relative pb-6 pr-4 md:pr-16">
      {/* Fenêtre de l'éditeur */}
      <div className="overflow-hidden rounded-[18px] bg-white text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)]">
        <div className="flex items-center gap-3 border-b border-line bg-[#f6f9fc] px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="flex flex-1 items-center gap-1.5 truncate rounded-full bg-white px-3 py-1 text-[11.5px] text-ink-soft ring-1 ring-line">
            <Globe size={12} /> www.votre-entreprise.tn
          </span>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-bold text-white" style={{ background: "#0b6fd6" }}>
            Publier
          </span>
        </div>
        <div className="flex">
          {/* Barre de blocs de l'éditeur */}
          <div className="hidden w-[46px] shrink-0 flex-col items-center gap-2.5 border-r border-line bg-[#f6f9fc] py-3 text-ink-soft sm:flex" aria-hidden>
            {[LayoutGrid, Type, ImageIcon, ShoppingBag, MousePointer2].map((I, k) => (
              <span key={k} className="grid h-7 w-7 place-items-center rounded-lg" style={k === 3 ? { background: "#e6f8fe", color: "#0b6fd6" } : undefined}>
                <I size={14} />
              </span>
            ))}
          </div>
          {/* La boutique */}
          <div className="min-w-0 flex-1 p-3.5 md:p-4">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-display text-[13px] font-bold">Votre marque</span>
              <span className="hidden gap-3 text-ink-soft sm:flex">
                <span>Boutique</span>
                <span>Nouveautés</span>
                <span>Contact</span>
              </span>
              <span className="relative text-ink">
                <ShoppingCart size={15} />
                <i className="absolute -right-1.5 -top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full text-[8px] font-bold not-italic text-white" style={{ background: "#f26b2f" }}>
                  2
                </i>
              </span>
            </div>
            <div className="relative mt-3 overflow-hidden rounded-xl px-4 py-3.5 text-white" style={{ background: "linear-gradient(120deg,#0b3b75,#0b6fd6 60%,#2fc6f6)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">Nouvelle collection</p>
              <p className="mt-1 max-w-[62%] font-display text-[16px] font-bold leading-tight md:text-[18px]">Commandez en ligne, livré chez vous.</p>
              <span className="mt-2.5 inline-block rounded-full bg-white px-3 py-1 text-[11px] font-bold" style={{ color: "#0b3b75" }}>
                Voir la boutique
              </span>
              <span className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/10" aria-hidden />
              <span className="absolute bottom-[-30px] right-10 h-20 w-20 rounded-full bg-white/10" aria-hidden />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {shopItems.map((p, k) => (
                <div key={p.name} className={`rounded-xl p-1.5 ring-1 ring-line ${k === 1 ? "outline-dashed outline-2 outline-offset-2 outline-[#2fc6f6]" : ""}`}>
                  <div className="grid aspect-[4/3] place-items-center rounded-lg" style={{ background: p.bg }}>
                    <ShopArt art={p.art} />
                  </div>
                  <p className="mt-1.5 truncate px-0.5 text-[11px] font-semibold">{p.name}</p>
                  <div className="flex items-center justify-between px-0.5 pb-0.5">
                    <span className="text-[11px] font-bold" style={{ color: "#0b6fd6" }}>
                      {p.price}
                    </span>
                    <span className="grid h-5 w-5 place-items-center rounded-full text-white" style={{ background: "#0b6fd6" }}>
                      <Plus size={11} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Aperçu mobile */}
      <div className="div-float absolute bottom-0 right-0 hidden w-[92px] md:right-[-6px] rounded-[18px] bg-[#0b1a2e] p-1.5 shadow-[0_24px_40px_-14px_rgba(0,0,0,0.6)] sm:block md:w-[104px]" aria-hidden>
        <div className="overflow-hidden rounded-[13px] bg-white">
          <div className="mx-auto mt-1 h-1 w-6 rounded-full bg-line" />
          <div className="m-1.5 rounded-md px-1.5 py-2 text-[7px] font-bold leading-tight text-white" style={{ background: "linear-gradient(120deg,#0b6fd6,#2fc6f6)" }}>
            Nouvelle collection
          </div>
          {shopItems.slice(0, 2).map((p) => (
            <div key={p.name} className="mx-1.5 mb-1.5 grid aspect-[5/3] place-items-center rounded-md" style={{ background: p.bg }}>
              <div className="scale-[0.5]">
                <ShopArt art={p.art} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* La commande arrive dans le CRM */}
      <div className="div-note absolute -left-3 bottom-2 flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 text-ink shadow-[0_18px_40px_-14px_rgba(0,0,0,0.45)] ring-1 ring-line md:-left-6" style={{ animationDelay: "0.4s" }}>
        <span className="grid h-8 w-8 place-items-center rounded-full text-white" style={{ background: "#2ecc71" }}>
          <Check size={15} />
        </span>
        <span className="leading-tight">
          <span className="block text-[10.5px] font-bold uppercase tracking-[0.1em]" style={{ color: "#0b6fd6" }}>
            CRM
          </span>
          <span className="text-[12.5px] font-semibold">Nouvelle commande enregistrée</span>
        </span>
      </div>
    </div>
  );
}

/* ---------- Rail des six univers ---------- */
const panelLook = [
  { bg: "#0b3b75", ink: "#fff", dark: true },
  { bg: "#e6f8fe", ink: "#0b1a2e", dark: false },
  { bg: "#071a33", ink: "#fff", dark: true },
  { bg: "#eef5ff", ink: "#0b1a2e", dark: false },
  { bg: "#0b6fd6", ink: "#fff", dark: true },
  { bg: "#e6f8fe", ink: "#0b1a2e", dark: false },
];

export function B24ToolsRail() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth + 48;
        gsap.to(el, {
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
              const n = Math.min(b24tools.length, Math.floor(self.progress * b24tools.length) + 1);
              const out = root.current?.querySelector("[data-count]");
              if (out) out.textContent = String(n).padStart(2, "0");
              gsap.set(root.current!.querySelector("[data-progress]"), { scaleX: self.progress });
            },
          },
        });
      });
    },
    { scope: root }
  );
  return (
    <section id="outils" ref={root} className="relative scroll-mt-16 overflow-hidden bg-white py-16 lg:flex lg:h-[calc(100svh-60px)] lg:flex-col lg:py-0" aria-labelledby="b24-tools-title">
      <div className="container-x flex shrink-0 items-end justify-between gap-6 lg:pb-6 lg:pt-8">
        <h2 id="b24-tools-title" className="font-display text-[clamp(30px,3.4vw,50px)] font-bold leading-[1.05] tracking-[-0.035em]">
          Six univers, <span style={{ color: "#0b6fd6" }}>une seule plateforme</span>
        </h2>
        <div className="hidden shrink-0 items-center gap-4 pb-2 lg:flex" aria-hidden>
          <span className="whitespace-nowrap font-display text-[15px] font-semibold text-ink">
            <span data-count>01</span> <span className="text-ink-soft">/ {String(b24tools.length).padStart(2, "0")}</span>
          </span>
          <span className="h-[3px] w-40 overflow-hidden rounded-full bg-line">
            <span data-progress className="block h-full origin-left scale-x-0" style={{ background: CYAN }} />
          </span>
        </div>
      </div>
      <div className="lg:min-h-0 lg:flex-1 lg:pb-8">
        <div ref={track} className="container-x mt-10 grid gap-5 lg:mt-0 lg:flex lg:h-full lg:w-max lg:max-w-none lg:gap-6 lg:pl-[max(32px,calc((100vw-1240px)/2+32px))] lg:pr-12">
          {b24tools.map((t, i) => {
            const lk = panelLook[i];
            return (
              <article key={t.key} className="relative flex w-full shrink-0 flex-col overflow-hidden rounded-[32px] lg:h-full lg:min-h-0 lg:w-[78vw] lg:max-w-[1240px] lg:flex-row" style={{ background: lk.bg, color: lk.ink }} aria-label={t.name}>
                <div className="relative z-10 flex flex-col p-8 md:p-12 lg:w-[44%] lg:justify-between lg:p-12 lg:[@media(max-height:820px)]:p-8">
                  <div>
                    <span className="font-display text-[15px] font-semibold opacity-60">
                      {String(i + 1).padStart(2, "0")} / {String(b24tools.length).padStart(2, "0")}
                    </span>
                    <h3 className="mt-5 font-display text-[clamp(32px,3.4vw,52px)] font-bold leading-[0.95] tracking-[-0.045em] lg:[@media(max-height:820px)]:mt-3 lg:[@media(max-height:820px)]:text-[34px]" style={{ color: lk.ink }}>
                      {t.name}
                    </h3>
                    <p className="mt-4 max-w-sm text-[clamp(18px,1.6vw,23px)] font-semibold leading-snug lg:[@media(max-height:820px)]:text-[17px]" style={{ color: lk.ink }}>
                      {t.line}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-2 lg:[@media(max-height:820px)]:mt-4 lg:[@media(max-height:700px)]:hidden">
                      {t.features.map((f) => (
                        <li key={f} className="chip" style={{ background: lk.dark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.9)", color: lk.ink }}>
                          <span className="h-2 w-2 rounded-full" style={{ background: CYAN }} aria-hidden />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a href={t.href} className="group mt-8 inline-flex w-fit items-center gap-3 rounded-full py-3 pl-6 pr-3 text-[15.5px] font-semibold transition-transform duration-300 hover:scale-[1.03] lg:[@media(max-height:820px)]:mt-4" style={{ background: lk.dark ? "#fff" : "#0b6fd6", color: lk.dark ? NIGHT : "#fff" }}>
                    Découvrir {t.name}
                    <span className="grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1" style={{ background: CYAN, color: NIGHT }}>
                      <Arrow size={16} />
                    </span>
                  </a>
                </div>
                <div className="relative flex flex-1 items-center justify-center px-6 pb-10 lg:px-10 lg:pb-0">
                  <div className="pointer-events-none absolute right-[-10%] top-1/2 aspect-square w-[80%] -translate-y-1/2 rounded-full opacity-30 blur-3xl" style={{ background: CYAN }} aria-hidden />
                  <div className="relative w-full max-w-[560px] lg:[@media(max-height:820px)]:scale-[0.84]">
                    <ToolVisual v={t.visual} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Avantages : cartes empilées (inspiration hugeinc.com) ---------- */
export function B24Benefits() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-bcard]");
        cards.forEach((c, i) => {
          if (i === cards.length - 1) return;
          gsap.to(c.querySelector("[data-binner]"), { scale: 0.95, ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top+=160", scrub: true } });
        });
      });
    },
    { scope: root }
  );
  return (
    <section ref={root} className="relative py-[clamp(80px,10vw,130px)] text-white" style={{ background: NIGHT }} aria-labelledby="b24-ben-title">
      <div className="container-x">
        <p className="eyebrow eyebrow-light">Pourquoi Bitrix24</p>
        <h2 id="b24-ben-title" className="mt-4 max-w-3xl font-display text-[clamp(30px,3.6vw,52px)] font-bold leading-[1.04] tracking-[-0.04em] !text-white">
          Plus de 12 millions d’utilisateurs <span style={{ color: CYAN }}>lui font déjà confiance.</span>
        </h2>
        <ol className="mt-14 space-y-6 lg:space-y-[14vh]">
          {b24benefits.map((b, i) => (
            <li key={b.t} data-bcard className="lg:sticky" style={{ top: `${98 + i * 22}px` }}>
              <div data-binner className="origin-top rounded-[30px] bg-[#f6f9fc] p-8 text-ink shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.6)] md:p-11">
                <div className="grid items-center gap-8 lg:grid-cols-[1fr_300px]">
                  <div>
                    <span className="font-display text-[clamp(40px,4vw,60px)] font-bold leading-none tracking-[-0.05em]" style={{ color: "#0b6fd6" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-display text-[clamp(30px,4vw,58px)] font-bold leading-[0.98] tracking-[-0.05em] text-ink">{b.t}.</h3>
                    <p className="mt-4 max-w-2xl text-[clamp(16px,1.3vw,19px)] font-medium leading-relaxed text-ink-2">{b.d}</p>
                  </div>
                  <figure className="hidden overflow-hidden rounded-[18px] p-2 shadow-xl lg:block" style={{ background: NIGHT }}>
                    <img src={b24caps[b.visual].src} alt={b24caps[b.visual].alt} className="block aspect-[16/10] w-full rounded-[12px] bg-white object-cover object-left-top" loading="lazy" />
                  </figure>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Deux versions ---------- */
export function B24Editions() {
  return (
    <section className="bg-white py-[clamp(80px,10vw,130px)]" aria-labelledby="b24-ed-title">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow">Deux versions</p>
          <h2 id="b24-ed-title" className="mt-4 font-display text-[clamp(30px,3.6vw,52px)] font-bold leading-[1.04] tracking-[-0.04em]">
            Dans le cloud <span style={{ color: "#0b6fd6" }}>ou sur vos serveurs.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {b24editions.map((e, i) => {
            const dark = i === 1;
            return (
              <article key={e.key} className={`relative overflow-hidden rounded-[32px] p-8 md:p-11 ${dark ? "text-white" : "ring-1 ring-line"}`} style={{ background: dark ? NIGHT : "linear-gradient(160deg,#ffffff,#e6f8fe)" }}>
                {dark && <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-3xl" style={{ background: CYAN }} aria-hidden />}
                <div className="relative flex items-start justify-between gap-6">
                  <div>
                    <p className={`text-[12.5px] font-bold uppercase tracking-[0.16em] ${dark ? "text-white/55" : "text-ink-soft"}`}>Bitrix24</p>
                    <h3 className={`mt-2 font-display text-[clamp(32px,3.4vw,48px)] font-bold tracking-[-0.045em] ${dark ? "!text-white" : "text-ink"}`}>{e.name}</h3>
                    <p className={`mt-2 text-[17px] ${dark ? "text-white/70" : "text-ink-soft"}`}>{e.line}</p>
                  </div>
                  <img src={e.img} alt="" className="h-24 w-auto shrink-0 drop-shadow-xl" loading="lazy" />
                </div>
                <ul className={`relative mt-8 border-t pt-6 ${dark ? "border-white/10" : "border-line"}`}>
                  {e.points.map((p) => (
                    <li key={p} className={`flex items-center gap-3 py-2.5 text-[16px] ${dark ? "text-white/85" : "text-ink-2"}`}>
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full" style={{ background: CYAN, color: NIGHT }}>
                        <Check size={13} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Mediasoft + contact ---------- */
export function B24Mediasoft() {
  const phone = site.techPhones[0];
  return (
    <>
      <section className="bg-[#f3f9fd] py-[clamp(80px,10vw,130px)]" aria-labelledby="b24-ms-title">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <img src="/img/bitrix24/bitrix24-partner.webp" alt="Mediasoft, partenaire Bitrix24" className="w-full max-w-[380px] rounded-[24px] bg-white shadow-[0_30px_60px_-30px_rgba(11,26,46,0.4)]" loading="lazy" />
          </div>
          <div>
            <p className="eyebrow">Mediasoft, partenaire Bitrix24 en Tunisie</p>
            <h2 id="b24-ms-title" className="mt-4 font-display text-[clamp(30px,3.6vw,50px)] font-bold leading-[1.04] tracking-[-0.04em]">
              Un outil puissant, <span style={{ color: "#0b6fd6" }}>bien installé et vraiment utilisé.</span>
            </h2>
            <ol className="mt-9 grid gap-4 sm:grid-cols-2">
              {b24services.map((s, i) => (
                <li key={s.t} className="relative overflow-hidden rounded-[22px] bg-white p-6 shadow-[0_18px_40px_-28px_rgba(11,26,46,0.45)] ring-1 ring-line">
                  <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: i % 2 ? "#0b6fd6" : CYAN }} aria-hidden />
                  <span className="font-display text-[13px] font-bold text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-1 font-display text-[19px] font-bold tracking-[-0.02em] text-ink">{s.t}</p>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section className="bg-white py-[clamp(70px,9vw,120px)]" aria-labelledby="b24-cta-title">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[40px] px-8 py-14 text-white md:px-16 md:py-20" style={{ background: NIGHT }}>
            <div className="pointer-events-none absolute -right-[10%] -top-[40%] h-[140%] w-[60%] rounded-full opacity-35 blur-[120px]" style={{ background: CYAN }} aria-hidden />
            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <h2 id="b24-cta-title" className="font-display text-[clamp(32px,4vw,56px)] font-bold leading-[1.03] tracking-[-0.045em] !text-white">
                  Voyons ce que Bitrix24 <span style={{ color: CYAN }}>peut faire pour vous.</span>
                </h2>
                <p className="mt-5 max-w-lg text-[16.5px] leading-relaxed text-white/70">Une démonstration sur vos cas réels, et un plan clair pour démarrer.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
                <a href={links.contact} className="group inline-flex min-h-[56px] items-center justify-between gap-3 rounded-full py-2 pl-7 pr-2 text-[16px] font-semibold transition-transform duration-300 hover:scale-[1.03] lg:min-w-[280px]" style={{ background: CYAN, color: NIGHT }}>
                  Demander une démo
                  <span className="grid h-10 w-10 place-items-center rounded-full text-white" style={{ background: NIGHT }}>
                    <Arrow size={17} />
                  </span>
                </a>
                <a href={phone.href} className="btn btn-outline-light lg:min-w-[280px]">
                  <Phone size={17} aria-hidden /> {phone.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
