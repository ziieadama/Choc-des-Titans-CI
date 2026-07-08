# 🥊 Choc des Titans — Plateforme officielle

Site web officiel du **Choc des Titans**, la grande compétition ivoirienne de boxe et de MMA
organisée par **JTS Group** et l'**Association Ivoirienne de Boxe (AIB)**, présidée par
**Jhimmy Traoré**, sous l'égide du Ministère des Sports.

> Version test avancée — contenus de démonstration réalistes à valider par l'organisation
> (les résultats de l'étape 1 du CDT 7 à Bingerville proviennent du communiqué officiel).

## ✨ Nouveautés v2

- **Thème clair par défaut** (fond dégradé premium) avec bascule 🌙 vers le thème sombre
  (persistée par appareil). Les héros photo et l'admin restent des îlots sombres (`.dark-section`).
- **Bilingue FR/EN** : sélecteur dans la barre de navigation (cookie `cdt_lang`).
  Interface et sections traduites ; les contenus éditoriaux (bios, articles) restent en FR.
- **Nuage de partenaires** sur l'accueil : disposition aléatoire, **taille des logos
  proportionnelle à la portée** (`reach` 10-100) réglable dans le back office.
- **Logos partenaires** : upload direct dans Admin → Partenaires (PNG/JPG/WebP/SVG, 2 Mo),
  servis par `/api/uploads/*` ; monogramme élégant à défaut. Axenfo ajouté en partenaire
  média premium, + partenaires du mur officiel (SNTIC, AGEROUTE, CIE, La 3, Orca, AMSA…).
- **Cartes résultats photo-forward** : boxeurs en grand, vainqueur mis en lumière
  (ruban or, adversaire estompé) et **prime du vainqueur** affichée (100 000 → 2 000 000 FCFA),
  éditable dans Admin → Paramètres & Live → Récompenses des combats.
- **Portraits officiels** : grande photo solennelle du président Jhimmy Traoré (page AIB)
  et portrait rigoureux du parrain sur les pages communes — photos placeholder issues des
  visuels fournis (`public/images/officiels/`), à remplacer par les portraits définitifs.
- Logo affiché **sans cercle ni fond**, halo de visibilité en thème sombre.
- Animations renforcées : compteurs animés, Ken Burns sur les héros, reflets sur les CTA,
  entrées spring du nuage de logos — le tout respectant `prefers-reduced-motion`.

## 🚀 Démarrage

```bash
npm install
npm run dev        # développement → http://localhost:3000
npm run build && npm start   # production
```

## 🔐 Back office

Accessible sur **`/admin`** — deux comptes (configurés dans `.env.local`) :

| Rôle | Identifiant | Mot de passe | Droits |
|---|---|---|---|
| Admin | `admin` | `titans2026` | Gestion courante (contenus, ventes, adhésions, paramètres) |
| ★ Superadmin | `superadmin` | voir `.env.local` | Tout + opérations sensibles (suppressions de ventes/adhésions) |

Le rôle est signé dans le cookie de session (HMAC) et vérifié côté serveur ;
un badge dans la barre latérale indique le rôle connecté.

À configurer en production via `.env.local` (voir `.env.example`) :
`ADMIN_USER`, `ADMIN_PASSWORD` et surtout `ADMIN_SECRET` (clé de signature des sessions
HMAC-SHA256, expiration 12 h, cookie httpOnly, middleware de protection sur `/admin/*`
et `/api/admin/*`).

### Fonctionnalités du back office

- **Vue d'ensemble** : revenus PPV, graphe 7 jours, dernières ventes et adhésions
- **Ventes PPV** : commandes réelles issues du checkout public, changement de statut
- **Adhésions AIB** : demandes du formulaire « Rejoindre l'AIB », approbation/refus
- **Actualités** : CRUD complet, publié instantanément sur le site
- **Combattants** : édition des records, surnoms, bios, statut champion
- **Partenaires** : CRUD complet (~30 partenaires), publié instantanément
- **Paramètres & Live** : bascule du **mode direct** (le site passe en « EN DIRECT »)
  et modification des prix des pass en temps réel

## 📡 Contact & réseaux

- **WhatsApp officiel : +225 07 48 30 81 36** — bouton flottant sur tout le site,
  lien dans le footer, message pré-rempli bilingue (`whatsappLink()` dans `src/data/site.ts`).
- Réseaux officiels (Facebook, Instagram, TikTok, YouTube) reliés partout :
  footer, menu mobile, articles, page AIB, page Vidéos (`SocialRow`).

## 🎬 Synchronisation YouTube automatique

Les vidéos publiées sur la chaîne officielle **CHOC DES TITANS**
(`UCf5_Q44xaMGw84l_o875OKA`) apparaissent automatiquement sur le site :

- page **`/videos`** (filtres « Combats & résumés » / « Coulisses », lecteur intégré
  youtube-nocookie) et section « Dernières vidéos » sur l'accueil ;
- classement automatique combat/coulisses d'après le titre et la description ;
- synchronisation toutes les **15 minutes** (cache disque `data-store/youtube-cache.json`
  pour préserver le quota) ; en cas d'erreur API le dernier cache est servi ;
- chaîne modifiable dans **Admin → Paramètres & Live** (@handle, URL ou ID) ;
- 🔒 la clé `YOUTUBE_API_KEY` vit dans `.env.local` (gitignoré) et n'est **jamais**
  envoyée au navigateur (module `server-only`).

## 📺 Pay-per-view (démo)

La page **`/direct`** propose 3 pass (Soirée 2 000 F · Édition 7 500 F · VIP 15 000 F)
avec un checkout simulé Orange Money / MTN MoMo / Moov Money / Wave / carte bancaire.
Aucun débit réel : chaque achat crée une commande visible dans le back office et
déverrouille le player sur l'appareil (localStorage).

Pour la production : brancher un agrégateur de paiement (CinetPay, PayDunya, Bizao…)
et servir le flux via un service de streaming (Mux, Cloudflare Stream…).

## 🗂️ Architecture

```
src/
├── app/
│   ├── (public)/          # Site public (navbar + footer)
│   │   ├── page.tsx       # Accueil
│   │   ├── evenements/    # Éditions 1 → 7 + détail (combats, résultats)
│   │   ├── combattants/   # Roster + profils (stats animées)
│   │   ├── galerie/       # Édition → commune → photos (+ mot du maire)
│   │   ├── direct/        # PPV : paywall, checkout, player
│   │   ├── aib/           # Présentation AIB + « Rejoindre l'AIB »
│   │   ├── partenaires/   # Mur de partenaires + modals détail
│   │   └── actualites/    # Articles (gérés par le back office)
│   ├── admin/             # Back office (login + dashboard)
│   └── api/               # orders, membership, admin/*
├── components/            # UI partagée (FaceOff, FightCard, GalleryGrid…)
├── data/                  # Contenus : éditions, combattants, partenaires, communes…
├── lib/
│   ├── store.ts           # Persistance JSON (data-store/) avec seed automatique
│   └── adminAuth.ts       # Sessions HMAC (Web Crypto, compatible edge)
└── middleware.ts          # Protection /admin et /api/admin
```

- **Stack** : Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion · Lucide
- **Design system** : base noire premium `#0B0B0B`, bleu CDT `#266FB3` (identité),
  rouge CDT `#E11F21` (action uniquement), touches orange/vert ivoiriennes pour l'AIB.
  Typo : Anton (titres) + Inter (texte).
- **Images** : 415 photos officielles optimisées (max 1600 px) dans `public/images/`,
  organisées par édition/commune/combat + manifeste `src/data/gallery-manifest.json`.
- **Données** : la version test persiste dans `data-store/` (JSON, gitignoré).
  Migration recommandée vers PostgreSQL + Prisma pour la production.

## ✅ Checklist avant mise en production

- [ ] Remplacer les contenus de démonstration (récits d'éditions 1-5, mots institutionnels,
      représentants des partenaires, records des combattants) par les textes validés
- [ ] Configurer `ADMIN_SECRET` + mots de passe forts
- [ ] Brancher un vrai PSP (paiement) et un service de streaming
- [ ] Migrer `data-store/` vers une base de données
- [ ] Ajouter les logos officiels des partenaires (les monogrammes actuels sont des
      placeholders élégants)
- [ ] Nom de domaine + HTTPS + analytics
