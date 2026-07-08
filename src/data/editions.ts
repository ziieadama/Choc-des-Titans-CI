import type { Edition, Fight } from "./types";

/**
 * Historique des éditions du Choc des Titans.
 * L'étape 1 de la 7e édition (Bingerville, 30/05/2026) reprend les résultats
 * officiels communiqués par l'AIB et JTS Group. Les éditions antérieures sont
 * des contenus de démonstration réalistes à compléter par l'organisation.
 */

const fightsBingerville7: Fight[] = [
  {
    id: "cdt7-e1-welter",
    weightClass: "Welter",
    red: "diarrassouba-mamery",
    blue: "keita-mohamed",
    winner: "keita-mohamed",
    method: "Décision",
    headline: true,
    story:
      "Champion en titre et triple champion, Keita Mohamed a confirmé qu'il détient la plus longue série d'invincibilité depuis la création du Choc des Titans en dominant Diarrassouba Mamery au terme d'un duel tactique de très haut niveau.",
    gallery: "cdt7/bingerville/welter",
    cover: "/images/cdt7/bingerville/welter/welter-05.jpg",
  },
  {
    id: "cdt7-e1-moyen",
    weightClass: "Poids Moyen",
    red: "zah-bi-vanie",
    blue: "zio-jocelyn",
    winner: "zio-jocelyn",
    method: "Décision",
    story:
      "Le champion en titre Zio Jocelyn bat Zah Bi Vanié pour la deuxième fois en autant de confrontations et conserve son emprise sur la catégorie des Poids Moyens.",
    gallery: "cdt7/bingerville/moyen",
    cover: "/images/cdt7/bingerville/moyen/moyen-05.jpg",
  },
  {
    id: "cdt7-e1-plume",
    weightClass: "Poids Plume",
    female: true,
    red: "lopoua-naomie",
    blue: "gouaho-parfaite",
    winner: "gouaho-parfaite",
    method: "Décision",
    story:
      "Dans la confrontation entre les éternelles rivales, Gouaho Parfaite s'impose et relance la série : 2 victoires pour Naomie, 1 pour Parfaite. Le combat féminin le plus attendu du circuit a tenu toutes ses promesses.",
    gallery: "cdt7/bingerville/plume",
    cover: "/images/cdt7/bingerville/plume/plume-05.jpg",
  },
  {
    id: "cdt7-e1-milourd",
    weightClass: "Mi-Lourd",
    red: "traore-adama",
    blue: "ouattara-yaya",
    winner: "traore-adama",
    method: "K.O",
    story:
      "Battu lors de la 6e édition par le champion Ouattara Yaya, Traoré Adama réaffirme sa position de favori pour le titre chez les Mi-Lourds avec une victoire spectaculaire par K.O.",
    gallery: "cdt7/bingerville/mi-lourd",
    cover: "/images/cdt7/bingerville/mi-lourd/milourd-10.jpg",
  },
  {
    id: "cdt7-e1-lourd",
    weightClass: "Poids Lourd",
    red: "sylla-ismael",
    blue: "fofana-mahamadou",
    winner: "sylla-ismael",
    method: "K.O",
    headline: true,
    story:
      "Champion 2024 absent de la compétition en 2025, Sylla Ismael a battu par K.O le champion en titre Fofana Mahamadou. Leur première confrontation sur le circuit du Choc des Titans tourne à l'avantage du Titan de Koumassi.",
    gallery: "cdt7/bingerville/lourd",
    cover: "/images/cdt7/bingerville/lourd/lourd-10.jpg",
  },
];

