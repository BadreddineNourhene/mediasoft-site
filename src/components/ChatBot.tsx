"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { ArrowUp, Bot, Check, FileText, Globe, Lightbulb, Loader2, Mic, Paperclip, Plus, RotateCcw, Square, X } from "lucide-react";

/* Assistant virtuel Mediasoft (RAG) : bulle en bas à gauche (Tidio reste en bas à droite sur l'accueil).
   Les réponses viennent de l'API Python du dossier mediasoft-chatbot, dont l'adresse est fixée au build
   par NEXT_PUBLIC_CHATBOT_URL. Sans cette variable, la bulle n'est pas affichée. */

// Le chatbot tourne en local seulement : la bulle n'apparaît que si l'API est sur ce poste (127.0.0.1 / localhost),
// sauf si NEXT_PUBLIC_CHATBOT_ONLINE=1 (API hébergée en ligne). Le site publié sur Render n'affiche donc pas la bulle.
const API_URL = process.env.NEXT_PUBLIC_CHATBOT_URL?.replace(/\/$/, "") ?? "";
const API = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(API_URL) || process.env.NEXT_PUBLIC_CHATBOT_ONLINE === "1" ? API_URL : "";
const STORE = "ms-chatbot-v2";

type Source = { title: string; url: string };
/* Boutons proposés sous une réponse (envoyés par l'API) : une seule question sans « submit » → un clic envoie l'option
   (ou « template » où {0} est remplacé) ; sinon un choix par question puis « submit » envoie le template rempli. */
