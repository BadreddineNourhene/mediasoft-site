import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CategoryView } from "@/components/divalto/views";
import { catHref, categories, type CategorySlug } from "@/lib/divalto";

/* Catégories de la section Divalto (archives WordPress vides à l'origine) : /divalto.tn/category/<slug>/ */

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = categories[slug as CategorySlug];
  const title = `${c.title} : solutions Divalto`;
  return { title, description: c.lead, alternates: { canonical: catHref(slug as CategorySlug) }, openGraph: { url: catHref(slug as CategorySlug), title, description: c.lead } };
}


export default async function DivaltoCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = (await params) as { slug: CategorySlug };
  return (
    <>
      <Header current="divalto" />
      <main id="main">
        <CategoryView slug={slug} />
      </main>
      <Footer current="divalto" />
    </>
  );
}
