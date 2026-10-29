"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { links, requestOptions } from "@/lib/site";

/* Formulaire de contact : envoie en JSON au script existant /site/send.php
   (mêmes champs que le formulaire d'origine : name, email, phone, rs, activity, city, country, option[], message)
   Sans reCAPTCHA : la vérification est désactivée dans send.php (RECAPTCHA_ACTIF = false). */

type Errors = Record<string, string[]>;

export default function ContactForm({ variant = "full" }: { variant?: "full" | "compact" }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data: Record<string, unknown> = {};
    fd.forEach((v, k) => {
      if (k === "option[]") (data.option = (data.option as string[]) ?? []).push(String(v));
      else data[k] = String(v).trim();
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
      const key = Object.keys(local)[0];
      form.querySelector<HTMLElement>(`[name="${key}"]`)?.focus();
      return;
    }

    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch(links.sendForm, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
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
        <h3 className="text-[26px]">Merci !</h3>
        <p className="text-ink-soft">Votre demande a été effectuée et sera traitée dans les 48h.</p>
        <a href={links.home} className="link-arrow">
          Retour à l’accueil
        </a>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k]?.length ? (
      <p className="error" id={`${k}-err`}>
        {errors[k][0]}
      </p>
    ) : null;
  const inv = (k: string) => ({
    "aria-invalid": errors[k]?.length ? true : undefined,
    "aria-describedby": errors[k]?.length ? `${k}-err` : undefined,
  });
  const full = variant === "full";

  return (
    <form onSubmit={onSubmit} noValidate className="grid min-w-0 gap-5">
      <p className="text-[13px] text-ink-soft">* Champs obligatoires</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={`${variant}-name`}>Nom/Prénom *</label>
          <input id={`${variant}-name`} name="name" autoComplete="name" required {...inv("name")} />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor={`${variant}-email`}>Adresse Mail *</label>
          <input id={`${variant}-email`} name="email" type="email" autoComplete="email" required {...inv("email")} />
          {err("email")}
        </div>
        <div className="field">
          <label htmlFor={`${variant}-phone`}>Numéro de téléphone *</label>
          <input id={`${variant}-phone`} name="phone" type="tel" autoComplete="tel" required {...inv("phone")} />
          {err("phone")}
        </div>
        <div className="field">
          <label htmlFor={`${variant}-rs`}>Raison Sociale *</label>
          <input id={`${variant}-rs`} name="rs" autoComplete="organization" required {...inv("rs")} />
          {err("rs")}
        </div>
        <div className="field">
          <label htmlFor={`${variant}-activity`}>Secteur d’activité</label>
          <input id={`${variant}-activity`} name="activity" />
        </div>
        {full ? (
          <div className="grid grid-cols-2 gap-5">
            <div className="field">
              <label htmlFor="full-city">Ville</label>
              <input id="full-city" name="city" autoComplete="address-level2" />
            </div>
            <div className="field">
              <label htmlFor="full-country">Pays</label>
              <input id="full-country" name="country" autoComplete="country-name" />
            </div>
          </div>
        ) : (
          <div className="field">
            <label htmlFor="compact-demande">Quelle est votre demande ?</label>
            <select id="compact-demande" name="option[]" defaultValue="">
              <option value="" disabled>
                Veuillez sélectionner
              </option>
              {requestOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>


      {full && (
        <fieldset>
          <legend className="mb-3 text-[13.5px] font-semibold text-ink-2">Quelle est votre demande ?</legend>
          <div className="flex flex-wrap gap-2">
            {requestOptions.map((o) => (
              <label key={o} className="cursor-pointer">
                <input type="checkbox" name="option[]" value={o} className="peer sr-only" />
                <span className="inline-flex items-center rounded-full border border-line-strong bg-white px-4 py-2 text-[14px] font-medium text-ink-2 transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand hover:border-ink">
                  {o}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="field">
        <label htmlFor={`${variant}-message`}>Message</label>
        <textarea id={`${variant}-message`} name="message" rows={full ? 5 : 4} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Send size={17} aria-hidden />}
          {status === "sending" ? "Envoi en cours…" : full ? "Envoyer le formulaire" : "Envoyer"}
        </button>
      </div>
      <p aria-live="polite" className={`text-[14px] font-medium ${status === "error" ? "text-[#b42318]" : ""}`}>
        {message}
      </p>
    </form>
  );
}