type Choices = { questions: { label?: string; options: string[] }[]; note?: string; submit?: string; template?: string };
type Msg = { role: "user" | "assistant"; content: string; sources?: Source[]; error?: boolean; choices?: Choices; file?: string };
// Fichier joint : texte extrait par l'API (/api/fichier), renvoyé avec chaque question tant qu'il reste joint
type Doc = { nom: string; texte: string };
const ACCEPT = ".pdf,.docx,.xlsx,.xlsm,.csv,.txt,.md";
// Dictée vocale du navigateur (Chrome, Edge, Safari) : le bouton micro n'apparaît que si elle existe
type Speech = { lang: string; interimResults: boolean; continuous: boolean; start(): void; stop(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null; onerror: ((e: { error: string }) => void) | null };
const speechCtor = (): (new () => Speech) | undefined => {
  const w = window as unknown as { SpeechRecognition?: new () => Speech; webkitSpeechRecognition?: new () => Speech };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

/* Textes de la bulle selon la langue du navigateur ; l'assistant, lui, répond dans la langue de chaque question. */
const TEXTS = {
  fr: {
    welcome: "Bonjour ! Je suis l’assistant Mediasoft. Posez-moi vos questions sur nos solutions : Sage, Divalto, Bitrix24, Microsoft 365, Power BI, applications web et agents IA.",
    title: "Assistant Mediasoft",
    notice: "Réponses générées par IA, à vérifier auprès d’un conseiller",
    more: "En savoir plus",
    typing: "L’assistant rédige sa réponse…",
    long: "Réponse détaillée en préparation, encore quelques secondes…",
    placeholder: "Votre question…",
    send: "Envoyer",
    close: "Fermer",
    closeLabel: "Fermer l’assistant Mediasoft",
    openLabel: "Ouvrir l’assistant Mediasoft",
    cta: "Mediasoft AI",
    reset: "Nouvelle conversation",
    attach: "Joindre un fichier (PDF, Word, Excel, CSV, texte)",
    removeFile: "Retirer le fichier",
    reading: "Lecture du fichier…",
    summarize: "Résume ce document et dis-moi ce qu’il faut retenir.",
    web: "Recherche web",
    webD: "Trouver des informations récentes sur internet",
    webShort: "Recherche",
    plus: "Ajouter des fichiers et plus",
    files: "Ajouter des fichiers",
    filesD: "PDF, Word, Excel, CSV ou texte, depuis l’ordinateur",
    detail: "Réponse détaillée",
    detailD: "Une réponse complète et approfondie",
    detailShort: "Détaillée",
    removeMode: "Désactiver",
    webOn: "Recherche web activée : chaque question est aussi cherchée sur internet",
    mic: "Dicter ma question",
    micStop: "Arrêter la dictée",
    micDenied: "Accès au micro refusé : autorisez-le dans les réglages du navigateur pour dicter vos questions.",
    next: "Continuer",
    down: "L’assistant est momentanément indisponible. Merci de contacter l’équipe Mediasoft :\n- par e-mail : info@mediasoft.tn\n- par WhatsApp : +216 52 444 444\n- via la page Contactez-nous : https://mediasoft-site.onrender.com/contact",
  },
  en: {
    welcome: "Hello! I’m the Mediasoft assistant. Ask me about our solutions: Sage, Divalto, Bitrix24, Microsoft 365, Power BI, web applications and AI agents.",
    title: "Mediasoft assistant",
    notice: "AI-generated answers, to be confirmed with an advisor",
    more: "Learn more",
    typing: "The assistant is writing…",
    long: "Preparing a detailed answer, just a few more seconds…",
    placeholder: "Your question…",
    send: "Send",
    close: "Close",
    closeLabel: "Close the Mediasoft assistant",
    openLabel: "Open the Mediasoft assistant",
    cta: "Mediasoft AI",
    reset: "New conversation",
    attach: "Attach a file (PDF, Word, Excel, CSV, text)",
    removeFile: "Remove the file",
    reading: "Reading the file…",
    summarize: "Summarise this document and tell me the key points.",
    web: "Web search",
    webD: "Find recent information on the internet",
    webShort: "Search",
    plus: "Add files and more",
    files: "Add files",
    filesD: "PDF, Word, Excel, CSV or text, from your computer",
    detail: "Detailed answer",
    detailD: "A complete, in-depth answer",
    detailShort: "Detailed",
    removeMode: "Turn off",
    webOn: "Web search on: each question is also searched on the internet",
    mic: "Dictate my question",
    micStop: "Stop dictation",
    micDenied: "Microphone access denied: allow it in your browser settings to dictate your questions.",
    next: "Continue",
    down: "The assistant is temporarily unavailable. Please contact the Mediasoft team:\n- by e-mail: info@mediasoft.tn\n- on WhatsApp: +216 52 444 444\n- through the Contact us page: https://mediasoft-site.onrender.com/contact",
  },
  ar: {
    welcome: "مرحبًا! أنا مساعد ميدياسوفت. اسألني عن حلولنا: Sage وDivalto وBitrix24 وMicrosoft 365 وPower BI وتطبيقات الويب ووكلاء الذكاء الاصطناعي.",
    title: "مساعد ميدياسوفت",
    notice: "إجابات مولّدة بالذكاء الاصطناعي، يُرجى التأكد منها مع مستشار",
    more: "لمعرفة المزيد",
    typing: "المساعد يكتب الإجابة…",
    long: "جارٍ إعداد إجابة مفصّلة، بضع ثوانٍ أخرى…",
    placeholder: "سؤالك…",
    send: "إرسال",
    close: "إغلاق",
    closeLabel: "إغلاق مساعد ميدياسوفت",
    openLabel: "فتح مساعد ميدياسوفت",
    cta: "Mediasoft AI",
    reset: "محادثة جديدة",
    attach: "إرفاق ملف (PDF، Word، Excel، CSV، نص)",
    removeFile: "إزالة الملف",
    reading: "جارٍ قراءة الملف…",
    summarize: "لخّص هذا المستند وأخبرني بأهم ما فيه.",
    web: "بحث على الويب",
    webD: "العثور على معلومات حديثة على الإنترنت",
    webShort: "بحث",
    plus: "إضافة ملفات والمزيد",
    files: "إضافة ملفات",
    filesD: "PDF أو Word أو Excel أو CSV أو نص، من الحاسوب",
    detail: "إجابة مفصّلة",
    detailD: "إجابة كاملة ومعمّقة",
    detailShort: "مفصّلة",
    removeMode: "إلغاء التفعيل",
    webOn: "البحث على الويب مفعّل: يُبحث عن كل سؤال على الإنترنت أيضًا",
    mic: "إملاء سؤالي",
    micStop: "إيقاف الإملاء",
    micDenied: "تم رفض الوصول إلى الميكروفون: اسمح به في إعدادات المتصفح لإملاء أسئلتك.",
    next: "متابعة",
    down: "المساعد غير متاح حاليًا. يرجى التواصل مع فريق ميدياسوفت:\n- عبر البريد الإلكتروني: info@mediasoft.tn\n- عبر واتساب: +216 52 444 444\n- عبر صفحة اتصل بنا: https://mediasoft-site.onrender.com/contact",
  },
};
type Lang = keyof typeof TEXTS;
// Langue de la page (<html lang="fr">), pas celle du navigateur : le site est en français, la bulle aussi
const pageLang = (): Lang => {
  const l = (document.documentElement.lang || "fr").slice(0, 2).toLowerCase();
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
  const parts = s.split(/\[([^\]\n]{1,90})\]\((https?:\/\/[^)\s]+)\)/g);
  return parts.map((p, j) =>
    j % 3 === 0 ? (
      <span key={`${k}-${j}`}>{linkify(p)}</span>
    ) : j % 3 === 1 && !/^\d+$/.test(p) ? (
      <a key={`${k}-${j}`} href={parts[j + 1]} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1f5fff] underline underline-offset-2 hover:text-[#00193a]">
        {p}
      </a>
    ) : j % 3 === 1 ? (
      <a
        key={`${k}-${j}`}
        href={parts[j + 1]}
        target="_blank"
        rel="noopener noreferrer"
        title={parts[j + 1]}
        className="mx-0.5 inline-grid h-[22px] min-w-[22px] place-items-center rounded-full bg-[#1f5fff]/10 px-1.5 align-super text-[11.5px] font-bold leading-none text-[#1f5fff] no-underline hover:bg-[#1f5fff] hover:text-white active:scale-95"
      >
        {p}
      </a>
    ) : null,
  );
}

