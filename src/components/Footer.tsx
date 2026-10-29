import { Mail, Phone, Star } from "lucide-react";
import { links, offices, site } from "@/lib/site";
import { FacebookIcon, LinkedinIcon, SmartLink, WhatsappIcon } from "@/components/ui";

const services = [
  { label: "Sage 50c Ciel", href: links.sage50 },
  { label: "Sage 100c", href: links.sage100 },
  { label: "Divalto", href: links.divalto },
  { label: "Bitrix24", href: links.bitrix24 },
  { label: "Microsoft 365", href: links.m365 },
  { label: "Microsoft Power BI", href: links.powerbi },
  { label: "Solutions sur mesure", href: "/#solutions" },
];

const company = [
  { label: "Contactez-nous", href: links.contact },
  { label: "Assistance Help desk", href: links.helpdesk },
  { label: "Télécharger Mediasoft Support", href: links.supportDownload },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night text-white/70">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" aria-hidden />
      <div className="container-x relative pb-10 pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <a href={links.home} className="inline-block" aria-label="Mediasoft — accueil">
              <img src="/img/logos/logo-mediasoft-blanc.png" alt="Mediasoft" width={589} height={71} className="h-6 w-auto" loading="lazy" />
            </a>
            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed">{site.tagline}</p>
            <div className="mt-6 flex gap-2">
              {[
                { href: links.facebook, label: "Facebook", Icon: FacebookIcon },
                { href: links.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
                { href: links.whatsapp, label: "WhatsApp", Icon: WhatsappIcon },
              ].map(({ href, label, Icon }) => (
                <SmartLink
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-sky hover:bg-brand-sky/15"
                >
                  <Icon />
                </SmartLink>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4">
            <FooterList title="Nos services" items={services} />
            <FooterList title="Mediasoft" items={company} />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            {offices.map((o) => (
              <div key={o.key}>
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] !text-white">{o.label}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed">
                  {site.legalName} {o.address}
                </p>
                <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
                  <a href={o.telHref} className="inline-flex items-center gap-2 text-white hover:text-brand-sky">
                    <Phone size={13} aria-hidden /> {o.tel}
                  </a>
                  <a href={`mailto:${o.email}`} className="inline-flex items-center gap-2 text-white hover:text-brand-sky">
                    <Mail size={13} aria-hidden /> {o.email}
                  </a>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center md:p-8">
          <img src="/img/photos/avisgoogle.png" alt="QR code vers la page d’avis Google de Mediasoft" width={96} height={96} className="h-24 w-24 rounded-xl bg-white p-1.5" loading="lazy" />
          <div>
            <h3 className="flex items-center gap-2 text-[16px] !text-white">
              <Star size={18} className="text-[#3d8bff]" fill="currentColor" aria-hidden /> Votre avis compte
            </h3>
            <p className="mt-2 max-w-xl text-[13.5px]">
              Si vous avez apprécié notre service, nous serions ravis que vous preniez un instant pour partager votre
              expérience sur notre page Google. Cliquez sur le bouton ou scannez le QR code.
            </p>
          </div>
          <SmartLink href={links.googleReview} className="btn btn-light">
            Laisser un avis
          </SmartLink>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-[13.5px] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Mediasoft Tunisie. Tous droits réservés.</p>
          <p className="flex flex-wrap gap-x-6 gap-y-2">
            <span>
              Service technique :{" "}
              {site.techPhones.map((p, i) => (
                <span key={p.href}>
                  {i > 0 && " · "}
                  <a href={p.href} className="text-white hover:text-brand-sky">{p.label}</a>
                </span>
              ))}
            </span>
            <a href={links.privacy} className="hover:text-white">Politique de confidentialité</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] !text-white">{title}</h3>
      <ul className="mt-3.5 grid gap-2 text-[13.5px]">
        {items.map((i) => (
          <li key={i.label}>
            <SmartLink href={i.href} className="transition-colors hover:text-white">
              {i.label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
