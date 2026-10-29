import type { Metadata } from "next";
import { Headset, LogIn } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SmartLink } from "@/components/ui";
import { links } from "@/lib/site";

/* Connexion à l'ancien Helpdesk — URL d'origine /login.html.
   Le formulaire est conservé tel quel (POST vers login.php, champs « mail » et « pwd »). */
export const metadata: Metadata = {
  title: "Login - Helpdesk",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <>
      <Header current="" />
      <main id="main" className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(90%_80%_at_50%_0%,var(--mist-2),var(--paper)_65%)]" aria-hidden />
        <div className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]" aria-hidden />
        <div className="container-x grid min-h-[70vh] place-items-center py-20">
          <div className="card w-full max-w-md p-8 shadow-[0_40px_80px_-40px_rgb(11_26_46/0.45)] md:p-10">
            <span className="eyebrow">Espace client</span>
            <h1 className="mt-4 text-[38px]">Helpdesk</h1>
            <p className="mt-2 text-ink-soft">Veuillez vous identifier.</p>
            <form name="MAIN_FORM" method="post" action="login.php" className="mt-8 grid gap-5">
              <div className="field">
                <label htmlFor="hd-mail">Identifiant</label>
                <input id="hd-mail" name="mail" type="text" placeholder="Email" autoComplete="username" />
              </div>
              <div className="field">
                <label htmlFor="hd-pwd">Mot de passe</label>
                <input id="hd-pwd" name="pwd" type="password" placeholder="Mot de passe" autoComplete="current-password" />
              </div>
              <button className="btn btn-primary w-full" type="submit" name="submit">
                <LogIn size={18} aria-hidden /> Se connecter
              </button>
            </form>
            <div className="mt-5 flex justify-between text-[14px] font-medium">
              <a href="inscription.php" className="text-brand hover:text-brand-deep">Inscrivez-vous</a>
              <a href="verif_login.php" className="text-brand hover:text-brand-deep">Mot de passe oublié ?</a>
            </div>
            <p className="mt-8 flex items-center gap-3 rounded-2xl bg-mist p-4 text-[14px] text-ink-soft">
              <Headset size={18} className="shrink-0 text-brand" aria-hidden />
              <span>
                Support Mediasoft en ligne :{" "}
                <SmartLink href={links.helpdesk} className="font-semibold text-ink hover:text-brand">Assistance Help desk</SmartLink>
              </span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
