import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportDownload from "@/components/SupportDownload";

/* Page « Assistance » : ouverte par le bouton « ? » flottant. Lance le téléchargement de TeamViewer Mediasoft
   et explique quoi faire si le navigateur le bloque (Edge met souvent les .exe en attente). */
export const metadata: Metadata = {
  title: "Assistance à distance : télécharger Mediasoft Support",
  description: "Téléchargez Mediasoft Support (TeamViewer) pour qu'un technicien Mediasoft prenne la main sur votre poste.",
  robots: { index: false },
};

export default function AssistancePage() {
  return (
    <>
      <Header current="" />
      <main id="main">
        <SupportDownload />
      </main>
      <Footer />
    </>
  );
}
