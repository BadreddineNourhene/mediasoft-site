"use client";

import { useEffect, useState } from "react";
import { Check, Download } from "lucide-react";
import { Arrow, SmartLink } from "@/components/ui";
import AppWindow from "@/components/visual/AppWindow";
import Laptop from "@/components/visual/Laptop";
import Reveal from "@/components/sage100/Reveal";
import { links } from "@/lib/site";
import { SAGE_GREEN } from "@/lib/sage100";
import { sageModules, type SageModule } from "@/lib/sageModules";

/* Modèle des pages modules Sage 100 (Comptabilité, Gestion commerciale, Entreprise) : en-tête vert,
   avantages animés, fonctionnalités en onglets avec leur capture, brochure. Les contenus viennent des pages
   d'origine de mediasoft.tn/sage.tn (voir src/lib/sageModules.ts). Les notifications de l'en-tête sont illustratives. */

function Hero({ m }: { m: SageModule }) {
  const { notes, features } = m;
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setN((v) => (v + 1) % notes.length), 2800);
    return () => window.clearInterval(id);
  }, []);
  return (
    <section className="relative overflow-hidden bg-[#03100a] pb-[clamp(64px,8vw,110px)] pt-[clamp(48px,6vw,84px)] text-white" aria-labelledby="sm-title">
      <div className="pointer-events-none absolute -right-[10%] top-[-20%] h-[80vh] w-[70vw] rounded-full opacity-[0.2] blur-[120px]" style={{ background: SAGE_GREEN }} aria-hidden />
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
        <div className="hd-in">
          <p className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-white/80">
            <span className="grid h-7 place-items-center rounded-full bg-white px-2.5">
              <img src="/img/logos/Sage_Logo_Brilliant_Green_RGB.webp" alt="Sage" className="h-5 w-auto" />
            </span>
            {m.pill}
          </p>
          <h1 id="sm-title" className="mt-7 font-display text-[clamp(38px,4.3vw,62px)] font-bold leading-[1.02] tracking-[-0.045em] !text-white">
            {m.title} <span className="block" style={{ color: SAGE_GREEN }}>{m.titleAccent}</span>
          </h1>
          <p className="mt-7 max-w-[520px] text-[clamp(16px,1.25vw,18.5px)] leading-relaxed text-white/70">
            {m.lead}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={links.contact} className="group inline-flex min-h-[52px] items-center gap-3 rounded-full py-2 pl-7 pr-2 text-[15px] font-semibold text-[#03100a] transition-transform duration-300 hover:scale-[1.03]" style={{ background: SAGE_GREEN }}>
              Demander une démo
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#03100a] text-white transition-transform duration-300 group-hover:translate-x-1">
                <Arrow size={16} />
              </span>
            </a>
            <SmartLink href={m.brochure} className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-white/20 px-7 text-[15px] font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5">
              <Download size={16} aria-hidden /> Télécharger la brochure
            </SmartLink>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[640px]">
          <div className="pointer-events-none absolute inset-x-[8%] bottom-[2%] h-[18%] rounded-[50%] opacity-40 blur-3xl" style={{ background: SAGE_GREEN }} aria-hidden />
          <div className="hd-in" style={{ animationDelay: "0.2s" }}>
            <Laptop src={features[0].img} alt={features[0].alt} eager />
          </div>
          <div className="hd-in absolute -bottom-[12%] -left-[5%] hidden w-[44%] sm:block" style={{ animationDelay: "0.45s" }}>
            <AppWindow src={features[m.secondary].img} alt={features[m.secondary].alt} eager />
          </div>
          {notes.map(({ icon: Icon, k, t, pos }, i) => (
            <div
              key={t}
              className={`absolute ${pos} hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1f15]/85 px-3.5 py-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-500 md:flex`}
              style={{ opacity: i === n ? 1 : 0, transform: i === n ? "none" : "translateY(10px)" }}
              aria-hidden={i !== n}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: SAGE_GREEN, color: "#03100a" }}>
                <Icon size={17} aria-hidden />
              </span>
              <span className="leading-tight">
                <span className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/50">{k}</span>
                <span className="block text-[13.5px] font-semibold text-white">{t}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits({ m }: { m: SageModule }) {
  const benefits = m.benefits;
  return (
    <section className="bg-[#f4fbf6] py-[clamp(80px,10vw,130px)]" aria-labelledby="sm-b-title">
      <div className="container-x">
        <p className="eyebrow !text-[#066b1f]">{m.benefitsEyebrow}</p>
        <h2 id="sm-b-title" className="mt-4 max-w-3xl font-display text-[clamp(30px,3.6vw,52px)] font-bold leading-[1.04] tracking-[-0.04em]">
          {m.benefitsTitle} <span className="text-[#066b1f]">{m.benefitsAccent}</span>
        </h2>
        <Reveal className={`s100-g relative mt-14 grid sm:grid-cols-2 ${benefits.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
          <span className="s100-g-line absolute inset-x-0 top-0 h-px origin-left bg-[#066b1f]/25" aria-hidden />
          {benefits.map((g, i) => (
            <div key={g.n} className={`s100-g-col group relative py-9 lg:px-7 lg:py-12 ${i === 0 ? "lg:pl-0" : ""}`} style={{ ["--d" as string]: `${i * 0.15}s` }}>
              {i > 0 && <span className="s100-g-vline absolute left-0 top-0 hidden h-full w-px origin-top bg-[#066b1f]/20 lg:block" aria-hidden />}
              <span className="block overflow-hidden">
                <span className="s100-g-num block font-display text-[clamp(40px,4vw,58px)] font-bold leading-none tracking-[-0.05em] text-[#079a2e]">{g.n}</span>
              </span>
              <span className="s100-g-bar mt-4 block h-[3px] w-10 origin-left rounded-full bg-[#079a2e] transition-[width] duration-500 group-hover:w-20" aria-hidden />
              <h3 className="s100-g-txt mt-5 font-display text-[20px] font-bold tracking-[-0.03em]">{g.t}</h3>
              <p className="s100-g-txt mt-3 max-w-xs text-[15px] leading-relaxed text-ink-soft">{g.d}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Features({ m }: { m: SageModule }) {
  const features = m.features;
  const [active, setActive] = useState(0);
  const f = features[active];
  return (
    <section className="bg-white py-[clamp(80px,10vw,130px)]" aria-labelledby="sm-f-title">
      <div className="container-x">
        <p className="eyebrow !text-[#066b1f]">{m.featuresEyebrow}</p>
        <h2 id="sm-f-title" className="mt-4 max-w-3xl font-display text-[clamp(30px,3.6vw,52px)] font-bold leading-[1.04] tracking-[-0.04em]">
          {m.featuresTitle} <span className="text-[#066b1f]">{m.featuresAccent}</span>
        </h2>
        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          <ol className="border-t border-line" role="tablist" aria-label={`Fonctionnalités de ${m.name}`}>
            {features.map((it, i) => {
              const on = i === active;
              return (
                <li key={it.t} className="border-b border-line">
                  <button type="button" role="tab" aria-selected={on} onClick={() => setActive(i)} className="group flex w-full items-start gap-5 py-5 text-left">
                    <span className="mt-1 font-display text-[13px] font-bold tabular-nums transition-colors" style={{ color: on ? "#066b1f" : "rgba(82,98,122,0.5)" }}>
                      0{i + 1}
                    </span>
                    <span className="flex-1">
                      <span className={`block font-display text-[clamp(18px,1.6vw,22px)] font-semibold leading-snug tracking-[-0.025em] transition-colors ${on ? "text-ink" : "text-ink/45 group-hover:text-ink/75"}`}>
                        {it.t}
                      </span>
                      <span className={`grid transition-[grid-template-rows,opacity] duration-500 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <span className="overflow-hidden">
                          <span className="block pt-2 text-[15px] leading-relaxed text-ink-soft">{it.d}</span>
                          {/* Même présentation que la page Sage 100 : ligne cochée avec un trait vert, pas de pastilles */}
                          <span className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-l-2 border-[#00d639] pl-3 text-[14px] font-semibold text-ink">
                            {it.items.map((x) => (
                              <span key={x} className="inline-flex items-center gap-1.5">
                                <Check size={15} strokeWidth={3} className="text-[#0a8a2a]" aria-hidden />
                                {x}
                              </span>
                            ))}
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="relative self-start overflow-hidden rounded-[32px] bg-[linear-gradient(150deg,#eafbef,#c8f3d4)] p-6 md:p-10 lg:sticky lg:top-28">
            <div className="pointer-events-none absolute -right-[15%] -top-[25%] h-[70%] w-[60%] rounded-full opacity-40 blur-[90px]" style={{ background: SAGE_GREEN }} aria-hidden />
            <div key={f.img} className="hd-in relative">
              <Laptop src={f.img} alt={f.alt} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Brochure({ m }: { m: SageModule }) {
  const BROCHURE = m.brochure;
  return (
    <section className="bg-white pb-[clamp(40px,6vw,80px)]" aria-label={`Brochure ${m.name}`}>
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] border border-[#066b1f]/15 bg-[#f4fbf6] p-8 md:flex-row md:items-center md:p-10">
          <div>
            <p className="font-display text-[clamp(22px,2.2vw,30px)] font-bold tracking-[-0.03em]">Téléchargez notre brochure</p>
            <p className="mt-2 text-[15.5px] text-ink-soft">Toutes les fonctionnalités de {m.name}, en PDF.</p>
          </div>
          <SmartLink href={BROCHURE} className="inline-flex min-h-[50px] shrink-0 items-center gap-2 rounded-full bg-[#03100a] px-7 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03]">
            <Download size={16} aria-hidden /> Télécharger
          </SmartLink>
        </div>
      </div>
    </section>
  );
}

export default function SageModulePage({ k }: { k: keyof typeof sageModules }) {
  const m = sageModules[k];
  return (
    <>
      <Hero m={m} />
      <Benefits m={m} />
      <Features m={m} />
      <Brochure m={m} />
    </>
  );
}
