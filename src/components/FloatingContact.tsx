"use client";

import { usePathname } from "next/navigation";
import { links } from "@/lib/site";
import { editorTheme } from "@/lib/editorTheme";
import { SmartLink, WhatsappIcon } from "@/components/ui";

/* Boutons fixes à droite de l'écran, sur toutes les pages, comme sur mediasoft.tn :
   WhatsApp et Assistance (vers le Help desk). Au survol, l'onglet s'ouvre et affiche son libellé.
   Sur les pages Sage, Divalto et Bitrix24, ils prennent les couleurs de l'éditeur (lib/editorTheme). */
function editorOf(path: string) {
  if (path.startsWith("/sage.tn")) return "sage";
  if (path.startsWith("/divalto.tn")) return "divalto";
  if (path.startsWith("/bitrix24.tn")) return "bitrix24";
  if (path.startsWith("/PowerBI-Tunisie")) return "powerbi";
  return "";
}

export default function FloatingContact() {
  const editor = editorOf(usePathname() ?? "");
  const theme = editorTheme(editor);
  const tab =
    "group flex h-12 items-center overflow-hidden rounded-l-xl text-white shadow-[0_10px_24px_-8px_rgba(0,0,0,0.45)] transition-[width] duration-300 ease-out";
  return (
    <div className="fixed right-0 top-1/2 z-[60] flex -translate-y-1/2 flex-col items-end gap-2 print:hidden">
      <SmartLink
        href={links.whatsapp}
        aria-label="Nous écrire sur WhatsApp"
        className={`${tab} w-12 hover:w-[150px]`}
        style={{ background: editor ? theme.accent : "#25b4e6", color: editor === "powerbi" ? "#0f0d05" : undefined }}
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center">
          <WhatsappIcon width={20} height={20} />
        </span>
        <span className="whitespace-nowrap pr-4 text-[13px] font-bold uppercase tracking-wide">WhatsApp</span>
      </SmartLink>
      <SmartLink
        href={links.helpdesk}
        aria-label="Assistance : Help desk Mediasoft"
        className={`${tab} w-12 ring-1 ring-white/15 hover:w-[160px]`}
        style={{ background: editor ? theme.ink : "#00193a" }}
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center text-[20px] font-extrabold">?</span>
        <span className="whitespace-nowrap pr-4 text-[13px] font-bold uppercase tracking-wide">Assistance</span>
      </SmartLink>
    </div>
  );
}
