"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Globe,
  Camera,
  ThumbsUp,
  Mail,
  MessageCircle,
  Phone,
  PhoneIncoming,
  ShoppingCart,
  Sparkles,
  Video,
} from "lucide-react";
import { Arrow } from "@/components/ui";
import { links } from "@/lib/site";
import { B24_CYAN, B24_NIGHT } from "@/lib/bitrix24";
import { univers, type Scene, type Univers } from "@/lib/bitrix24Univers";

/* Page d'un univers Bitrix24 : ouverture sombre, puis un cas concret en quatre étapes.
   Au défilement, l'étape active change et la fenêtre Bitrix24 dessinée (à droite, fixe) s'anime.
   Données d'exemple, signalées comme telles. */

const CH_ICON: Record<string, typeof Mail> = {
  WhatsApp: MessageCircle,
  Instagram: Camera,
  Facebook: ThumbsUp,
  "E-mail": Mail,
  Formulaire: FileText,
  "Chat du site": Globe,
  Boutique: ShoppingCart,
};
const CH_COLOR: Record<string, string> = {
  WhatsApp: "#25d366",
  Instagram: "#e1306c",
  Facebook: "#1877f2",
  "E-mail": "#6b7c93",
  Formulaire: "#f5a623",
  "Chat du site": "#2fc6f6",
  Boutique: "#7b61ff",
};

