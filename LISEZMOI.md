# Site Mediasoft — version créative (Innovation & IA)

Copie de travail créée le 2026-10-22 à partir de `mediasoft-next`. Sauvegarde intacte : `../mediasoft-current-backup`. Pour voir le site : double-cliquer sur « Ouvrir le site.bat » (port 3300) après `npx next build`.

Refonte complète du site principal (www.mediasoft.tn / mediasoft.com.tn) en **Next.js 16 + React 19**, exportée en **fichiers statiques** pour le serveur IIS actuel. Aucun Node.js n'est nécessaire sur le serveur.

## Direction artistique (2026-10-22) : « Le poste de pilotage »

Visuels d'abord, textes courts et réécrits (contenu original, sans chiffres ni références inventés). Environnements sombres immersifs et respirations claires ; chaque section démontre au lieu d'énumérer. Pas d'images glissées dans les titres, pas de texte géant, pas de grilles de cartes ni de listes à cocher.

| Section de l'accueil | Concept | Fichier |
|---|---|---|
| Ouverture | « Vous gérez l’entreprise. Nous faisons tourner les logiciels. » + film des logiciels, notifications, bouton son | `home/HeroCinema.tsx` |
| Logos | Bandeau défilant des éditeurs | `home/PartnersBand.tsx` |
| Qui sommes-nous | « Nés entre l’informatique et la gestion. » : deux cercles qui se rejoignent sur Mediasoft | `home/AboutOrigin.tsx` |
| Ce que nous faisons | Audit & conseil, personnalisation, formation, support : liste interactive + photos | `home/Expertise.tsx` |
| Solutions | « Cinq logiciels. Un seul interlocuteur. » : rail immersif, vraies captures | `home/SolutionsRail.tsx`, `lib/showcase.ts` |
| Innovation & IA | « L’intelligence artificielle, appliquée à votre entreprise. » : 4 offres (agents IA, automatisation, analyse & décision, stratégie IA) avec enjeu / mise en place / résultat, console animée, démarche Diagnostic → Prototype → Déploiement | `home/AiSection.tsx` |
| FAQ | 6 questions de décideurs, balisage FAQPage | `home/Faq.tsx` |
| Ancrage | Carte de la Tunisie, secteurs défilants, partenaires | `home/TrustMap.tsx`, `lib/tunisia.ts` |
| Contact | « Votre prochain logiciel commence par une conversation. » : formulaire en fenêtre | `home/ContactWindow.tsx` |

Captures des logiciels : `public/img/produits/`. Vidéo : `public/video/`.

## Technologies

- **Next.js** (export statique, `output: "export"`), **Tailwind CSS 4**
- (Three.js retiré le 2026-10-22 avec la page La société)
- **GSAP + Lenis** : défilement fluide synchronisé avec ScrollTrigger (`src/components/SmoothScroll.tsx`)
- **React Bits** (`src/components/reactbits/`, installés avec `npx shadcn add @react-bits/<Nom>-TS-TW`) : SplitText, BlurText, CountUp, LogoLoop, SpotlightCard, ScrollStack, Magnet, AnimatedContent. Licence MIT + Commons Clause : utilisation libre dans le site, revente des composants interdite.

## Où modifier quoi

| Quoi | Fichier |
|---|---|
| Coordonnées, liens, menu, produits, valeurs, démarche | `src/lib/site.ts` |
| Offres et comparatif Microsoft 365, Acronis | `src/lib/m365.ts` |
| Couleurs, typographie, boutons | `src/app/globals.css` |
| Pages | `src/app/**/page.tsx` |
| Réécritures d'URL IIS | `public/web.config` |

## Commandes

Node 24 portable : `C:\Users\NOURHENE\AppData\Local\Programs\node-v24.20.0-win-x64` (à mettre en tête du PATH).

```bash
npm install
npm run dev                      # développement : http://localhost:3000 (URL sans .html)
npx next build                   # génère le dossier out/
node scripts/serve-out.mjs 3100  # teste out/ avec les mêmes URL qu'IIS : http://127.0.0.1:3100
```

