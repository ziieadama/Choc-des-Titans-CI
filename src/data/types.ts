export type WeightClass =
  | "Poids Plume"
  | "Welter"
  | "Poids Moyen"
  | "Mi-Lourd"
  | "Poids Lourd";

export interface Fighter {
  slug: string;
  name: string;
  nickname?: string;
  commune: string;
  weightClass: WeightClass;
  gender: "H" | "F";
  record: { wins: number; losses: number; draws: number; ko: number };
  titles: string[];
  bio: string;
  photo: string;
  champion?: boolean;
  stats: { puissance: number; vitesse: number; technique: number; endurance: number };
}

export interface Fight {
  id: string;
  weightClass: WeightClass;
  female?: boolean;
  red: string; // fighter slug
  blue: string; // fighter slug
  winner?: string; // fighter slug
  method?: "Décision" | "K.O" | "TKO" | "Abandon";
  headline?: boolean;
  story: string;
  gallery?: string; // gallery manifest key
  cover?: string;
}

export interface Stage {
  slug: string;
  name: string;
  commune: string;
  date: string; // ISO
  venue: string;
  status: "terminé" | "à venir" | "en direct";
  parrain?: string;
  personalities?: string[];
  fights: Fight[];
  cover: string;
}

export interface Edition {
  number: number;
  slug: string;
  year: number;
  title: string;
  tagline: string;
  status: "terminée" | "en cours" | "à venir";
  description: string;
  highlights: string[];
  stages: Stage[];
  cover: string;
  galleryEditionKey?: string; // ex: "cdt6"
}

export interface Partner {
  id: string;
  name: string;
  category: "Institutionnel" | "Automobile" | "Média" | "Télécom & Finance" | "Équipement & Vie" | "Collectivité";
  tier: "titan" | "or" | "officiel";
  representative?: string;
  role?: string;
  message: string;
  about: string;
  since?: string;
  initials: string;
  color: string; // accent hex for monogram tile
  /** Logo du partenaire (chemin ou URL). Monogramme affiché à défaut. */
  logo?: string;
  /** Portée du partenariat (10-100) : détermine la taille du logo affiché. */
  reach?: number;
}

export interface CommuneInfo {
  slug: string;
  name: string;
  region: string;
  description: string;
  lienCdt: string;
  motInstitutionnel?: { auteur: string; fonction: string; texte: string; photo?: string };
  stats?: { clubs: number; boxeurs: number; editionsAccueillies: number };
}

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: "Résultats" | "Annonce" | "AIB" | "Interview" | "Partenariat";
  cover: string;
  body: string[];
}
