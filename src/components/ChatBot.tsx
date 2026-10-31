"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { Bot, Check, Copy, Loader2, RotateCcw, Send, X } from "lucide-react";

/* Assistant virtuel Mediasoft (RAG) : bulle en bas à gauche (Tidio reste en bas à droite sur l'accueil).
   Les réponses viennent de l'API Python du dossier mediasoft-chatbot, dont l'adresse est fixée au build
   par NEXT_PUBLIC_CHATBOT_URL. Sans cette variable, la bulle n'est pas affichée. */

// Le chatbot tourne en local seulement : la bulle n'apparaît que si l'API est sur ce poste (127.0.0.1 / localhost),
// sauf si NEXT_PUBLIC_CHATBOT_ONLINE=1 (API hébergée en ligne). Le site publié sur Render n'affiche donc pas la bulle.
const API_URL = process.env.NEXT_PUBLIC_CHATBOT_URL?.replace(/\/$/, "") ?? "";
const API = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(API_URL) || process.env.NEXT_PUBLIC_CHATBOT_ONLINE === "1" ? API_URL : "";
const STORE = "ms-chatbot-v2";

type Source = { title: string; url: string };
type Msg = { role: "user" | "assistant"; content: string; sources?: Source[]; error?: boolean };

/* Textes de la bulle selon la langue du navigateur ; l'assistant, lui, répond dans la langue de chaque question. */
const TEXTS = {
  fr: {
    welcome: "Bonjour ! Je suis l’assistant Mediasoft. Posez-moi vos questions sur nos solutions : Sage, Divalto, Bitrix24, Microsoft 365, Power BI, applications web et agents IA.",
    title: "Assistant Mediasoft",
    notice: "Réponses générées par IA, à vérifier auprès d’un conseiller",
    more: "En savoir plus",
    typing: "L’assistant rédige sa réponse…",
    placeholder: "Votre question…",
    send: "Envoyer",
    close: "Fermer",
    closeLabel: "Fermer l’assistant Mediasoft",
    openLabel: "Ouvrir l’assistant Mediasoft",
    cta: "Une question ?",
    reset: "Nouvelle conversation",
    copy: "Copier",
    copied: "Copié",
    down: "L’assistant est momentanément indisponible. Merci de contacter l’équipe Mediasoft :\n- par e-mail : info@mediasoft.tn\n- par WhatsApp : +216 52 444 444\n- via la page Contactez-nous : https://mediasoft-site.onrender.com/contact",
  },
  en: {
    welcome: "Hello! I’m the Mediasoft assistant. Ask me about our solutions: Sage, Divalto, Bitrix24, Microsoft 365, Power BI, web applications and AI agents.",
    title: "Mediasoft assistant",
    notice: "AI-generated answers, to be confirmed with an advisor",
    more: "Learn more",
    typing: "The assistant is writing…",
    placeholder: "Your question…",
    send: "Send",
    close: "Close",
    closeLabel: "Close the Mediasoft assistant",
    openLabel: "Open the Mediasoft assistant",
    cta: "Any question?",
    reset: "New conversation",
    copy: "Copy",
    copied: "Copied",
    down: "The assistant is temporarily unavailable. Please contact the Mediasoft team:\n- by e-mail: info@mediasoft.tn\n- on WhatsApp: +216 52 444 444\n- through the Contact us page: https://mediasoft-site.onrender.com/contact",
  },
  ar: {
    welcome: "مرحبًا! أنا مساعد ميدياسوفت. اسألني عن حلولنا: Sage وDivalto وBitrix24 وMicrosoft 365 وPower BI وتطبيقات الويب ووكلاء الذكاء الاصطناعي.",
    title: "مساعد ميدياسوفت",
    notice: "إجابات مولّدة بالذكاء الاصطناعي، يُرجى التأكد منها مع مستشار",
    more: "لمعرفة المزيد",
    typing: "المساعد يكتب الإجابة…",
    placeholder: "سؤالك…",
    send: "إرسال",
    close: "إغلاق",
    closeLabel: "إغلاق مساعد ميدياسوفت",
    openLabel: "فتح مساعد ميدياسوفت",
    cta: "لديك سؤال؟",
    reset: "محادثة جديدة",
    copy: "نسخ",
    copied: "تم النسخ",
    down: "المساعد غير متاح حاليًا. يرجى التواصل مع فريق ميدياسوفت:\n- عبر البريد الإلكتروني: info@mediasoft.tn\n- عبر واتساب: +216 52 444 444\n- عبر صفحة اتصل بنا: https://mediasoft-site.onrender.com/contact",
  },
};
type Lang = keyof typeof TEXTS;
const browserLang = (): Lang => {
  const l = navigator.language.slice(0, 2).toLowerCase();
  return l in TEXTS ? (l as Lang) : "fr";
};
const noSubscribe = () => () => {};