function renderAnswer(text: string) {
  const inline = (s: string, k: number) =>
    s.split(/\*\*(.+?)\*\*/g).map((part, j) =>
      j % 2 ? (
        <strong key={`${k}-${j}`}>{withRefs(part, `${k}-${j}`)}</strong>
      ) : (
        part.split(/(?<![\w*])\*([^*\n]+)\*(?![\w*])/g).map((p, n) =>
          n % 2 ? <em key={`${k}-${j}-${n}`}>{withRefs(p, `${k}-${j}-${n}`)}</em> : <span key={`${k}-${j}-${n}`}>{withRefs(p, `${k}-${j}-${n}`)}</span>,
        )
      ),
    );
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

/* Texte en cours de rédaction (streaming) : ligne « CHOIX : … », code [INCONNU] et renvois « [1] » / « 【W1】 » masqués,
   la réponse finale les remplace par les choix et les petits liens numérotés */
const brouillon = (s: string) =>
  s
    .replace(/^\W*(?:CHOIX|CHOICES?|خيارات)\W*:.*$/gim, "")
    .replace(/\[INCONNU\]/g, "")
    .replace(/【[^】]*】?|\[(?:W?\d+(?:\s*[,;]\s*W?\d+)*)\]/g, "")
    .trimEnd();

function ChoiceButtons({ c, onSend, disabled, next }: { c: Choices; onSend: (q: string) => void; disabled: boolean; next: string }) {
  // Formulaire (plusieurs questions) : un choix par question, la première option cochée d'office (celle conseillée) ;
  // simple précision (une question) : cases à cocher, rien de coché, le visiteur en coche une ou plusieurs puis valide
  const single = c.questions.length === 1;
  const [sel, setSel] = useState<string[][]>(() => c.questions.map((q) => (single ? [] : [q.options[0]])));
  const fill = (values: string[]) => values.reduce((t, v, n) => t.replaceAll(`{${n}}`, v), c.template ?? "{0}");
  // Options cochées dans l'ordre affiché, réunies en une seule réponse (« GMAO, Production »)
  const valeurs = () => sel.map((v, i) => c.questions[i].options.filter((o) => v.includes(o)).join(", "));
  const choisir = (i: number, o: string) =>
    setSel((s) => s.map((v, n) => (n !== i ? v : !single ? [o] : v.includes(o) ? v.filter((x) => x !== o) : [...v, o])));
  // Même carte que ChatGPT partout : options en liste verticale, filet entre les questions, bouton noir sur toute la
  // largeur, conseil sous la carte
  return (
    <div className="ms-10 max-w-[90%] space-y-3">
      <div className="rounded-2xl border border-[#00193a]/12 bg-white p-4 text-[14.5px] text-[#0b1b33] shadow-sm">
        {c.questions.map((q, i) => (
          <div key={i} role={single ? "group" : "radiogroup"} aria-label={q.label} className={i ? "mt-3 border-t border-[#00193a]/10 pt-3" : ""}>
            {q.label && <p className="mb-2 font-semibold">{q.label}</p>}
            <div className="flex flex-col">
              {q.options.map((o) => {
                const on = sel[i].includes(o);
                return (
                  <button
                    key={o}
                    type="button"
                    disabled={disabled}
                    role={single ? "checkbox" : "radio"}
                    aria-checked={on}
                    onClick={() => choisir(i, o)}
                    className="flex min-h-11 items-center gap-3 rounded-lg px-2 py-2 text-start leading-snug transition-colors hover:bg-[#f4f7fb] active:bg-[#e8eef8] disabled:opacity-50"
                  >
                    {single ? (
                      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 ${on ? "border-[#0b1b33] bg-[#0b1b33] text-white" : "border-[#00193a]/30"}`} aria-hidden>
                        {on && <Check size={14} strokeWidth={3} />}
                      </span>
                    ) : (
                      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-[#0b1b33]" : "border-[#00193a]/30"}`} aria-hidden>
                        {on && <span className="h-2.5 w-2.5 rounded-full bg-[#0b1b33]" />}
                      </span>
                    )}
                    <span>{o}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <button
          type="button"
          disabled={disabled || sel.some((v) => !v.length)}
          onClick={() => onSend(fill(valeurs()))}
          className="mt-3 min-h-11 w-full rounded-full bg-[#0b1b33] px-5 py-2.5 text-[14.5px] font-bold text-white transition hover:bg-[#1f5fff] active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-[#0b1b33] disabled:active:scale-100"
        >
          {c.submit ?? next}
        </button>
      </div>
      {/* « Mon conseil » : sous la carte */}
      {c.note && <div className="px-1 text-[14.5px] leading-relaxed text-[#0b1b33]">{renderAnswer(c.note)}</div>}
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  // Langue de la page (français) ; les réponses, elles, suivent la langue de chaque question
  const lang = useSyncExternalStore(noSubscribe, pageLang, (): Lang => "fr");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const [slow, setSlow] = useState(false);
  // Réponse en cours de rédaction, affichée au fil du streaming
  const [live, setLive] = useState("");
  const [doc, setDoc] = useState<Doc | null>(null);
  const [reading, setReading] = useState(false);
  const [web, setWeb] = useState(false);
  const [detail, setDetail] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuBox = useRef<HTMLDivElement>(null);
  const [listening, setListening] = useState(false);
  const rec = useRef<Speech | null>(null);
  const picker = useRef<HTMLInputElement>(null);
  const canSpeak = useSyncExternalStore(noSubscribe, () => !!speechCtor(), () => false);

  // Conversation gardée d'une page du site à l'autre ; une actualisation (F5) repart d'une conversation vide
  useEffect(() => {
    try {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav?.type === "reload") return sessionStorage.removeItem(STORE);
      const saved = sessionStorage.getItem(STORE);
      if (saved) setMsgs(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-30)));
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [msgs]);
  useEffect(() => {
    if (!open) return;
    field.current?.focus();
    // Réveille le serveur (l'hébergement gratuit s'endort après 15 min) pendant que le visiteur écrit sa question
    fetch(`${API}/api/health`, { signal: AbortSignal.timeout(90_000) }).catch(() => {});
  }, [open]);
  useEffect(() => {
    if (!open) return;
    // Échap referme le menu + s'il est ouvert, sinon le panneau ; un clic hors du menu le referme
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (menu ? setMenu(false) : setOpen(false));
    const onDown = (e: MouseEvent) => menu && !menuBox.current?.contains(e.target as Node) && setMenu(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open, menu]);


  // La conversation suit le texte qui s'écrit
  useEffect(() => {
    if (live) list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [live]);

  useEffect(() => {
    if (!busy) return setSlow(false);
    const t = setTimeout(() => setSlow(true), 8000);
    return () => clearTimeout(t);
  }, [busy]);

  // La zone de saisie s'agrandit avec le texte (5 lignes au plus)
  useEffect(() => {
    const el = field.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [input, open]);

  if (!API) return null;
  const T = TEXTS[lang];

  const ask = async (question: string) => {
    rec.current?.stop();
    const q = question.trim() || (doc ? T.summarize : "");
    if (!q || busy || reading) return;
    const history = msgs.filter((m) => !m.error).map(({ role, content }) => ({ role, content }));
    // Le nom du fichier s'affiche sur la première question posée après l'avoir joint
    const first = !!doc && !msgs.some((m) => m.file === doc.nom);
    setMsgs((m) => [...m, { role: "user", content: q, file: first ? doc?.nom : undefined }]);
    setInput("");
    setBusy(true);
    try {
      // Streaming : une ligne JSON par événement (texte au fil de la rédaction, puis réponse finale) ;
      // 150 s au plus (article détaillé compris) : au-delà, message d'indisponibilité plutôt qu'une attente sans fin
      const res = await fetch(`${API}/api/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q.slice(0, 600), history, lang, web, detail, document: doc }),
        signal: AbortSignal.timeout(150_000),
      });
      if (!res.ok || !res.body) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.detail || "Erreur");
      }
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buf = "";
      let texte = "";
      let fini = false;
      while (!fini) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += value;
        for (let n = buf.indexOf("\n"); n >= 0 && !fini; n = buf.indexOf("\n")) {
          const ligne = buf.slice(0, n).trim();
          buf = buf.slice(n + 1);
          if (!ligne) continue;
          const e = JSON.parse(ligne);
          if (e.t === "delta") setLive((texte += e.v));
          else if (e.t === "reset") setLive((texte = ""));
          else if (e.t === "error") throw new Error(e.v?.detail ?? "");
          else if (e.t === "done") {
            const json = e.v;
            setMsgs((m) => [...m, { role: "assistant", content: json.answer, sources: json.sources, choices: json.choices }]);
            fini = true;
          }
        }
      }
      // Flux coupé avant la réponse finale (réseau) : message d'indisponibilité
      if (!fini) throw new TypeError("flux interrompu");
    } catch (e) {
      // Seul le message renvoyé par l'API est affiché tel quel ; réseau coupé ou délai dépassé → message d'indisponibilité
      const detail = e instanceof Error && e.name === "Error" ? e.message : "";
      setMsgs((m) => [
        ...m,
        { role: "assistant", error: true, content: detail || T.down },
      ]);
    } finally {
      setLive("");
      setBusy(false);
    }
  };

  // Fichier : l'API en extrait le texte (le fichier n'est pas conservé) ; une erreur s'affiche dans la conversation
  const attach = async (file: File | undefined) => {
    if (!file) return;
    setReading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API}/api/fichier?lang=${lang}`, {
        method: "POST",
        body: form,
        signal: AbortSignal.timeout(120_000),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.detail || "Erreur");
      setDoc({ nom: json.nom, texte: json.texte });
      field.current?.focus();
    } catch (e) {
      const detail = e instanceof Error && e.name === "Error" ? e.message : "";
      setMsgs((m) => [...m, { role: "assistant", error: true, content: detail || T.down }]);
    } finally {
      setReading(false);
      if (picker.current) picker.current.value = "";
    }
  };

  // Dictée : le texte reconnu s'ajoute à ce qui est déjà écrit ; un second appui arrête
  const toggleMic = () => {
    if (listening) return rec.current?.stop();
    const Ctor = speechCtor();
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = navigator.language || "fr-FR";
    r.interimResults = true;
    r.continuous = false;
    const base = input.trim();
    r.onresult = (e) => {
      const said = Array.from(e.results, (res) => res[0].transcript).join(" ");
      setInput(base ? `${base} ${said}` : said);
    };
    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setMsgs((m) => [...m, { role: "assistant", error: true, content: T.micDenied }]);
      }
    };
    r.onend = () => {
      setListening(false);
      rec.current = null;
    };
    rec.current = r;
    setListening(true);
    r.start();
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
            className="fixed inset-y-0 left-0 z-[90] flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-[24px_0_80px_-20px_rgba(0,25,58,0.6)] motion-safe:animate-[chatbot-in_0.3s_cubic-bezier(0.2,0.8,0.2,1)] print:hidden sm:w-[min(760px,calc(100vw-48px))] sm:rounded-r-[28px]"
          >
            <header className="flex items-center gap-3 bg-gradient-to-br from-[#00193a] via-[#0b2a66] to-[#1f5fff] px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] text-white">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                <Bot size={24} aria-hidden />
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#22c55e] ring-2 ring-[#0b2a66]" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block font-display text-[18px] font-bold">{T.title}</span>
                <span className="mt-0.5 block text-[13px] text-white/80">{T.notice}</span>
              </span>
              {msgs.length > 0 && (
                <button type="button" onClick={() => { setMsgs([]); setDoc(null); }} className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-white/15 active:bg-white/25" aria-label={T.reset} title={T.reset}>
                  <RotateCcw size={18} />
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30" aria-label={T.closeLabel}>
                <X size={20} />
              </button>
            </header>

            {/* data-lenis-prevent : la molette fait défiler la conversation, pas la page derrière */}
            <div ref={list} data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-[#f4f7fb] px-5 py-6" aria-live="polite">
            {[{ role: "assistant", content: T.welcome } as Msg, ...msgs].map((m, i) => (
              <div key={i} className="space-y-2">
              <div className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <span className="mb-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#00193a] text-white" aria-hidden>
                    <Bot size={16} />
                  </span>
                )}
                <div
                  dir="auto"
                  className={`max-w-[90%] whitespace-pre-line rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                    m.role === "user" ? "rounded-br-md bg-[#1f5fff] text-white" : m.error ? "rounded-bl-md bg-[#fff1ef] text-[#8a2a14]" : "rounded-bl-md bg-white text-[#0b1b33] shadow-sm ring-1 ring-[#00193a]/10"
                  }`}
                >
                  {m.file && (
                    <span className="mb-1.5 flex items-center gap-1.5 rounded-lg bg-white/15 px-2 py-1 text-[13px] font-medium">
                      <FileText size={14} aria-hidden /> <span className="truncate">{m.file}</span>
                    </span>
                  )}
                  {m.role === "assistant" ? renderAnswer(m.content) : m.content}
                  {!!m.sources?.length && (
                    <span className="mt-2 flex flex-col gap-1 border-t border-line pt-2">
                      <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-soft">{T.more}</span>
                      {m.sources.map((s) => (
                        <a key={s.url} href={s.url} className="truncate py-1 text-[14px] font-medium text-[#1f5fff] hover:underline">
                          {s.title}
                        </a>
                      ))}
                    </span>
                  )}
                </div>
              </div>
              {/* Choix proposés : seulement sous la dernière réponse (un clic l'envoie comme nouvelle question) */}
              {m.choices && i === msgs.length && <ChoiceButtons key={i} c={m.choices} onSend={ask} disabled={busy} next={T.next} />}
              </div>
            ))}
            {busy && brouillon(live) ? (
              // Réponse qui s'écrit : même bulle que les réponses ; lue par les lecteurs d'écran une fois terminée
              <div className="flex items-end gap-2" aria-live="off">
                <span className="mb-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#00193a] text-white" aria-hidden>
                  <Bot size={16} />
                </span>
                <div dir="auto" className="max-w-[90%] whitespace-pre-line rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[15px] leading-relaxed text-[#0b1b33] shadow-sm ring-1 ring-[#00193a]/10">
                  {renderAnswer(brouillon(live))}
                  <span className="ms-0.5 inline-block h-4 w-1.5 translate-y-0.5 rounded-sm bg-[#1f5fff] motion-safe:animate-pulse" aria-hidden />
                </div>
              </div>
            ) : busy && (
              <div className="flex items-center gap-2 ps-10 text-[14px] text-[#0b1b33]/75" role="status">
                <Loader2 size={16} className="motion-safe:animate-spin" aria-hidden /> {slow ? T.long : T.typing}
              </div>
            )}
            </div>

            <form onSubmit={onSubmit} className="border-t border-[#00193a]/10 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <input ref={picker} type="file" accept={ACCEPT} hidden onChange={(e) => attach(e.target.files?.[0])} />
              <div ref={menuBox} className="relative">
                {/* Menu « + » comme ChatGPT : s'ouvre au-dessus de la zone de saisie */}
                {menu && (
                  <div role="menu" aria-label={T.plus} className="absolute bottom-full start-0 z-10 mb-2 w-[min(380px,100%)] rounded-2xl border border-[#00193a]/12 bg-white p-1.5 shadow-[0_18px_50px_-12px_rgba(0,25,58,0.35)] motion-safe:animate-[chatbot-fade_0.15s_ease-out]">
                    {(
                      [
                        { icon: Paperclip, label: T.files, desc: T.filesD, run: () => picker.current?.click() },
                        { icon: Globe, label: T.web, desc: T.webD, on: web, run: () => setWeb((v) => !v) },
                        { icon: Lightbulb, label: T.detail, desc: T.detailD, on: detail, run: () => setDetail((v) => !v) },
                      ] as { icon: typeof Globe; label: string; desc: string; on?: boolean; run: () => void }[]
                    ).map(({ icon: Icon, label, desc, on, run }) => (
                      <button
                        key={label}
                        type="button"
                        role={on === undefined ? "menuitem" : "menuitemcheckbox"}
                        aria-checked={on}
                        onClick={() => {
                          setMenu(false);
                          run();
                          field.current?.focus();
                        }}
                        className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-start transition-colors hover:bg-[#f4f7fb] active:bg-[#e8eef8] disabled:opacity-40"
                      >
                        <Icon size={18} className={on ? "shrink-0 text-[#1f5fff]" : "shrink-0 text-[#0b1b33]"} aria-hidden />
                        <span className="min-w-0 flex-1 leading-tight">
                          <span className="block text-[14.5px] font-medium text-[#0b1b33]">{label}</span>
                          <span className="block text-[13px] text-[#0b1b33]/65">{desc}</span>
                        </span>
                        {on && <Check size={18} className="shrink-0 text-[#1f5fff]" aria-hidden />}
                      </button>
                    ))}
                  </div>
                )}

                <div className="rounded-[28px] border border-[#00193a]/15 bg-white p-1.5 shadow-[0_4px_18px_-8px_rgba(0,25,58,0.25)] transition-colors focus-within:border-[#1f5fff]">
                  {(doc || reading) && (
                    <div className="flex px-1.5 pb-1 pt-1">
                      <span className="flex max-w-full items-center gap-2 rounded-xl border border-[#00193a]/12 bg-[#f4f7fb] py-1.5 pe-1 ps-2.5 text-[13.5px] text-[#0b1b33]">
                        {reading ? <Loader2 size={16} className="shrink-0 motion-safe:animate-spin" aria-hidden /> : <FileText size={16} className="shrink-0 text-[#1f5fff]" aria-hidden />}
                        <span className="truncate">{reading ? T.reading : doc?.nom}</span>
                        {doc && !reading && (
                          <button type="button" onClick={() => setDoc(null)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-white active:bg-[#e8eef8]" aria-label={T.removeFile} title={T.removeFile}>
                            <X size={14} />
                          </button>
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex items-end gap-1">
                    <button
                      type="button"
                      onClick={() => setMenu((v) => !v)}
                      aria-haspopup="menu"
                      aria-expanded={menu}
                      aria-label={T.plus}
                      title={T.plus}
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors ${menu ? "bg-[#00193a]/10" : "hover:bg-[#00193a]/[0.06]"} active:bg-[#00193a]/10`}
                    >
                      <Plus size={20} className={`transition-transform ${menu ? "rotate-45" : ""}`} />
                    </button>
                    <textarea
                      ref={field}
                      rows={1}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                          e.preventDefault();
                          ask(input);
                        }
                      }}
                      maxLength={600}
                      dir="auto"
                      placeholder={T.placeholder}
                      aria-label={T.placeholder}
                      className="chat-input block max-h-[132px] min-h-11 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-1 py-2.5 text-[15px] leading-6 outline-none [scrollbar-width:thin]"
                    />
                    {/* Modes actifs (comme « Think » chez ChatGPT) : un clic les désactive */}
                    {(
                      [
                        { on: web, icon: Globe, label: T.webShort, off: () => setWeb(false) },
                        { on: detail, icon: Lightbulb, label: T.detailShort, off: () => setDetail(false) },
                      ] as const
                    ).map(({ on, icon: Icon, label, off }) =>
                      on ? (
                        <button
                          key={label}
                          type="button"
                          onClick={off}
                          title={`${T.removeMode} : ${label}`}
                          aria-label={`${T.removeMode} : ${label}`}
                          className="group flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-[14px] font-medium text-[#1f5fff] hover:bg-[#1f5fff]/10 active:bg-[#1f5fff]/15"
                        >
                          <Icon size={17} className="group-hover:hidden" aria-hidden />
                          <X size={17} className="hidden group-hover:block" aria-hidden />
                          <span className="hidden sm:inline">{label}</span>
                        </button>
                      ) : null,
                    )}
                    {canSpeak && (
                      <button
                        type="button"
                        onClick={toggleMic}
                        aria-pressed={listening}
                        aria-label={listening ? T.micStop : T.mic}
                        title={listening ? T.micStop : T.mic}
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors ${
                          listening ? "bg-[#e5484d] text-white motion-safe:animate-pulse" : "text-[#0b1b33] hover:bg-[#00193a]/[0.06] active:bg-[#00193a]/10"
                        }`}
                      >
                        {listening ? <Square size={16} fill="currentColor" /> : <Mic size={20} />}
                      </button>
                    )}
                    <button type="submit" disabled={busy || reading || (!input.trim() && !doc)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1f5fff] text-white transition hover:bg-[#0b47e0] active:scale-95 disabled:bg-[#00193a]/15 disabled:active:scale-100" aria-label={T.send}>
                      <ArrowUp size={20} />
                    </button>
                  </div>
                </div>
              </div>
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
        className="group relative flex h-16 items-center gap-2.5 rounded-full bg-gradient-to-r from-[#1f5fff] to-[#3d8bff] pl-4 pr-6 text-white shadow-[0_16px_36px_-8px_rgba(31,95,255,0.75)] ring-4 ring-white transition-transform motion-safe:hover:scale-[1.04] active:scale-[0.97]"
      >
        {/* Halo : quelques pulsations tant que la conversation n'a pas commencé (aucune si le visiteur a demandé de
            réduire les animations) */}
        {msgs.length === 0 && <span className="absolute inset-0 -z-10 rounded-full bg-[#1f5fff]/40 motion-safe:animate-[ping_1s_cubic-bezier(0,0,0.2,1)_4]" aria-hidden />}
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
