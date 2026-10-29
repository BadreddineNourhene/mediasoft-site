import type { AnchorHTMLAttributes, ReactNode, SVGProps } from "react";
import { ArrowRight } from "lucide-react";
import { isExternal } from "@/lib/site";

/* Lien : nouvel onglet pour les sites externes, lien simple pour les pages du site
   (URL d'origine en .html, servies comme fichiers statiques). */
export function SmartLink({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) {
  const ext = isExternal(href);
  return (
    <a href={href} {...(ext ? { target: "_blank", rel: "noopener" } : {})} {...rest}>
      {children}
    </a>
  );
}

export function Arrow({ size = 18 }: { size?: number }) {
  return <ArrowRight className="arrow" size={size} strokeWidth={2} aria-hidden />;
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  light = false,
  className = "",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center items-center" : ""} flex max-w-3xl flex-col ${className}`}>
      {eyebrow && <span className={`eyebrow ${light ? "eyebrow-light" : ""}`}>{eyebrow}</span>}
      <h2 className={`h-section mt-5 ${light ? "!text-white" : ""}`}>{title}</h2>
      {lead && <p className={`lead mt-5 ${light ? "!text-white/70" : ""}`}>{lead}</p>}
      {children}
    </div>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden {...props}>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3z" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden {...props}>
      <path d="M6.9 8.6H3.6V20h3.3V8.6zM5.3 3.5a1.9 1.9 0 100 3.8 1.9 1.9 0 000-3.8zM20.4 13.7c0-3.1-1.7-5.3-4.7-5.3-1.5 0-2.6.8-3 1.6V8.6H9.5V20h3.3v-5.9c0-1.6.6-2.8 2.1-2.8s2.1 1.2 2.1 2.9V20h3.4v-6.3z" />
    </svg>
  );
}

export function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2.2A9.7 9.7 0 003.7 17l-1.4 4.8 5-1.3A9.7 9.7 0 1012 2.2zm0 17.7c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 00-.6.3c-.2.2-.8.8-.8 2s.9 2.3 1 2.5c.1.2 1.7 2.6 4.2 3.7 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.4-.3z" />
    </svg>
  );
}
