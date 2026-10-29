"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Cloud,
  Globe,
  Layers,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Monitor,
  MoreHorizontal,
  Phone,
  Send,
  Settings,
  User,
} from "lucide-react";
import { links } from "@/lib/site";

/* Formulaire complet de la page contact, d'après la maquette fournie par Mediasoft.
   Ajout demandé : « Êtes-vous déjà client ? ». Oui → les produits (Sage 100, Sage 50Ciel, Divalto, Bitrix24,
   Microsoft 365, Power BI) apparaissent. Les autres demandes restent toujours visibles.
   Envoi inchangé : JSON vers /site/send.php avec les champs d'origine
   (name, email, phone, rs, activity, city, country, option[], message). Les libellés envoyés dans option[]
   sont ceux du formulaire d'origine (requestOptions). */

type Errors = Record<string, string[]>;

const MAX_MESSAGE = 500;



/* Cartes : logo dans un cadre de taille fixe à gauche, nom en gras et précision courte à droite.
   La question au-dessus (« Quel(s) produit(s) utilisez-vous ? ») remplace la répétition « Je suis un client ».
   `value` garde le libellé d'origine envoyé dans option[]. */
const logo = (src: string, alt: string, cls = "max-h-7") => <img src={src} alt={alt} className={`${cls} max-w-full object-contain`} />;

const products: { value: string; logo: ReactNode; name: string; sub: string }[] = [
  { value: "Je suis un client Sage 100", logo: logo("/img/logos/logo-sage.svg", "Sage", "max-h-6"), name: "Sage 100", sub: "Compta & gestion" },
  { value: "Je suis un client Sage 50Ciel", logo: logo("/img/logos/logo-ciel.png", "Ciel", "max-h-8"), name: "Sage 50 Ciel", sub: "Gestion des TPE" },
  { value: "Je suis un client Divalto", logo: logo("/img/logos/logo-divalto.png", "Divalto", "max-h-5"), name: "Divalto", sub: "ERP" },
  { value: "Je suis un client Bitrix24", logo: logo("/img/logos/logo-bitrix24.png", "Bitrix24", "max-h-5"), name: "Bitrix24", sub: "CRM" },
  { value: "Je suis un client Microsoft365", logo: logo("/img/logos/logo-microsoft-365.png", "Microsoft 365", "max-h-6"), name: "Microsoft 365", sub: "Bureautique" },
  { value: "Je suis un client Power BI", logo: logo("/img/logos/logo-power-bi-icon.svg", "Power BI", "max-h-8"), name: "Power BI", sub: "Tableaux de bord" },
];

const needs: { value: string; icon: ReactNode; name: string; sub: string }[] = [
  { value: "Hébergement Cloud", icon: <Cloud size={20} strokeWidth={1.8} />, name: "Hébergement Cloud", sub: "Vos logiciels en ligne" },
  { value: "Je souhaite une solution sur mesure (site, application, agent IA)", icon: <Settings size={20} strokeWidth={1.8} />, name: "Solution sur mesure", sub: "Web, agent IA" },
  { value: "Je souhaite une démonstration", icon: <Monitor size={20} strokeWidth={1.8} />, name: "Démonstration", sub: "Voir le logiciel en action" },
  { value: "Je souhaite être contacté", icon: <Phone size={19} strokeWidth={1.8} />, name: "Être contacté", sub: "On vous rappelle" },
  { value: "Autre", icon: <MoreHorizontal size={20} />, name: "Autre", sub: "À préciser" },
];

