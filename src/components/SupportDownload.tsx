"use client";

import { useEffect, useState } from "react";
import { Download, Headset, Phone, ShieldCheck } from "lucide-react";
import { links, site } from "@/lib/site";

const EXE = links.supportDownload;

export default function SupportDownload() {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    // Téléchargement automatique à l'ouverture de la page
    const t = window.setTimeout(() => {
      window.location.href = EXE;
      setStarted(true);
    }, 700);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#00193a] py-[clamp(64px,9vw,120px)] text-white">
      <div className="pointer-events-none absolute -right-[10%] -top-[30%] h-[80%] w-[60vw] rounded-full bg-brand-sky opacity-20 blur-[120px]" aria-hidden />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-[#7cc4f5]">
            <Headset size={28} aria-hidden />
          </span>
          <h1 className="mt-6 font-display text-[clamp(32px,4vw,54px)] font-bold leading-[1.04] tracking-[-0.04em] !text-white">
            Assistance à distance <span className="text-[#7cc4f5]">Mediasoft</span>
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/70">
            {started ? "Le téléchargement de Mediasoft Support a démarré." : "Le téléchargement de Mediasoft Support va démarrer…"} Lancez le fichier, puis
            communiquez à notre technicien l’identifiant et le mot de passe affichés.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={EXE} download className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-white px-7 text-[15.5px] font-semibold text-[#00193a] transition-transform hover:scale-[1.03]">
              <Download size={18} aria-hidden /> Télécharger Mediasoft Support
            </a>
            <a href={site.techPhones[0].href} className="btn btn-outline-light !min-h-[52px]">
              <Phone size={17} aria-hidden /> {site.techPhones[0].label}
            </a>
          </div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-6 md:p-8">
          <p className="font-semibold text-white">Le téléchargement ne démarre pas ?</p>
          <ol className="mt-4 grid gap-3 text-[15px] text-white/75">
            <li><b className="text-white">1.</b> Cliquez sur « Télécharger Mediasoft Support ».</li>
            <li><b className="text-white">2.</b> Ouvrez la liste des téléchargements : <b className="text-white">Ctrl + J</b>.</li>
            <li><b className="text-white">3.</b> Si le fichier est en attente ou bloqué, cliquez sur <b className="text-white">… → Conserver</b>.</li>
            <li><b className="text-white">4.</b> Sinon, appelez-nous : un technicien vous guide.</li>
          </ol>
          <p className="mt-6 inline-flex items-center gap-2 text-[13px] text-white/55">
            <ShieldCheck size={16} aria-hidden /> Fichier officiel TeamViewer, fourni par Mediasoft.
          </p>
        </div>
      </div>
    </section>
  );
}
