import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { news as newsSeed } from "@/data/news";
import { partners as partnersSeed } from "@/data/partners";
import { fighters as fightersSeed } from "@/data/fighters";
import { editions as editionsSeed } from "@/data/editions";
import { communes as communesSeed } from "@/data/communes";
import type { CommuneInfo, Edition, Fighter, NewsArticle, Partner } from "@/data/types";

/**
 * Persistance simple sur fichiers JSON (data-store/) avec seed automatique
 * depuis src/data. Suffisant pour la version test ; à remplacer par une vraie
 * base (PostgreSQL/Prisma) pour la production.
 */

/**
 * Répertoire de persistance :
 * - en local : ./data-store (durable)
 * - sur Vercel : /tmp (éphémère — les écritures fonctionnent mais se
 *   réinitialisent au redéploiement ; migrer vers une vraie base pour la prod).
 */
export const DATA_DIR = process.env.VERCEL
  ? "/tmp/cdt-data-store"
  : path.join(process.cwd(), "data-store");

async function readJson<T>(file: string, seed: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

export async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

/* ---------- Collections éditoriales ---------- */

export const loadNews = () => readJson<NewsArticle[]>("news.json", newsSeed);
export const saveNews = (d: NewsArticle[]) => writeJson("news.json", d);

export const loadPartners = () => readJson<Partner[]>("partners.json", partnersSeed);
export const savePartners = (d: Partner[]) => writeJson("partners.json", d);

export const loadFighters = () => readJson<Fighter[]>("fighters.json", fightersSeed);
export const saveFighters = (d: Fighter[]) => writeJson("fighters.json", d);

export const loadEditions = () => readJson<Edition[]>("editions.json", editionsSeed);
export const saveEditions = (d: Edition[]) => writeJson("editions.json", d);

export const loadCommunes = () => readJson<CommuneInfo[]>("communes.json", communesSeed);
export const saveCommunes = (d: CommuneInfo[]) => writeJson("communes.json", d);

/* ---------- Helpers événements (calculés sur le store) ---------- */

export const pickCurrentEdition = (editions: Edition[]) =>
  editions.find((e) => e.status === "en cours") ?? editions[0];

export const pickNextStage = (editions: Edition[]) =>
  pickCurrentEdition(editions)?.stages.find((s) => s.status === "à venir");

export const pickLastCompletedStage = (editions: Edition[]) =>
  [...(pickCurrentEdition(editions)?.stages ?? [])]
    .reverse()
    .find((s) => s.status === "terminé");

/* ---------- Contenu éditable du site (accueil, AIB) ---------- */

export interface LocalizedText {
  fr: string;
  en: string;
}

export interface SiteContent {
  hero: { image: string; badge: LocalizedText; subtitle: LocalizedText };
  stats: { value: number; suffix: string; label: LocalizedText }[];
  aib: {
    president: {
      name: string;
      photo: string;
      role: LocalizedText;
      quote: LocalizedText;
    };
    stats: { value: number; suffix: string; label: LocalizedText }[];
    mvv: { title: LocalizedText; text: LocalizedText }[];
  };
}

export const defaultContent: SiteContent = {
  hero: {
    image: "/images/cdt7/bingerville/lourd/lourd-10.jpg",
    badge: {
      fr: "7ᵉ édition · Saison 2026 en cours",
      en: "7th edition · 2026 season underway",
    },
    subtitle: {
      fr: "La grande arène ivoirienne de la boxe et du MMA. Des communes aux projecteurs, les meilleurs combattants du pays s'affrontent pour entrer dans la légende.",
      en: "Ivory Coast's grand boxing and MMA arena. From the communes to the spotlight, the country's best fighters battle their way into legend.",
    },
  },
  stats: [
    { value: 7, suffix: "", label: { fr: "Éditions", en: "Editions" } },
    { value: 6, suffix: "+", label: { fr: "Communes traversées", en: "Communes visited" } },
    { value: 40, suffix: "+", label: { fr: "Combats de gala", en: "Gala fights" } },
    { value: 42, suffix: "", label: { fr: "Partenaires engagés", en: "Committed partners" } },
  ],
  aib: {
    president: {
      name: "Jhimmy Traoré",
      photo: "/images/officiels/president-jhimmy-traore.jpg",
      role: {
        fr: "Président de l'Association Ivoirienne de Boxe · Promoteur du Choc des Titans",
        en: "President of the Ivorian Boxing Association · Promoter of the Clash of the Titans",
      },
      quote: {
        fr: "La boxe m'a tout appris : la discipline, le respect, la rage de se relever. Avec l'AIB et le Choc des Titans, nous offrons à la jeunesse ivoirienne ce que le ring m'a offert — un avenir. Chaque jeune qui enfile les gants dans nos clubs est déjà un champion.",
        en: "Boxing taught me everything: discipline, respect, the will to get back up. With the AIB and the Clash of the Titans, we offer Ivorian youth what the ring offered me — a future. Every young person who laces up gloves in our clubs is already a champion.",
      },
    },
    stats: [
      { value: 42, suffix: "", label: { fr: "Clubs affiliés", en: "Affiliated clubs" } },
      { value: 950, suffix: "+", label: { fr: "Licenciés", en: "Licensed members" } },
      { value: 16, suffix: "", label: { fr: "Régions couvertes", en: "Regions covered" } },
      { value: 7, suffix: "", label: { fr: "Éditions du CDT", en: "CDT editions" } },
    ],
    mvv: [
      {
        title: { fr: "Notre mission", en: "Our mission" },
        text: {
          fr: "Structurer, encadrer et développer la pratique de la boxe en Côte d'Ivoire : formation des entraîneurs, arbitrage, compétitions officielles et accompagnement des clubs affiliés.",
          en: "Structure, supervise and grow boxing in Ivory Coast: coach training, refereeing, official competitions and support for affiliated clubs.",
        },
      },
      {
        title: { fr: "Notre vision", en: "Our vision" },
        text: {
          fr: "Faire de la Côte d'Ivoire une nation de référence du noble art en Afrique, avec des champions formés localement et une filière sportive professionnelle et durable.",
          en: "Make Ivory Coast a leading nation of the noble art in Africa, with home-grown champions and a professional, sustainable sporting pathway.",
        },
      },
      {
        title: { fr: "Nos engagements", en: "Our commitments" },
        text: {
          fr: "Éducation par le sport, égalité d'accès filles-garçons, santé des athlètes et des communautés, insertion sociale de la jeunesse par la discipline et l'effort.",
          en: "Education through sport, equal access for girls and boys, athlete and community health, and social inclusion of the youth through discipline and effort.",
        },
      },
    ],
  },
};

export const loadContent = async (): Promise<SiteContent> => {
  const raw = await readJson<Partial<SiteContent>>("content.json", defaultContent);
  return {
    hero: { ...defaultContent.hero, ...(raw.hero ?? {}) },
    stats: raw.stats?.length ? raw.stats : defaultContent.stats,
    aib: {
      president: { ...defaultContent.aib.president, ...(raw.aib?.president ?? {}) },
      stats: raw.aib?.stats?.length ? raw.aib.stats : defaultContent.aib.stats,
      mvv: raw.aib?.mvv?.length ? raw.aib.mvv : defaultContent.aib.mvv,
    },
  };
};
export const saveContent = (d: SiteContent) => writeJson("content.json", d);

/* ---------- Photos supplémentaires de galerie (uploadées) ---------- */

export type GalleryExtra = Record<string, string[]>; // clé de section -> urls

export const loadGalleryExtra = () => readJson<GalleryExtra>("gallery-extra.json", {});
export const saveGalleryExtra = (d: GalleryExtra) => writeJson("gallery-extra.json", d);

/* ---------- Utilisateurs du back office ---------- */

export interface AdminUser {
  id: string;
  name: string;
  user: string; // identifiant de connexion
  passwordHash: string; // sha256(salt + mot de passe)
  salt: string;
  role: "admin" | "superadmin";
  createdAt: string;
}

export const loadUsers = () => readJson<AdminUser[]>("users.json", []);
export const saveUsers = (d: AdminUser[]) => writeJson("users.json", d);

/* ---------- Données opérationnelles ---------- */

export interface Order {
  id: string;
  offerId: string;
  offerName: string;
  amount: number; // FCFA
  method: string;
  phone?: string;
  email?: string;
  status: "payée" | "en attente" | "remboursée";
  createdAt: string;
}

export const loadOrders = () => readJson<Order[]>("orders.json", []);
export const saveOrders = (d: Order[]) => writeJson("orders.json", d);

export interface MembershipRequest {
  id: string;
  type: "club" | "soutien" | "benevole" | "athlete";
  name: string;
  email: string;
  phone: string;
  commune: string;
  club?: string;
  message?: string;
  status: "en attente" | "approuvée" | "refusée";
  createdAt: string;
}

export const loadMemberships = () =>
  readJson<MembershipRequest[]>("memberships.json", []);
export const saveMemberships = (d: MembershipRequest[]) =>
  writeJson("memberships.json", d);

/* ---------- Paramètres plateforme ---------- */

export interface Settings {
  liveMode: boolean; // bascule le site en mode "direct en cours"
  liveTitle: string;
  prices: Record<string, number>; // offerId -> FCFA
  /** Primes des vainqueurs par combat (fightId -> FCFA), éditables en back office. */
  purses: Record<string, number>;
  /** Chaîne YouTube officielle : @handle, URL ou ID (UC…). */
  youtubeChannel: string;
  /** Vidéos YouTube masquées sur le site (ids). */
  hiddenVideoIds: string[];
}

export const defaultSettings: Settings = {
  liveMode: false,
  liveTitle: "CDT 7 — Étape 2 · Yopougon",
  prices: { "pass-soiree": 2000, "pass-edition": 7500, "pass-vip": 15000 },
  purses: {
    "cdt7-e1-lourd": 2_000_000,
    "cdt7-e1-milourd": 1_000_000,
    "cdt7-e1-moyen": 500_000,
    "cdt7-e1-welter": 300_000,
    "cdt7-e1-plume": 200_000,
  },
  youtubeChannel: "UCf5_Q44xaMGw84l_o875OKA",
  hiddenVideoIds: [],
};

export const loadSettings = async (): Promise<Settings> => {
  const raw = await readJson<Partial<Settings>>("settings.json", defaultSettings);
  return {
    ...defaultSettings,
    ...raw,
    prices: { ...defaultSettings.prices, ...(raw.prices ?? {}) },
    purses: { ...defaultSettings.purses, ...(raw.purses ?? {}) },
    youtubeChannel: raw.youtubeChannel || defaultSettings.youtubeChannel,
    hiddenVideoIds: raw.hiddenVideoIds ?? [],
  };
};
export const saveSettings = (d: Settings) => writeJson("settings.json", d);

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
