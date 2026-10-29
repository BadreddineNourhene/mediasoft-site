import ContactForm from "@/components/ContactForm";

/* Fin de l'accueil : le formulaire présenté comme une fenêtre d'application « Nouveau projet ».
   Formulaire seul, sans colonne de coordonnées (choix de l'utilisateur, 2026-10-20). */
export default function ContactWindow() {
  return (
    <section id="contact" className="relative overflow-hidden bg-mist py-[clamp(80px,10vw,140px)]" aria-labelledby="contact-title">
      <div className="pointer-events-none absolute right-[-10%] top-[-30%] h-[80%] w-[50%] rounded-full bg-[radial-gradient(circle,rgba(70,157,214,0.25),transparent_65%)]" aria-hidden />
      <div className="container-x relative grid gap-12 [&>*]:min-w-0 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-center lg:gap-16">
        <div>
          <p className="eyebrow">Parlons-en</p>
          <h2 id="contact-title" className="mt-4 font-display text-[clamp(32px,3.6vw,54px)] font-bold leading-[1.05] tracking-[-0.035em]">
            Votre prochain logiciel commence par une conversation.
          </h2>
          <p className="mt-6 max-w-sm text-[17px] leading-relaxed text-ink-soft">
            Parlez-nous de votre activité, de vos outils actuels et de ce qui vous freine. Votre demande est traitée sous 48&nbsp;heures.
          </p>
        </div>

        <div className="app-window !rounded-[24px] shadow-[0_50px_100px_-50px_rgb(11_26_46/0.55)]">
          <div className="app-window-bar !h-11 !px-5">
            <i />
            <i />
            <i />
            <span className="ml-3 text-[13px] font-semibold text-ink-2">Nouveau projet — Mediasoft</span>
          </div>
          <div className="p-6 md:p-10">
            <ContactForm variant="compact" />
          </div>
        </div>
      </div>
    </section>
  );
}
