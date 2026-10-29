"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AppWindow from "@/components/visual/AppWindow";
import { dcaps } from "@/lib/divaltoHome";
import {
  AlertTriangle, Warehouse, ClipboardList, Users, BadgePercent, UserRound, FileSignature, Truck, History, Zap,
  CalendarCheck, Building2, Network, CreditCard, Wallet, Repeat, ListChecks, Store, FileCheck2, Ship,
  Package, ShoppingCart, Boxes, FileText, type LucideIcon,
} from "lucide-react";

/* Gestion commerciale : contenu détaillé de la page d'origine https://mediasoft.tn/divalto.tn/gestion-commerciale/
   (bloc à onglets stocks / clients / fournisseurs, « 10 points clés », définition), texte repris et légèrement nettoyé.
   Retiré : la mention Chorus Pro (réglementation française). */

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Detail = { h: string; p?: string; items?: string[] };

const tabIcons: LucideIcon[][] = [
  [AlertTriangle, Warehouse, ClipboardList],
  [Users, BadgePercent, UserRound, FileSignature],
  [Truck, History, Zap],
];
const pointIcons: LucideIcon[] = [CalendarCheck, Building2, Network, CreditCard, Wallet, Repeat, ListChecks, Store, FileCheck2, Ship];
const defIcons: LucideIcon[] = [Package, ShoppingCart, Boxes, Users, FileText];