/* Liens cliquables dans les réponses : adresses web, e-mails et numéros tunisiens (+216 …). Le numéro WhatsApp
   ouvre WhatsApp, les autres lancent l'appel. */
const WHATSAPP = "21652444444";
const LINK = /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?»"'])|([\w.+-]+@[\w-]+\.[\w.-]*\w)|(\+216[\s\d]{8,12}\d)/g;
function linkify(text: string) {
  const out: (string | React.ReactElement)[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const [s, url, mail, phone] = m;
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    const digits = phone?.replace(/\D/g, "");
    const href = url ?? (mail ? `mailto:${mail}` : digits === WHATSAPP ? `https://wa.me/${digits}` : `tel:+${digits}`);
    out.push(
      <a key={i} href={href} target={url || digits === WHATSAPP ? "_blank" : undefined} rel="noopener noreferrer" className="break-all font-medium underline underline-offset-2">
        {url && url.length > 48 ? url.replace(/^https?:\/\/(www\.)?/, "").slice(0, 44) + "…" : s}
      </a>,
    );
    last = i + s.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/* Mise en forme légère des réponses (le modèle écrit en Markdown) : **gras**, listes « - » ou « 1. », titres « ### ». */
/* Renvois aux sources « [1](https://…) » (posés par l'API) → petit numéro cliquable qui ouvre la page source. */
function withRefs(s: string, k: string) {
  const parts = s.split(/\[([^\]\n]{1,40})\]\((https?:\/\/[^)\s]+)\)/g);
  return parts.map((p, j) =>
    j % 3 === 0 ? (
      <span key={`${k}-${j}`}>{linkify(p)}</span>
    ) : j % 3 === 1 ? (
      <a
        key={`${k}-${j}`}
        href={parts[j + 1]}
        target="_blank"
        rel="noopener noreferrer"
        title={parts[j + 1]}
        className="mx-0.5 inline-grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#1f5fff]/10 px-1 align-super text-[10.5px] font-bold leading-none text-[#1f5fff] no-underline hover:bg-[#1f5fff] hover:text-white"
      >
        {p}
      </a>
    ) : null,
  );
}

