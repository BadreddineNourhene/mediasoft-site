import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Arrow } from "@/components/ui";
import { links, products } from "@/lib/site";

export default function NotFound() {
  return (
    <>
      <Header current="" />
      <main id="main" className="relative isolate overflow-hidden">
        <div className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]" aria-hidden />
        <div className="container-x py-24 md:py-32">
          <p className="font-display text-[clamp(90px,16vw,200px)] font-semibold leading-none tracking-tight text-brand-soft [-webkit-text-stroke:2px_var(--brand)]">404</p>
          <h1 className="h-section mt-6">Cette page n’existe pas ou a été déplacée.</h1>
          <p className="lead mt-4 max-w-xl">Retrouvez nos solutions ci-dessous ou revenez à l’accueil.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={links.home} className="btn btn-primary">
              Retour à l’accueil <Arrow />
            </a>
            <a href={links.contact} className="btn btn-ghost">Contactez-nous</a>
          </div>
          <ul className="mt-14 flex flex-wrap gap-2">
            {products.map((p) => (
              <li key={p.key}>
                <a href={p.href} className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white px-4 py-2 text-[14.5px] font-medium hover:border-brand hover:text-brand">
                  {p.short}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