export const editions: Edition[] = [
  {
    number: 7,
    slug: "cdt-7",
    year: 2026,
    title: "Choc des Titans 7",
    tagline: "La conquête continue",
    status: "en cours",
    description:
      "Organisée sous l'égide du Ministère des Sports par l'Association Ivoirienne de Boxe (AIB), présidée par Jhimmy Traoré, et JTS Group, la 7e édition sillonne les communes de Côte d'Ivoire pour couronner les nouveaux Titans. Étape après étape, les meilleurs boxeurs du pays s'affrontent devant un public en fusion.",
    highlights: [
      "5 combats de gala à Bingerville pour l'étape 1",
      "Keita Mohamed étend son invincibilité historique",
      "Deux victoires par K.O : Traoré Adama et Sylla Ismael",
      "Le retour du champion 2024 Sylla Ismael",
    ],
    cover: "/images/cdt7/bingerville/lourd/lourd-10.jpg",
    galleryEditionKey: "cdt7",
    stages: [
      {
        slug: "etape-1-bingerville",
        name: "Étape 1 — Bingerville",
        commune: "Bingerville",
        date: "2026-05-30T19:00:00",
        venue: "Foyer des Jeunes de Bingerville",
        status: "terminé",
        parrain: "Hon. Doumbia Issouf, Député-Maire de Bingerville",
        personalities: [
          "Hon. Doumbia Issouf — Député-Maire de Bingerville",
          "Gbané Ousmane — Directeur Général de l'ONS",
          "Hon. Bema Fofana — Député de Bouaké",
        ],
        fights: fightsBingerville7,
        cover: "/images/cdt7/bingerville/panorama/pano-10.jpg",
      },
      {
        slug: "etape-2-yopougon",
        name: "Étape 2 — Yopougon",
        commune: "Yopougon",
        date: "2026-07-25T19:00:00",
        venue: "Complexe Sportif de Yopougon",
        status: "à venir",
        fights: [],
        cover: "/images/cdt6/yopougon/yopougon-01.jpg",
      },
      {
        slug: "etape-3-abobo",
        name: "Étape 3 — Abobo",
        commune: "Abobo",
        date: "2026-09-12T19:00:00",
        venue: "Parc des Sports d'Abobo",
        status: "à venir",
        fights: [],
        cover: "/images/cdt6/abobo/abobo-01.jpg",
      },
      {
        slug: "grande-finale",
        name: "Grande Finale — Abidjan",
        commune: "Abidjan",
        date: "2026-12-19T19:00:00",
        venue: "Palais des Sports de Treichville",
        status: "à venir",
        fights: [],
        cover: "/images/cdt6/finale/finale-05.jpg",
      },
    ],
  },
  {
    number: 6,
    slug: "cdt-6",
    year: 2025,
    title: "Choc des Titans 6",
    tagline: "L'année des communes",
    status: "terminée",
    description:
      "La 6e édition a marqué un tournant : un circuit itinérant à travers six communes — Abobo, Adjamé, Bingerville, Bouaké, Koumassi et Yopougon — avant une grande finale mémorable. Des milliers de spectateurs, des révélations, et des champions couronnés devant leur public.",
    highlights: [
      "6 communes traversées, une finale au sommet",
      "Ouattara Yaya sacré chez les Mi-Lourds",
      "Fofana Mahamadou champion des Poids Lourds",
      "Records d'affluence à Yopougon et Abobo",
    ],
    cover: "/images/cdt6/finale/finale-01.jpg",
    galleryEditionKey: "cdt6",
    stages: [
      { slug: "abobo", name: "Étape — Abobo", commune: "Abobo", date: "2025-05-10T19:00:00", venue: "Parc des Sports d'Abobo", status: "terminé", fights: [], cover: "/images/cdt6/abobo/abobo-01.jpg" },
      { slug: "adjame", name: "Étape — Adjamé", commune: "Adjamé", date: "2025-05-24T19:00:00", venue: "Place de la Mairie d'Adjamé", status: "terminé", fights: [], cover: "/images/cdt6/adjame/adjame-01.jpg" },
      { slug: "bingerville", name: "Étape — Bingerville", commune: "Bingerville", date: "2025-06-07T19:00:00", venue: "Foyer des Jeunes de Bingerville", status: "terminé", fights: [], cover: "/images/cdt6/bingerville/bingerville-01.jpg" },
      { slug: "bouake", name: "Étape — Bouaké", commune: "Bouaké", date: "2025-06-14T19:00:00", venue: "Stade de la Paix — Esplanade", status: "terminé", fights: [], cover: "/images/cdt6/bouake/bouake-01.jpg" },
      { slug: "koumassi", name: "Étape — Koumassi", commune: "Koumassi", date: "2025-06-28T19:00:00", venue: "Complexe Sportif de Koumassi", status: "terminé", fights: [], cover: "/images/cdt6/koumassi/koumassi-01.jpg" },
      { slug: "yopougon", name: "Étape — Yopougon", commune: "Yopougon", date: "2025-07-05T19:00:00", venue: "Complexe Sportif de Yopougon", status: "terminé", fights: [], cover: "/images/cdt6/yopougon/yopougon-01.jpg" },
      { slug: "finale", name: "Grande Finale", commune: "Abidjan", date: "2025-07-19T19:00:00", venue: "Palais des Sports de Treichville", status: "terminé", fights: [], cover: "/images/cdt6/finale/finale-01.jpg" },
    ],
  },
  {
    number: 5,
    slug: "cdt-5",
    year: 2024,
    title: "Choc des Titans 5",
    tagline: "Le sacre des puncheurs",
    status: "terminée",
    description:
      "Une édition dominée par la puissance : Sylla Ismael s'impose chez les Poids Lourds et Keita Mohamed décroche son troisième titre consécutif chez les Welters, entrant dans la légende de la compétition.",
    highlights: [
      "Sylla Ismael champion des Poids Lourds",
      "3e titre consécutif pour Keita Mohamed",
      "Première retransmission en direct des demi-finales",
    ],
    cover: "/images/misc/public/public-05.jpg",
    stages: [],
  },
  {
    number: 4,
    slug: "cdt-4",
    year: 2023,
    title: "Choc des Titans 4",
    tagline: "La boxe féminine à l'honneur",
    status: "terminée",
    description:
      "L'édition de la consécration pour la boxe féminine ivoirienne : les combats féminins intègrent officiellement la carte principale, portés par la rivalité naissante entre Lopoua Naomie et Gouaho Parfaite.",
    highlights: [
      "Les combats féminins rejoignent la carte principale",
      "Premier duel Lopoua Naomie vs Gouaho Parfaite",
      "Plus de 5 000 spectateurs à la finale",
    ],
    cover: "/images/misc/public/public-10.jpg",
    stages: [],
  },
  {
    number: 3,
    slug: "cdt-3",
    year: 2022,
    title: "Choc des Titans 3",
    tagline: "L'expansion",
    status: "terminée",
    description:
      "Le Choc des Titans sort d'Abidjan pour la première fois et pose ses gants à Bouaké. Le circuit devient national et les clubs de l'intérieur du pays rejoignent la compétition.",
    highlights: [
      "Première étape hors d'Abidjan (Bouaké)",
      "12 clubs affiliés AIB engagés",
      "Keita Mohamed conserve son titre",
    ],
    cover: "/images/misc/public/public-15.jpg",
    stages: [],
  },
  {
    number: 2,
    slug: "cdt-2",
    year: 2021,
    title: "Choc des Titans 2",
    tagline: "La confirmation",
    status: "terminée",
    description:
      "Après le succès fondateur de la première édition, le Choc des Titans confirme : les gradins se remplissent, les communes s'engagent et les premiers grands champions émergent.",
    highlights: [
      "Premier titre de Keita Mohamed",
      "Doublement de l'affluence",
      "Lancement du dépistage santé gratuit en marge des galas",
    ],
    cover: "/images/misc/depistage/depistage-01.jpg",
    stages: [],
  },
  {
    number: 1,
    slug: "cdt-1",
    year: 2020,
    title: "Choc des Titans 1",
    tagline: "La naissance d'une légende",
    status: "terminée",
    description:
      "Tout commence par une vision : offrir à la jeunesse ivoirienne une grande scène dédiée à la boxe. Portée par Jhimmy Traoré et l'AIB, la première édition pose les fondations de ce qui deviendra le rendez-vous incontournable des sports de combat en Côte d'Ivoire.",
    highlights: [
      "Édition fondatrice portée par l'AIB et JTS Group",
      "8 combats, 4 catégories de poids",
      "La naissance du rendez-vous des sports de combat ivoiriens",
    ],
    cover: "/images/misc/public/public-20.jpg",
    stages: [],
  },
];

export const currentEdition = editions[0];

export const getEdition = (slug: string) =>
  editions.find((e) => e.slug === slug);

export const nextStage = () =>
  currentEdition.stages.find((s) => s.status === "à venir");

export const lastCompletedStage = () =>
  [...currentEdition.stages].reverse().find((s) => s.status === "terminé");
