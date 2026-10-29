import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Bitrix24Univers from "@/components/bitrix24/Bitrix24Univers";
import { univers, universBySlug } from "@/lib/bitrix24Univers";

/* Pages des univers Bitrix24, aux adresses d'origine /bitrix24.tn/crm/, /bitrix24.tn/centre-de-contact/…
   (scripts/postbuild.mjs copie crm.html en crm/index.html). */
export const dynamicParams = false;

export function generateStaticParams() {
  return univers.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const u = universBySlug((await params).slug);
  if (!u) return {};
  const url = `/bitrix24.tn/${u.slug}/`;
  return {
    title: `Bitrix24 ${u.name} en Tunisie`,
    description: `${u.title} ${u.accent} ${u.lead}`,
    alternates: { canonical: url },
    openGraph: { url, images: [{ url: "/img/produits/b24-crm.webp" }] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const u = universBySlug((await params).slug);
  if (!u) notFound();
  return (
    <>
      <Header current="bitrix24" />
      <main id="main">
        <Bitrix24Univers u={u} />
      </main>
      <Footer current="bitrix24" />
    </>
  );
}
