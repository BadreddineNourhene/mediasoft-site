import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ErpView, FamilyView, ModuleView, ResourceView, SectorView } from "@/components/divalto/views";
import { allPages, dHref, erp, findPage } from "@/lib/divalto";

/* Pages de la section Divalto, aux adresses d'origine du site WordPress : /divalto.tn/<slug>/
   (scripts/postbuild.mjs recopie chaque <slug>.html en <slug>/index.html). */

export const dynamicParams = false;

export function generateStaticParams() {
  // gestion-commerciale a sa propre page (app/divalto.tn/gestion-commerciale)
  return allPages.filter((p) => p.slug !== "gestion-commerciale").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = findPage(slug)!;
  const title = p.kind === "erp" ? erp.seoTitle : p.seoTitle;
  const description = p.kind === "erp" ? erp.description : p.description;
  return { title, description, alternates: { canonical: dHref(slug) }, openGraph: { url: dHref(slug), title, description } };
}


export default async function DivaltoInnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = findPage(slug)!;
  return (
    <>
      <Header current="divalto" />
      <main id="main">
        {p.kind === "erp" && <ErpView />}
        {p.kind === "module" && <ModuleView p={p} />}
        {p.kind === "secteur" && <SectorView p={p} />}
        {p.kind === "famille" && <FamilyView p={p} />}
        {p.kind === "ressource" && <ResourceView p={p} />}
      </main>
      <Footer />
    </>
  );
}