function SceneView({ s }: { s: Scene }) {
  switch (s.type) {
    case "inbox":
      return (
        <ul className="grid gap-2.5">
          {s.items.map((m, i) => {
            const I = CH_ICON[m.ch] ?? MessageCircle;
            return (
              <li
                key={i}
                className={`b24u-in flex items-center gap-3 rounded-xl border bg-white p-3 ${m.isNew ? "border-[#2fc6f6] ring-2 ring-[#2fc6f6]/25" : "border-[#e5edf5]"}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white" style={{ background: CH_COLOR[m.ch] ?? "#2fc6f6" }}>
                  <I size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between text-[11.5px] text-[#6b7c93]">
                    <span className="font-semibold text-[#1c2b3a]">{m.from}</span>
                    {m.ch}
                  </span>
                  <span className="block truncate text-[13px] text-[#33475b]">{m.text}</span>
                </span>
                {m.isNew && <span className="rounded-full bg-[#2fc6f6] px-2 py-0.5 text-[10px] font-bold text-white">Nouveau</span>}
              </li>
            );
          })}
        </ul>
      );
    case "card":
      return (
        <div className="b24u-in rounded-xl border border-[#e5edf5] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e6f8fe] font-bold text-[#0b6fd6]">P</span>
              <p className="font-semibold text-[#1c2b3a]">{s.title}</p>
            </div>
            {s.badge && <span className="rounded-full bg-[#e9fbee] px-2.5 py-1 text-[11px] font-semibold text-[#0a8a2a]">{s.badge}</span>}
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-2">
            {s.fields.map(([k, v]) => (
              <div key={k} className="rounded-lg bg-[#f4f8fb] px-3 py-2">
                <dt className="text-[10.5px] uppercase tracking-wide text-[#6b7c93]">{k}</dt>
                <dd className="text-[13.5px] font-semibold text-[#1c2b3a]">{v}</dd>
              </div>
            ))}
          </dl>
          {s.timeline && (
            <ol className="mt-4 grid gap-2 border-l-2 border-[#2fc6f6]/40 pl-4">
              {s.timeline.map((t, i) => (
                <li key={t} className="b24u-in relative text-[12.5px] text-[#33475b]" style={{ animationDelay: `${i * 120}ms` }}>
                  <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#2fc6f6]" />
                  {t}
                </li>
              ))}
            </ol>
          )}
        </div>
      );
    case "kanban":
      return (
        <div className="grid grid-cols-4 gap-2">
          {s.cols.map((c, i) => (
            <div key={c} className="min-h-[170px] rounded-xl bg-[#eef4f9] p-2">
              <p className="truncate rounded-md px-2 py-1 text-[10.5px] font-bold text-white" style={{ background: i === s.cols.length - 1 && s.won ? "#25b34b" : i <= s.at ? "#2fc6f6" : "#9fb3c8" }}>
                {c}
              </p>
              {i === s.at ? (
                <div className="b24u-in mt-2 rounded-lg border-l-4 border-[#2fc6f6] bg-white p-2 text-[11.5px] font-semibold text-[#1c2b3a]">
                  {s.card}
                  {s.won && (
                    <span className="mt-1.5 flex items-center gap-1 text-[10.5px] text-[#25b34b]">
                      <Check size={12} strokeWidth={3} /> Gagnée
                    </span>
                  )}
                </div>
              ) : (
                <div className="mt-2 h-9 rounded-lg bg-white/60" />
              )}
            </div>
          ))}
        </div>
      );
    case "doc":
      return (
        <div className="b24u-in rounded-xl border border-[#e5edf5] bg-white p-4">
          <div className="flex items-center gap-2 font-semibold text-[#1c2b3a]">
            <FileText size={18} className="text-[#0b6fd6]" /> {s.title}
          </div>
          <ul className="mt-3 divide-y divide-[#eef2f6] text-[13px]">
            {s.lines.map(([k, v]) => (
              <li key={k} className="flex justify-between py-2 text-[#33475b]">
                <span>{k}</span>
                <span className="font-semibold">{v}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-[#f4f8fb] px-3 py-2.5">
            <span className="text-[13px] font-bold text-[#1c2b3a]">{s.total}</span>
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0a8a2a]">
              <Check size={14} strokeWidth={3} /> {s.status}
            </span>
          </div>
        </div>
      );
    case "chat":
      return (
        <div className="rounded-xl border border-[#e5edf5] bg-white p-3">
          <p className="border-b border-[#eef2f6] pb-2 text-[12.5px] font-semibold text-[#1c2b3a]">{s.title}</p>
          <div className="mt-3 grid gap-2">
            {s.msgs.map((m, i) => (
              <p
                key={i}
                className={`b24u-in max-w-[80%] rounded-2xl px-3 py-2 text-[13px] ${m.me ? "justify-self-end rounded-br-sm bg-[#2fc6f6] text-white" : "rounded-bl-sm bg-[#eef4f9] text-[#33475b]"}`}
                style={{ animationDelay: `${i * 250}ms` }}
              >
                {m.text}
              </p>
            ))}
          </div>
        </div>
      );
    case "call":
      return (
        <div className="b24u-in grid place-items-center rounded-xl bg-[#0d2a45] p-6 text-center text-white">
          {s.video ? (
            <div className="grid w-full grid-cols-2 gap-2">
              {Array.from({ length: s.people ?? 4 }).map((_, i) => (
                <div key={i} className="grid aspect-video place-items-center rounded-lg bg-white/10">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#2fc6f6]/80 text-[13px] font-bold">{String.fromCharCode(65 + i)}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="b24u-ring grid h-16 w-16 place-items-center rounded-full bg-[#25b34b]">
              <PhoneIncoming size={28} />
            </span>
          )}
          <p className="mt-4 font-semibold">{s.who}</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-[12.5px] text-white/70">
            {s.video ? <Video size={14} /> : <Phone size={14} />} {s.status}
          </p>
        </div>
      );
    case "tasks":
      return (
        <ul className="grid gap-2">
          {s.items.map((t, i) => (
            <li key={t.t} className="b24u-in flex items-center gap-3 rounded-xl border border-[#e5edf5] bg-white p-3" style={{ animationDelay: `${i * 140}ms` }}>
              <span className={`grid h-5 w-5 place-items-center rounded-md border-2 ${t.done ? "border-[#25b34b] bg-[#25b34b] text-white" : "border-[#c5d3e0]"}`}>{t.done && <Check size={12} strokeWidth={3} />}</span>
              <span className="flex-1 text-[13.5px] font-medium text-[#1c2b3a]">{t.t}</span>
              <span className="text-[11.5px] text-[#6b7c93]">{t.who}</span>
            </li>
          ))}
        </ul>
      );
    case "gantt":
      return (
        <div className="rounded-xl border border-[#e5edf5] bg-white p-3">
          <div className="grid grid-cols-8 border-b border-[#eef2f6] pb-1 text-center text-[10px] text-[#9fb3c8]">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i}>S{i + 1}</span>
            ))}
          </div>
          <div className="mt-2 grid gap-2">
            {s.bars.map((b, i) => (
              <div key={b.t} className="relative h-8">
                <span
                  className="b24u-bar absolute top-0 flex h-full items-center rounded-md px-2 text-[11px] font-semibold text-white"
                  style={{ left: `${(b.start / 8) * 100}%`, width: `${(b.len / 8) * 100}%`, background: i % 2 ? "#0b6fd6" : "#2fc6f6", animationDelay: `${i * 150}ms` }}
                >
                  <span className="truncate">{b.t}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    case "flow":
      return (
        <div className="rounded-xl border border-[#e5edf5] bg-white p-4">
          <p className="text-[12.5px] font-semibold text-[#1c2b3a]">Demande de congé · 3 jours</p>
          <ol className="mt-5 flex items-center">
            {s.steps.map((st, i) => (
              <li key={st} className="flex flex-1 items-center last:flex-none">
                <span className="flex flex-col items-center gap-1.5">
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full text-[12px] font-bold transition-colors duration-500 ${i < s.active || (i === s.active && i === s.steps.length - 1) ? "bg-[#25b34b] text-white" : i === s.active ? "b24u-ring bg-[#2fc6f6] text-white" : "bg-[#eef4f9] text-[#9fb3c8]"}`}
                  >
                    {i < s.active || (i === s.active && i === s.steps.length - 1) ? <Check size={15} strokeWidth={3} /> : i + 1}
                  </span>
                  <span className="text-[11px] font-medium text-[#33475b]">{st}</span>
                </span>
                {i < s.steps.length - 1 && <span className={`mx-1 mb-5 h-0.5 flex-1 rounded ${i < s.active ? "bg-[#25b34b]" : "bg-[#dfe7ef]"}`} />}
              </li>
            ))}
          </ol>
        </div>
      );
    case "clock":
      return (
        <div className="b24u-in rounded-xl bg-[#0d2a45] p-5 text-white">
          <p className="inline-flex items-center gap-2 text-[12px] text-white/60">
            <Clock3 size={14} /> {s.label}
          </p>
          <p className="mt-2 font-display text-[44px] font-bold tabular-nums tracking-tight">{s.time}</p>
          <span className="mt-1 inline-block rounded-full bg-[#25b34b] px-3 py-1 text-[11.5px] font-semibold">En cours</span>
          <dl className="mt-4 grid gap-1.5 text-[12.5px]">
            {s.rows.map(([k, v]) => (
              <div key={k} className="flex justify-between text-white/75">
                <dt>{k}</dt>
                <dd className="font-semibold text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "site":
      return s.shop ? (
        <div className="grid grid-cols-3 gap-2">
          {["Article A", "Article B", "Article C"].map((a, i) => (
            <div key={a} className="b24u-in rounded-xl border border-[#e5edf5] bg-white p-2" style={{ animationDelay: `${i * 120}ms` }}>
              <div className="aspect-square rounded-lg" style={{ background: ["#e6f8fe", "#fff1e6", "#eef0ff"][i] }} />
              <p className="mt-1.5 text-[11.5px] font-semibold text-[#1c2b3a]">{a}</p>
              <p className="mt-1 inline-flex items-center gap-1 rounded-md bg-[#2fc6f6] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                <ShoppingCart size={10} /> Ajouter
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-2">
          {s.blocks.map((b, i) => (
            <div key={b} className="b24u-in flex items-center gap-3 rounded-xl border border-dashed border-[#9fd9ee] bg-white p-3" style={{ animationDelay: `${i * 160}ms` }}>
              <span className="h-8 w-12 rounded-md" style={{ background: ["#2fc6f6", "#e6f8fe", "#fff1e6", "#eef0ff"][i % 4] }} />
              <span className="text-[13px] font-medium text-[#1c2b3a]">Bloc « {b} »</span>
            </div>
          ))}
        </div>
      );
    case "result":
      return (
        <div className="b24u-in rounded-xl border border-[#e5edf5] bg-white p-5">
          <p className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0a8a2a]">
            <Sparkles size={14} /> {s.label}
          </p>
          <p className="mt-1 font-display text-[46px] font-bold tracking-tight text-[#1c2b3a]">{s.big}</p>
          <dl className="mt-3 grid gap-2">
            {s.rows.map(([k, v]) => (
              <div key={k} className="flex justify-between rounded-lg bg-[#f4f8fb] px-3 py-2 text-[13px]">
                <dt className="text-[#6b7c93]">{k}</dt>
                <dd className="font-semibold text-[#1c2b3a]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
  }
}

/* Fenêtre Bitrix24 dessinée : barre latérale, barre de titre, contenu de l'étape */
function Window({ u, step }: { u: Univers; step: number }) {
  const s = u.steps[step];
  return (
    <div className="overflow-hidden rounded-[22px] bg-[#f4f8fb] shadow-[0_40px_80px_-40px_rgba(7,26,51,0.55)] ring-1 ring-black/5">
      <div className="flex items-center gap-2 bg-[#0b2a4a] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[12px] font-semibold text-white/80">
          Bitrix24 · {u.name}
        </span>
      </div>
      <div className="grid grid-cols-[52px_1fr]">
        <div className="flex flex-col items-center gap-3 bg-[#103457] py-4" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`h-7 w-7 rounded-lg ${i === 1 ? "bg-[#2fc6f6]" : "bg-white/10"}`} />
          ))}
        </div>
        <div className="min-h-[340px] p-4 md:p-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b7c93]">
            Étape {step + 1} / {u.steps.length}
          </p>
          <div key={`${u.slug}-${step}`}>
            <SceneView s={s.scene} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Bitrix24Univers({ u }: { u: Univers }) {
  const [step, setStep] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const others = univers.filter((x) => x.slug !== u.slug);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setStep(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Ouverture */}
      <section className="relative overflow-hidden pb-[clamp(56px,7vw,96px)] pt-[clamp(36px,5vw,64px)] text-white" style={{ background: B24_NIGHT }} aria-labelledby="univ-title">
        <div className="pointer-events-none absolute -right-[10%] top-[-20%] h-[80vh] w-[70vw] rounded-full opacity-[0.22] blur-[120px]" style={{ background: B24_CYAN }} aria-hidden />
        <div className="pointer-events-none absolute -left-[15%] bottom-[-30%] h-[60vh] w-[50vw] rounded-full bg-brand opacity-[0.25] blur-[120px]" aria-hidden />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />
        <div className="container-x relative">
          <nav aria-label="Fil d’Ariane">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-white/60">
              <li>
                <a href={links.home} className="hover:text-white">Accueil</a>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight size={14} aria-hidden />
                <a href={links.bitrix24} className="hover:text-white">Bitrix24</a>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight size={14} aria-hidden />
                <span aria-current="page" className="font-medium text-white">{u.name}</span>
              </li>
            </ol>
          </nav>
          <div className="mt-10 max-w-4xl">
            <p className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-white/80">
              <span className="grid h-7 place-items-center rounded-full bg-white px-2.5">
                <img src="/img/logos/logo-bitrix24.png" alt="Bitrix24" className="h-3.5 w-auto" />
              </span>
              {u.name}
            </p>
            <h1 id="univ-title" className="mt-7 font-display text-[clamp(36px,4.6vw,66px)] font-bold leading-[1.02] tracking-[-0.045em] !text-white">
              {u.title} <span style={{ color: B24_CYAN }}>{u.accent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[clamp(16px,1.25vw,18.5px)] leading-relaxed text-white/70">{u.lead}</p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-medium text-white/85">
              {u.features.map((f) => (
                <li key={f} className="inline-flex items-center gap-2">
                  <Check size={15} strokeWidth={3} style={{ color: B24_CYAN }} aria-hidden /> {f}
                </li>
              ))}
            </ul>
            <a href={links.contact} className="group mt-10 inline-flex min-h-[52px] items-center gap-3 rounded-full py-2 pl-7 pr-2 text-[15.5px] font-semibold transition-transform duration-300 hover:scale-[1.03]" style={{ background: B24_CYAN, color: B24_NIGHT }}>
              Demander une démo
              <span className="grid h-9 w-9 place-items-center rounded-full text-white" style={{ background: B24_NIGHT }}>
                <Arrow size={16} />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Le cas concret, au défilement */}
      <section className="bg-white py-[clamp(64px,8vw,110px)]" aria-labelledby="univ-story">
        <div className="container-x">
          <p className="eyebrow">Concrètement</p>
          <h2 id="univ-story" className="mt-3 max-w-2xl font-display text-[clamp(28px,3vw,44px)] font-bold leading-[1.06] tracking-[-0.04em]">
            Une journée avec Bitrix24 {u.name}
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <ol>
              {u.steps.map((s, i) => (
                <li
                  key={s.t}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  data-i={i}
                  className="lg:flex lg:min-h-[58vh] lg:items-center"
                >
                  <div className={`border-l-[3px] py-2 pl-6 transition-colors duration-500 ${step === i ? "border-[#2fc6f6]" : "border-[#e5edf5]"}`}>
                    <span className="font-display text-[14px] font-bold" style={{ color: step === i ? "#0b6fd6" : "#9fb3c8" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className={`mt-1 font-display text-[clamp(22px,2vw,30px)] font-bold leading-tight tracking-[-0.03em] transition-colors duration-500 ${step === i ? "text-ink" : "text-ink/40"}`}>{s.t}</h3>
                    <p className={`mt-2 max-w-md text-[16px] leading-relaxed transition-colors duration-500 ${step === i ? "text-ink-soft" : "text-ink-soft/50"}`}>{s.d}</p>
                  </div>
                  {/* Sur mobile, la scène suit chaque étape */}
                  <div className="mt-5 lg:hidden">
                    <Window u={u} step={i} />
                  </div>
                </li>
              ))}
            </ol>
            <div className="hidden lg:block">
              <div className="sticky top-[calc(50vh-210px)]">
                <Window u={u} step={step} />
                <p className="mt-3 text-[11.5px] text-ink-soft">Illustration · données d’exemple</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Les autres univers + contact */}
      <section className="bg-[#f3f9fd] py-[clamp(56px,7vw,96px)]" aria-labelledby="univ-others">
        <div className="container-x">
          <h2 id="univ-others" className="font-display text-[clamp(24px,2.4vw,34px)] font-bold tracking-[-0.03em]">
            Les autres univers Bitrix24
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((o) => (
              <li key={o.slug}>
                <a href={`${links.bitrix24}${o.slug}/`} className="group flex h-full items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 font-semibold text-ink ring-1 ring-line transition-colors hover:ring-[#2fc6f6]">
                  {o.name}
                  <Arrow size={16} />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-[28px] px-7 py-8 text-white md:px-10" style={{ background: B24_NIGHT }}>
            <p className="font-display text-[clamp(22px,2.2vw,30px)] font-bold leading-tight tracking-[-0.03em]">
              Voyons ce que Bitrix24 <span style={{ color: B24_CYAN }}>peut faire pour vous.</span>
            </p>
            <a href={links.contact} className="btn !bg-white !text-[#071a33]">
              Demander une démo <Arrow />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
