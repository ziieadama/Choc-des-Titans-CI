/** Configuration globale de la plateforme. */

export const siteConfig = {
  name: "Choc des Titans",
  shortName: "CDT",
  organizer: "JTS Group & Association Ivoirienne de Boxe (AIB)",
  president: "Jhimmy Traoré",
  tutelle: "Sous l'égide du Ministère des Sports de Côte d'Ivoire",
  contact: {
    email: "contact@chocdestitans.ci",
    phone: "+225 07 48 30 81 36",
    whatsapp: "+225 07 48 30 81 36",
    address: "Abidjan, Côte d'Ivoire",
  },
  socials: {
    facebook: "https://www.facebook.com/share/1C7rrKzVth/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/choc_des_titans?igsh=dGoyMGFra2M5Mmxk",
    youtube: "https://www.youtube.com/channel/UCf5_Q44xaMGw84l_o875OKA",
    tiktok: "https://www.tiktok.com/@chocdestitans7.p?_r=1&_t=ZN-97rbErjUzzS",
  },
};

/** Lien WhatsApp officiel du Choc des Titans (contact organisation). */
export const whatsappLink = (message?: string) =>
  `https://wa.me/2250748308136${message ? `?text=${encodeURIComponent(message)}` : ""}`;

export const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/evenements", label: "Événements" },
  { href: "/combattants", label: "Combattants" },
  { href: "/galerie", label: "Galerie" },
  { href: "/actualites", label: "Actualités" },
  { href: "/aib", label: "AIB" },
  { href: "/partenaires", label: "Partenaires" },
];

export interface PpvOffer {
  id: string;
  name: string;
  price: number; // FCFA
  description: string;
  features: string[];
  highlight?: boolean;
}

export const ppvOffers: PpvOffer[] = [
  {
    id: "pass-soiree",
    name: "Pass Soirée",
    price: 2000,
    description: "L'étape en cours, en direct et en HD.",
    features: [
      "Direct intégral de la soirée",
      "Qualité HD 1080p",
      "Replay disponible 48h",
      "Accès mobile, tablette et TV",
    ],
  },
  {
    id: "pass-edition",
    name: "Pass Édition",
    price: 7500,
    description: "Toutes les étapes du CDT 7, finale incluse.",
    features: [
      "Toutes les étapes en direct",
      "Grande Finale incluse",
      "Replays illimités de l'édition",
      "Contenus exclusifs vestiaires",
      "Qualité HD 1080p",
    ],
    highlight: true,
  },
  {
    id: "pass-vip",
    name: "Pass VIP Digital",
    price: 15000,
    description: "L'expérience ultime, au plus près du ring.",
    features: [
      "Tout le Pass Édition",
      "Caméra bord de ring exclusive",
      "Face-à-face et pesées en direct",
      "Interviews d'après-combat",
      "Badge supporter officiel digital",
    ],
  },
];

export const paymentMethods = [
  { id: "orange", name: "Orange Money", color: "#f77f00" },
  { id: "mtn", name: "MTN MoMo", color: "#ffcc00" },
  { id: "moov", name: "Moov Money", color: "#0066b3" },
  { id: "wave", name: "Wave", color: "#1dc4ff" },
  { id: "card", name: "Carte bancaire", color: "#9aa3ad" },
] as const;

export const formatFcfa = (n: number) =>
  n.toLocaleString("fr-FR").replace(/ /g, " ") + " FCFA";
