"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/* « Voir plus / Voir moins » : l'essentiel visible, le texte d'origine complet derrière le bouton. */
export default function ReadMore({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={className}>
      <div
        id={id}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out)] ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        inert={!open}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
      <button
        type="button"
        className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-brand hover:text-brand-deep"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        {open ? "Voir moins" : "Voir plus"}
        <ChevronDown size={17} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
    </div>
  );
}