function Panel({ icon, title, sub, aside, children }: { icon: ReactNode; title: string; sub?: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[18px] border border-white/10 bg-white/[0.05] p-4 md:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-[#7cc4f5]">{icon}</span>
          <div>
            <h3 className="text-[17px] !text-white md:text-[18px]">{title}</h3>
            {sub && <p className="mt-0.5 text-[13px] text-white/65">{sub}</p>}
          </div>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Field({
  id,
  label,
  required,
  icon,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  icon: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-white">
        {label} {required && <span className="text-[#ff7a7a]">*</span>}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden>
          {icon}
        </span>
        {children}
      </div>
      {error && (
        <p className="mt-1.5 text-[13px] font-medium text-[#ff9a9a]" id={`${id}-err`}>
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "h-[42px] w-full rounded-lg border border-line-strong bg-white pl-10 pr-3 text-[14px] text-ink placeholder:text-ink-soft/70 transition-colors focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15 aria-[invalid=true]:border-[#e5383b]";

function Choice({ value, children }: { value: string; children: ReactNode }) {
  return (
    <label className="group cursor-pointer">
      <input type="checkbox" name="option[]" value={value} className="peer sr-only" />
      <span className="flex h-full min-h-[60px] items-center gap-3 rounded-xl border border-line bg-white px-3 py-2.5 text-left leading-tight text-ink-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 peer-checked:border-brand peer-checked:bg-brand-soft peer-checked:ring-2 peer-checked:ring-brand/40 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand">
        {children}
      </span>
    </label>
  );
}

export default function ContactRequestForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [client, setClient] = useState<"" | "oui" | "non">("");
  const [count, setCount] = useState(0);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data: Record<string, unknown> = {};
    fd.forEach((v, k) => {
      if (k === "option[]") (data.option = (data.option as string[]) ?? []).push(String(v));
      else if (k !== "client") data[k] = String(v).trim();
    });

    const local: Errors = {};
    for (const [k, label] of [
      ["name", "Nom/Prénom"],
      ["email", "Adresse Mail"],
      ["phone", "Numéro de téléphone"],
      ["rs", "Raison Sociale"],
    ] as const) {
      if (!data[k]) local[k] = [`Le champ « ${label} » est obligatoire.`];
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) local.email = ["Adresse mail invalide."];

    setErrors(local);
    if (Object.keys(local).length) {
      setStatus("error");
      setMessage("Merci de vérifier les champs signalés.");
      form.querySelector<HTMLElement>(`[name="${Object.keys(local)[0]}"]`)?.focus();
      return;
    }

    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch(links.sendForm, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setStatus("sent");
        form.reset();
        return;
      }
      setErrors(json.errors ?? {});
      setStatus("error");
      setMessage(json.error ?? "Le message n'a pas pu être envoyé. Merci de réessayer.");
    } catch {
      setStatus("error");
      setMessage("Le message n'a pas pu être envoyé. Vérifiez votre connexion et réessayez.");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 py-6" role="status">
        <span className="icon-tile !h-14 !w-14">
          <CheckCircle2 size={28} aria-hidden />
        </span>
        <h3 className="text-[26px] !text-white">Merci !</h3>
        <p className="text-white/70">Votre demande a été effectuée et sera traitée dans les 48h.</p>
        <a href={links.home} className="link-arrow !text-[#7cc4f5]">
          Retour à l’accueil
        </a>
      </div>
    );
  }

  const inv = (k: string) => ({
    "aria-invalid": errors[k]?.length ? true : undefined,
    "aria-describedby": errors[k]?.length ? `cf-${k}-err` : undefined,
  });
  const e1 = (k: string) => errors[k]?.[0];

  return (
    <form onSubmit={onSubmit} noValidate className="grid min-w-0 gap-4">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
        <div>
          <h2 id="votre-demande" className="scroll-mt-28 text-[clamp(24px,2vw,30px)] !text-white">Votre demande</h2>
          <p className="mt-1 text-[14px] text-white/65">Remplissez le formulaire ci-dessous, notre équipe vous répond rapidement.</p>
        </div>
      </div>

      {/* Coordonnées */}
      <Panel
        icon={<User size={18} aria-hidden />}
        title="Vos coordonnées"
        aside={
          <p className="text-[13px] text-white/60">
            <span className="text-[#ff7a7a]">*</span> Champs obligatoires
          </p>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="cf-name" label="Nom/Prénom" required icon={<User size={16} />} error={e1("name")}>
            <input id="cf-name" name="name" autoComplete="name" placeholder="Ex. Jean Dupont" className={inputCls} {...inv("name")} />
          </Field>
          <Field id="cf-email" label="Adresse Mail" required icon={<Mail size={16} />} error={e1("email")}>
            <input id="cf-email" name="email" type="email" autoComplete="email" placeholder="Ex. jean@entreprise.com" className={inputCls} {...inv("email")} />
          </Field>
          <Field id="cf-phone" label="Numéro de téléphone" required icon={<Phone size={16} />} error={e1("phone")}>
            <input id="cf-phone" name="phone" type="tel" autoComplete="tel" placeholder="Ex. 71 234 567" className={inputCls} {...inv("phone")} />
          </Field>
          <Field id="cf-rs" label="Raison Sociale" required icon={<Building2 size={16} />} error={e1("rs")}>
            <input id="cf-rs" name="rs" autoComplete="organization" placeholder="Ex. Ma Société" className={inputCls} {...inv("rs")} />
          </Field>
          <Field id="cf-activity" label="Secteur d’activité" icon={<Briefcase size={16} />}>
            <input id="cf-activity" name="activity" placeholder="Ex. Industrie, Services, Conseil…" className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field id="cf-city" label="Ville" icon={<MapPin size={16} />}>
              <input id="cf-city" name="city" autoComplete="address-level2" placeholder="Ex. Tunis" className={inputCls} />
            </Field>
            <Field id="cf-country" label="Pays" icon={<Globe size={16} />}>
              <input id="cf-country" name="country" autoComplete="country-name" placeholder="Ex. Tunisie" className={inputCls} />
            </Field>
          </div>
        </div>
      </Panel>

      {/* Demande */}
      <Panel icon={<Layers size={18} aria-hidden />} title="Quelle est votre demande ?" sub="Sélectionnez la ou les solutions concernées par votre demande.">
        <fieldset>
          <legend className="mb-2 text-[13.5px] font-semibold text-white">Êtes-vous déjà client Mediasoft ?</legend>
          <div className="inline-grid grid-cols-2 gap-1 rounded-full border border-line bg-white p-1" role="radiogroup">
            {(["oui", "non"] as const).map((v) => (
              <label key={v} className="cursor-pointer">
                <input type="radio" name="client" value={v} checked={client === v} onChange={() => setClient(v)} className="peer sr-only" />
                <span className="block rounded-full px-6 py-1.5 text-[13.5px] font-semibold text-ink-soft transition-colors peer-checked:bg-brand peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-brand">
                  {v === "oui" ? "Oui" : "Non"}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {client === "oui" && (
          <div className="mt-5">
            <p className="mb-2 text-[13px] font-medium text-white/70">Quel(s) produit(s) utilisez-vous ?</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {products.map((p) => (
                <Choice key={p.value} value={p.value}>
                  <span className="grid h-10 w-[68px] shrink-0 place-items-center">{p.logo}</span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-semibold text-ink">{p.name}</span>
                    <span className="block text-[11.5px] text-ink-soft">{p.sub}</span>
                  </span>
                </Choice>
              ))}
            </div>
          </div>
        )}

        <p className="mb-2 mt-5 text-[13px] font-medium text-white/70">{client === "oui" ? "Et votre besoin :" : "Votre besoin :"}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {needs.map((n) => (
            <Choice key={n.value} value={n.value}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">{n.icon}</span>
              <span className="min-w-0">
                <span className="block text-[13.5px] font-semibold text-ink">{n.name}</span>
                <span className="block text-[11.5px] text-ink-soft">{n.sub}</span>
              </span>
            </Choice>
          ))}
        </div>
      </Panel>

      {/* Message : carte bleu nuit (comme l'en-tête de la page), zone de saisie claire, envoi intégré en bas */}
      <section className="relative overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.05] p-4 text-white md:p-5">
        <div className="relative">
          <h3 className="text-[17px] !text-white md:text-[18px]">Votre message</h3>
          <p className="mt-0.5 text-[13px] text-white/65">Décrivez brièvement votre besoin ou votre projet.</p>
          <textarea
            id="cf-message"
            name="message"
            rows={5}
            maxLength={MAX_MESSAGE}
            placeholder="Décrivez votre besoin…"
            aria-label="Votre message"
            onChange={(ev) => setCount(ev.currentTarget.value.length)}
            className="mt-4 block w-full resize-y rounded-xl border border-white/10 bg-white px-4 py-3 text-[14px] leading-relaxed text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-4 focus:ring-brand-sky/40"
          />
          <div className="mt-5 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid gap-1 text-[12px] text-white/60">
              <span className="tabular-nums">
                {count} / {MAX_MESSAGE}
              </span>
              <span className="inline-flex items-center gap-2">
                <Lock size={14} aria-hidden /> Vos données sont confidentielles et ne seront jamais partagées.
              </span>
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl bg-white px-5 text-[14.5px] font-semibold text-[#00193a] transition-transform duration-200 hover:scale-[1.02] disabled:opacity-70"
            >
              {status === "sending" ? <Loader2 size={19} className="animate-spin" aria-hidden /> : <Send size={19} aria-hidden />}
              {status === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}
            </button>
          </div>
        </div>
      </section>
      <p aria-live="polite" className={`text-[14px] font-medium ${status === "error" ? "text-[#ff9a9a]" : "text-white"}`}>
        {message}
      </p>
    </form>
  );
}