## URL conservées

| URL d'origine | Fichier servi |
|---|---|
| `/` et `/index.html` | `index.html` |
| `/Presentation.html` | redirection 301 vers l’accueil (page supprimée) |
| `/microsoft-365-PowerBI.html` (et `#powerBI`) | `microsoft-365-PowerBI.html` |
| `/PowerBI-Tunisie.html` | `PowerBI-Tunisie.html` |
| `/Politique de confidentialité.html` | `politique-de-confidentialite.html` (réécriture) |
| `/site/formulaire.php` | `contact.html` (réécriture) |
| `/login.html` | `login.html` |
| anciens formulaires `/site/contact.php`, `index-4.php`… | redirection 301 vers `/site/formulaire.php` |
| `/sage.tn/`, `/divalto.tn/`, `/bitrix24.tn/`, `/ciel.tn/` | inchangés (WordPress) |
| `/site/send.php`, `/telechargement/`, `/images/`, `/HelpDesk/` | inchangés |

Le formulaire envoie en JSON au script existant `/site/send.php` (mêmes champs qu'avant, jeton reCAPTCHA sous la clé `recaptcha`).

## Mise en ligne sur IIS

1. Sauvegarder la racine actuelle du site (au minimum `web.config`, `index.html`, `Presentation.html`, `microsoft-365-PowerBI.html`, `PowerBI-Tunisie.html`, `login.html`, `Politique de confidentialité.html`, `app.php`, `inc/`, `pages/`, `theme/`).
2. `npx next build`, puis copier **le contenu** de `out/` à la racine du site. Cela remplace les fichiers `.html` du même nom et `web.config`.
3. Ne pas supprimer : `sage.tn/`, `divalto.tn/`, `bitrix24.tn/`, `ciel.tn/`, `site/` (send.php, PHPMailer), `telechargement/`, `images/`, `HelpDesk/`.
4. Vérifier que le module **URL Rewrite** d'IIS est installé (déjà utilisé par l'ancien `web.config`).
5. Tester : accueil, menu, une page produit WordPress, le formulaire (un vrai envoi), `/site/formulaire.php`, une URL inexistante (page 404).

Retour arrière : remettre les fichiers sauvegardés à l'étape 1.

## À vérifier après mise en ligne

- **reCAPTCHA** : la clé doit autoriser le domaine utilisé (mediasoft.tn **et** mediasoft.com.tn). En local, Google affiche « hôte local non accepté », c'est normal.
- **Envoi réel d'un e-mail** depuis le formulaire : non testé en local.
- **Tidio** (chat, accueil) et **Google Tag Manager** (page contact) : chargés comme sur le site d'origine ; Tidio refuse localhost.
- `login.html` poste vers `login.php`, `inscription.php` et `verif_login.php`, absents de la racine : c'était déjà le cas sur le site d'origine (l'assistance se fait sur helpdesk-ms.com).


## Références étudiées (2026-10-22)
Accenture, Digital Apple, Intercept, IBM Consulting, Articulate Marketing, Transmission : positionnement affirmé, offres IA concrètes, repères vérifiés, FAQ, appel à l'action « diagnostic ». Copie avant ces changements : `../mediasoft-creative-v1-ia`.

## IA & innovation (2026-10-24)
Section `home/AiInnovation.tsx`, inspirée de digitalapple.ai (vidéo plein cadre + grand titre blanc + pastille verte, puis panneaux noir / violet / rose / vert avec mot géant en filigrane). La vidéo `public/video/ia-innovation*.mp4` est une animation 3D originale (cubes bleus et orange qui s’assemblent en sphère), rendue avec Three.js : scène dans `scripts/ia-video-scene.html`. L’IA est présentée comme une offre à part, sans lien avec les éditeurs. Version sans IA : `../mediasoft-creative-v2-sans-ia`.