/* Carte blanche : bandeau de couleur en haut, icône pleine bleue ou orange */
function Card({ icon: Icon, orange, children, className = "" }: { icon: LucideIcon; orange: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative flex flex-col overflow-hidden rounded-[22px] bg-white p-7 shadow-[0_18px_40px_-28px_rgba(11,26,46,0.45)] ring-1 ring-line transition-transform duration-300 hover:-translate-y-1 ${className}`}>
      <span className={`absolute inset-x-0 top-0 h-1.5 ${orange ? "bg-[#ff5500]" : "bg-brand"}`} aria-hidden />
      <span className={`grid h-12 w-12 place-items-center rounded-2xl text-white ${orange ? "bg-[#ff5500]" : "bg-brand"}`}>
        <Icon size={22} aria-hidden />
      </span>
      {children}
    </div>
  );
}

const stackMeta = [
  { lead: "Le bon stock, au bon endroit, au bon moment.", cap: "stock" as const, crop: undefined as string | undefined },
  { lead: "Chaque client, ses conditions, ses contacts.", cap: "finance" as const, crop: undefined as string | undefined },
  { lead: "Des achats maîtrisés, de la commande au règlement.", cap: "tableau" as const, crop: "38% 78%" },
];

const tabs: { name: string; blocks: Detail[] }[] = [
  {
    name: "Gestion des stocks",
    blocks: [
      { h: "Évitez les ruptures", p: "Alertes de stock et seuils minimaux qui déclenchent les demandes d’achat. Projection du stock à l’instant T." },
      { h: "Définissez votre stock", p: "Biens, matières premières ou consommables :", items: ["Dépôts (entrepôt, magasin…)", "Emplacements par dépôt", "Nature des stocks"] },
      { h: "Inventaire et valorisation", items: ["Historique des mouvements", "Coûts de revient et CMP", "Préparation de l’inventaire"] },
    ],
  },
  {
    name: "Gestion des clients",
    blocks: [
      { h: "Groupes et groupements", p: "Encours, facturation et relances par entité ou par groupement." },
      { h: "Conditions tarifaires", p: "Tarifs, remises et promotions par famille d’articles, client, contact ou catégorie." },
      { h: "Contacts et rôles", p: "Jusqu’à 5 rôles par contact (devis, commande, BI, facture, relance), rattachés à chaque pièce." },
      { h: "Pièces dématérialisées", p: "PDF horodatés et signés électroniquement." },
    ],
  },
  {
    name: "Gestion des fournisseurs",
    blocks: [
      { h: "Achats complets", items: ["Articles et tarifs d’achat", "Frais de transport et d’approche", "Délais de livraison et règlements"] },
      { h: "Connaissance fournisseurs", items: ["Marchés passés", "Historique des mouvements", "Moyens de livraison"] },
      { h: "Moins de saisie", p: "Les factures reçues sont lues et transformées en écritures comptables." },
    ],
  },
];

const points: [string, string][] = [
  ["Gérez les réservations", "Assurez vos ventes en réservant sur du stock disponible, des commandes fournisseurs en cours ou des fabrications à venir."],
  ["Gérez l’inter-agences", "Partagez l’information de disponibilité des produits, définissez des règles de flux entre vos agences et automatisez vos facturations inter-agences."],
  ["Gérez l’inter-sociétés", "Définissez des règles communes pour les clients, fournisseurs, articles et tarifs. La réciprocité des pièces est automatique : une commande client en contremarque déclenche une commande fournisseur, qui déclenche elle-même une commande client dans la société concernée."],
  ["Profitez du paiement en ligne (CB et virement)", "Pour une vente comptoir ou un acompte, envoyez à votre client un lien par SMS ou e-mail pour qu’il règle instantanément depuis son smartphone."],
  ["Gérez vos acomptes", "Depuis la commande, déclenchez une ou plusieurs factures d’acompte et suivez leur règlement. Les acomptes figurent sur la facture définitive."],
  ["Gérez vos contremarques", "Contremarque directe ou indirecte, au niveau de l’article ou au moment de la vente. Une vente en quantité exceptionnelle déclenche une commande spécifique au fournisseur ; sa livraison déclenche la préparation de l’expédition, ou la facturation en contremarque directe."],
  ["Définissez des cartographies d’articles", "Une liste d’articles proposée automatiquement à la saisie de commande : par défaut pour un client, en vente complémentaire (accessoires) ou en remplacement en cas de substitution ou de rupture."],
  ["Vente comptoir : encaissement au point de vente", "Vos vendeurs encaissent vos clients BtoB au comptoir, grâce au pilotage de l’encaissement sur le point de vente de l’ERP."],
  ["Dématérialisez vos factures fournisseurs et clients", "Fournisseurs : lecture et interprétation des factures, workflows adaptés à vos processus. Clients : factures signées électroniquement par un tiers de confiance et archivées dans un coffre-fort sécurisé."],
  ["Gérez vos importations", "Affrétez et suivez vos conteneurs, gérez vos frais d’approche et vos documents de douane pour calculer droits et taxes et déterminer vos coûts réels."],
];

const definition: [string, string][] = [
  ["Les produits", "référencement, tarifs, décompositions…"],
  ["Les achats", "demandes de prix, commandes, réceptions…"],
  ["Les flux logistiques", "entrées, sorties, traçabilité, contremarque…"],
  ["Les tiers", "clients, fournisseurs…"],
  ["Les pièces commerciales", "devis, factures…"],
];


/* « En détail » : cartes numérotées qui s'empilent au défilement (inspiration hugeinc.com) */
function GcStack() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        // Une carte plus haute que l'écran défile jusqu'à montrer son bas, puis se fige : tout reste lisible
        const place = () => cards.forEach((c, i) => (c.style.top = `${Math.min(96 + i * 26, window.innerHeight - c.offsetHeight - 24)}px`));
        place();
        window.addEventListener("resize", place);
        cards.forEach((c, i) => {
          if (i === cards.length - 1) return;
          gsap.to(c.querySelector("[data-inner]"), {
            scale: 0.95,
            ease: "none",
            scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top+=140", scrub: true },
          });
        });
        return () => window.removeEventListener("resize", place);
      });
    },
    { scope: root }
  );
  return (
    <section id="detail" ref={root} className="relative scroll-mt-20 bg-[#081426] py-[clamp(80px,10vw,130px)] text-white" aria-labelledby="gc-det-title">
      <div className="container-x">
        <p className="eyebrow eyebrow-light">En détail</p>
        <h2 id="gc-det-title" className="mt-4 max-w-3xl font-display text-[clamp(30px,3.6vw,52px)] font-bold leading-[1.04] tracking-[-0.04em] !text-white">
          Stocks, clients, fournisseurs : <span className="text-brand-sky">tout ce que gère Divalto.</span>
        </h2>
        <div className="mt-14 space-y-8 lg:space-y-[18vh]">
          {tabs.map((tab, i) => {
            const m = stackMeta[i];
            const c = dcaps[m.cap];
            return (
              <article key={tab.name} data-card className="lg:sticky" style={{ top: `${84 + i * 26}px` }} aria-label={tab.name}>
                <div data-inner className="origin-top rounded-[30px] bg-[#f8f7f4] p-7 text-ink shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.6)] md:p-10">
                  <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-end">
                    <div>
                      <span className="font-display text-[clamp(38px,3.6vw,54px)] font-bold leading-none tracking-[-0.05em] text-[#ff5500]">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="mt-3 font-display text-[clamp(36px,4.4vw,66px)] font-bold leading-[0.95] tracking-[-0.055em] text-ink">{tab.name}.</h3>
                      <p className="mt-3 max-w-xl font-display text-[clamp(17px,1.4vw,21px)] font-semibold leading-snug text-ink-2">{m.lead}</p>
                    </div>
                    <figure className="overflow-hidden rounded-[18px] bg-[#0b1a2e] p-2 shadow-xl">
                      {m.crop ? (
                        <div className="aspect-[16/10] overflow-hidden rounded-[12px] bg-white">
                          <img src={c.src} alt={c.alt} className="h-full w-full scale-[1.8] object-cover" style={{ objectPosition: m.crop, transformOrigin: m.crop }} loading="lazy" />
                        </div>
                      ) : (
                        <img src={c.src} alt={c.alt} className="block aspect-[16/10] w-full rounded-[12px] bg-white object-cover object-left-top" loading="lazy" />
                      )}
                      <figcaption className="px-2 pb-1 pt-2 text-[11px] text-white/50">Capture réelle de Divalto infinity</figcaption>
                    </figure>
                  </div>
                  <div className={`mt-7 grid gap-x-8 gap-y-6 border-t border-black/10 pt-6 sm:grid-cols-2 ${tab.blocks.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
                    {tab.blocks.map((b, k) => {
                      const Icon = tabIcons[i][k];
                      return (
                        <div key={b.h}>
                          <span className={`grid h-10 w-10 place-items-center rounded-xl text-white ${k % 2 ? "bg-[#ff5500]" : "bg-brand"}`}>
                            <Icon size={18} aria-hidden />
                          </span>
                          <h4 className="mt-3 font-display text-[16.5px] font-bold leading-snug tracking-[-0.02em] text-ink">{b.h}</h4>
                          {b.p && <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{b.p}</p>}
                          {b.items && (
                            <ul className="mt-3 space-y-1.5">
                              {b.items.map((it) => (
                                <li key={it} className="flex gap-2.5 text-[13.5px] text-ink-2">
                                  <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${k % 2 ? "bg-[#ff5500]" : "bg-brand"}`} aria-hidden />
                                  {it}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* « 10 points clés » : cartes inclinées qui défilent à l'horizontale et pivotent en traversant l'écran (inspiration hugeinc.com).
   Fond de carte : détail d'une vraie capture Divalto, teinté aux couleurs Mediasoft. */
const pointImgs = [
  ["pt-01-reservations", "Outillage et fournitures en stock"],
  ["pt-02-inter-agences", "Poignée de main entre deux partenaires"],
  ["pt-03-inter-societes", "Analyse de chiffres et de graphiques"],
  ["pt-04-paiement", "Application Divalto sur tablette"],
  ["pt-05-acomptes", "Écran Divalto de gestion des financements"],
  ["pt-06-contremarques", "Plans et casque de chantier"],
  ["pt-07-cartographies", "Écran Divalto : liste d’articles"],
  ["pt-08-comptoir", "Écrans Divalto infinity : stocks"],
  ["pt-09-dematerialisation", "Facture Divalto dématérialisée"],
  ["pt-10-importations", "Technicien avec une tablette sur site industriel"],
];

function PointCard({ i, h, d, className = "", style }: { i: number; h: string; d: string; className?: string; style?: React.CSSProperties }) {
  const orange = i % 2 === 1;
  const [img, alt] = pointImgs[i];
  return (
    <article className={`flex flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_30px_60px_-25px_rgba(11,26,46,0.35)] ring-1 ring-line ${className}`} style={style}>
      <div className="relative h-[44%] shrink-0 overflow-hidden bg-mist lg:[@media(max-height:720px)]:h-[30%]">
        <img src={`/img/divalto/${img}.webp`} alt={alt} className="h-full w-full object-cover" loading="lazy" />
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 font-display text-[13px] font-bold text-white ${orange ? "bg-[#ff5500]" : "bg-brand"}`}>{String(i + 1).padStart(2, "0")} / 10</span>
      </div>
      <span className={`h-1.5 shrink-0 ${orange ? "bg-[#ff5500]" : "bg-brand"}`} aria-hidden />
      <div className="flex flex-1 flex-col p-6 lg:[@media(max-height:720px)]:p-5">
        <h3 className="font-display text-[clamp(20px,1.8vw,25px)] font-bold leading-[1.05] tracking-[-0.035em] text-ink lg:[@media(max-height:720px)]:text-[19px]">{h}.</h3>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft lg:[@media(max-height:720px)]:text-[12.5px]">{d}</p>
      </div>
    </article>
  );
}

const R = 1150; // rayon de la roue (px)
const STEP = 20; // écart entre deux cartes (degrés)

function GcPointsCarousel() {
  const root = useRef<HTMLElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.matchMedia().add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          wheel.current,
          { rotate: 0 },
          {
            rotate: -(points.length - 1) * STEP,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top+=60", end: () => `+=${(points.length - 1) * 380}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
          }
        );
      });
    },
    { scope: root }
  );
  return (
    <section ref={root} className="relative overflow-hidden bg-white py-16 lg:flex lg:h-[calc(100svh-60px)] lg:flex-col lg:py-0" aria-labelledby="gc-pts-title">
      <div className="container-x relative z-10 shrink-0 lg:pt-8">
        <p className="eyebrow">Avantages</p>
        <h2 id="gc-pts-title" className="mt-3 font-display text-[clamp(28px,3.2vw,46px)] font-bold leading-[1.04] tracking-[-0.04em]">
          Notre gestion commerciale <span className="text-brand">en 10 points clés.</span>
        </h2>
      </div>

      {/* Ordinateur : les cartes tournent sur une grande roue */}
      <div className="relative hidden min-h-0 flex-1 lg:block">
        <div ref={wheel} className="absolute left-1/2 h-0 w-0" style={{ top: `calc(50% - 22px + ${R}px)` }}>
          {points.map(([h, d], i) => (
            <PointCard
              key={h}
              i={i}
              h={h}
              d={d}
              className="absolute left-0 top-0 h-[min(calc(100svh-300px),500px)] w-[340px]"
              style={{ transform: `translate(-50%, -50%) rotate(${i * STEP}deg) translateY(-${R}px)`, transformOrigin: "50% 50%" }}
            />
          ))}
        </div>
      </div>

      {/* Mobile : défilement au doigt */}
      <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
        {points.map(([h, d], i) => (
          <PointCard key={h} i={i} h={h} d={d} className="relative aspect-[4/5] w-[78vw] max-w-[380px] shrink-0 snap-center" />
        ))}
      </div>
    </section>
  );
}

export default function GcDetails() {
  return (
    <>
      <GcStack />

      <GcPointsCarousel />

      <section className="bg-mist py-[clamp(70px,8vw,110px)]" aria-labelledby="gc-def-title">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">Définition</p>
            <h2 id="gc-def-title" className="mt-4 font-display text-[clamp(28px,3vw,42px)] font-bold leading-[1.08] tracking-[-0.035em]">
              Qu’est-ce qu’un logiciel de gestion commerciale ?
            </h2>
            <p className="mt-5 max-w-md text-[16.5px] leading-relaxed text-ink-soft">La gestion commerciale vous permet d’administrer dans un logiciel toutes les opérations liées aux ventes et aux achats de votre entreprise. Ces logiciels ont pour objet de gérer :</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {definition.map(([a, b], i) => (
              <li key={a} className={i === 4 ? "sm:col-span-2" : ""}>
                <Card icon={defIcons[i]} orange={i % 2 === 1} className="h-full !flex-row items-center gap-5 !p-5">
                  <span>
                    <span className="block font-display text-[18px] font-bold text-ink">{a}</span>
                    <span className="mt-1 block text-[14.5px] text-ink-soft">{b}</span>
                  </span>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