function renderAnswer(text: string) {
  const inline = (s: string, k: number) =>
    s.split(/\*\*(.+?)\*\*/g).map((part, j) => (j % 2 ? <strong key={`${k}-${j}`}>{withRefs(part, `${k}-${j}`)}</strong> : <span key={`${k}-${j}`}>{withRefs(part, `${k}-${j}`)}</span>));
  return text.split("\n").map((raw, i) => {
    const line = raw.trim();
    if (!line) return <span key={i} className="block h-2" />;
    // Tableau Markdown (le modèle en écrit parfois) : ligne de séparation et filets masqués, cellules en liste
    if (/^\|?[\s:|-]+\|?$/.test(line) || /^-{3,}$/.test(line)) return null;
    if (line.startsWith("|")) {
      const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
      return (
        <span key={i} className="flex gap-2 ps-1">
          <span aria-hidden>•</span>
          <span>{inline(cells.join(" — "), i)}</span>
        </span>
      );
    }
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const num = line.match(/^(\d+)[.)]\s+(.*)$/);
    const title = line.match(/^#{1,4}\s+(.*)$/);
    if (bullet) return <span key={i} className="flex gap-2 ps-1"><span aria-hidden>•</span><span>{inline(bullet[1], i)}</span></span>;
    if (num) return <span key={i} className="flex gap-2 ps-1"><span className="font-semibold">{num[1]}.</span><span>{inline(num[2], i)}</span></span>;
    if (title) return <strong key={i} className="block">{inline(title[1], i)}</strong>;
    return <span key={i} className="block">{inline(line, i)}</span>;
  });
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  // Français au rendu statique, puis langue du navigateur une fois la page chargée
  const lang = useSyncExternalStore(noSubscribe, browserLang, (): Lang => "fr");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  // Conversation gardée le temps de la visite (changement de page compris)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORE);
      if (saved) setMsgs(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-30)));
    } catch {}
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);
  useEffect(() => {
    if (!open) return;
    field.current?.focus();
    // Réveille le serveur (l'hébergement gratuit s'endort après 15 min) pendant que le visiteur écrit sa question
    fetch(`${API}/api/health`, { signal: AbortSignal.timeout(90_000) }).catch(() => {});
    // Échap referme le panneau
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);


  if (!API) return null;
  const T = TEXTS[lang];

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    const history = msgs.filter((m) => !m.error).map(({ role, content }) => ({ role, content }));
    setMsgs((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setBusy(true);
    try {
      // 90 s au plus (réveil du serveur gratuit compris) : au-delà, message d'indisponibilité plutôt qu'une attente sans fin
      const res = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q.slice(0, 600), history, lang: navigator.language }),
        signal: AbortSignal.timeout(90_000),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.detail || "Erreur");
      setMsgs((m) => [...m, { role: "assistant", content: json.answer, sources: json.sources }]);
    } catch (e) {
      // Seul le message renvoyé par l'API est affiché tel quel ; réseau coupé ou délai dépassé → message d'indisponibilité
      const detail = e instanceof Error && e.name === "Error" ? e.message : "";
      setMsgs((m) => [
        ...m,
        { role: "assistant", error: true, content: detail || T.down },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <>
      {open && (
        <>
          {/* Voile sur la page : un clic le referme */}
          <button
            type="button"
            aria-label={T.closeLabel}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[89] cursor-default bg-[#00193a]/35 backdrop-blur-[2px] motion-safe:animate-[chatbot-fade_0.25s_ease-out] print:hidden"
          />
          {/* Panneau sur toute la hauteur de l'écran, à gauche (plein écran sur mobile) ; z-[90] : au-dessus de l'en-tête */}
          <section
            role="dialog"
            aria-modal="true"
            aria-label={T.title}
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="fixed inset-y-0 left-0 z-[90] flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-[24px_0_80px_-20px_rgba(0,25,58,0.6)] motion-safe:animate-[chatbot-in_0.3s_cubic-bezier(0.2,0.8,0.2,1)] print:hidden sm:w-[min(500px,calc(100vw-48px))] sm:rounded-r-[28px]"
          >
            <header className="flex items-center gap-3 bg-gradient-to-br from-[#00193a] via-[#0b2a66] to-[#1f5fff] px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] text-white">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                <Bot size={24} aria-hidden />
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#22c55e] ring-2 ring-[#0b2a66]" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block font-display text-[18px] font-bold">{T.title}</span>
                <span className="mt-0.5 block text-[12.5px] text-white/70">{T.notice}</span>
              </span>
              {msgs.length > 0 && (
                <button type="button" onClick={() => setMsgs([])} className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-white/15" aria-label={T.reset} title={T.reset}>
                  <RotateCcw size={18} />
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label={T.closeLabel}>
                <X size={20} />
              </button>
            </header>

            {/* data-lenis-prevent : la molette fait défiler la conversation, pas la page derrière */}
            <div ref={list} data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-[#f4f7fb] px-5 py-6" aria-live="polite">
            {[{ role: "assistant", content: T.welcome } as Msg, ...msgs].map((m, i) => (
              <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <span className="mb-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#00193a] text-white" aria-hidden>
                    <Bot size={16} />
                  </span>
                )}
                <div
                  dir="auto"
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                    m.role === "user" ? "rounded-br-md bg-[#1f5fff] text-white" : m.error ? "rounded-bl-md bg-[#fff1ef] text-[#8a2a14]" : "rounded-bl-md bg-white text-[#0b1b33] shadow-sm ring-1 ring-[#00193a]/10"
                  }`}
                >
                  {m.role === "assistant" ? renderAnswer(m.content) : m.content}
                  {/* Réponse longue (article rédigé…) : bouton pour la copier telle quelle (Markdown) */}
                  {m.role === "assistant" && !m.error && m.content.length > 600 && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(m.content).then(() => {
                          setCopied(i);
                          window.setTimeout(() => setCopied(null), 1500);
                        });
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#1f5fff]/25 px-3 py-1 text-[12px] font-semibold text-[#1f5fff] hover:bg-[#eef3ff]"
                    >
                      {copied === i ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
                      {copied === i ? T.copied : T.copy}
                    </button>
                  )}
                  {!!m.sources?.length && (
                    <span className="mt-2 flex flex-col gap-1 border-t border-line pt-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-soft">{T.more}</span>
                      {m.sources.map((s) => (
                        <a key={s.url} href={s.url} className="truncate text-[12.5px] font-medium text-[#1f5fff] hover:underline">
                          {s.title}
                        </a>
                      ))}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 ps-10 text-[13.5px] text-[#0b1b33]/60">
                <Loader2 size={16} className="animate-spin" aria-hidden /> {T.typing}
              </div>
            )}
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-[#00193a]/10 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
              <input
                ref={field}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={600}
                dir="auto"
                placeholder={T.placeholder}
                aria-label={T.placeholder}
                className="min-w-0 flex-1 rounded-full border border-[#00193a]/15 bg-[#f4f7fb] px-5 py-3.5 text-[15px] outline-none transition-colors focus:border-[#1f5fff] focus:bg-white"
              />
              <button type="submit" disabled={busy || !input.trim()} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#1f5fff] text-white shadow-[0_8px_20px_-6px_rgba(31,95,255,0.7)] transition-opacity disabled:opacity-40" aria-label={T.send}>
                <Send size={18} className={lang === "ar" ? "-scale-x-100" : ""} />
              </button>
            </form>
          </section>
        </>
      )}

      {!open && (
      // Bulle de lancement, en bas à gauche
      <div className="fixed bottom-4 left-4 z-[90] print:hidden sm:bottom-5 sm:left-5">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={false}
        aria-label={T.openLabel}
        className="group relative flex h-16 items-center gap-2.5 rounded-full bg-gradient-to-r from-[#1f5fff] to-[#3d8bff] pl-4 pr-6 text-white shadow-[0_16px_36px_-8px_rgba(31,95,255,0.75)] ring-4 ring-white transition-transform hover:scale-[1.04]"
      >
        {/* Halo animé tant que la conversation n'a pas commencé */}
        {msgs.length === 0 && <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#1f5fff]/40" aria-hidden />}
        <span className="relative grid h-10 w-10 place-items-center rounded-full bg-white/20">
          <Bot size={22} />
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-[#22c55e] ring-2 ring-[#1f5fff]" aria-hidden />
        </span>
        <span className="text-[15px] font-bold">{T.cta}</span>
      </button>
      </div>
      )}
    </>
  );
}
