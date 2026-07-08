import { imagesOf } from "./gallery";

export interface GallerySection {
  title: string;
  key: string; // clé du manifeste
}

export interface GalleryCommune {
  slug: string; // slug commune (cf. communes.ts)
  name: string;
  cover: string;
  sections: GallerySection[];
}

export interface GalleryEdition {
  editionSlug: string; // cf. editions.ts
  title: string;
  year: number;
  description: string;
  cover: string;
  communes: GalleryCommune[];
}

/** Arborescence de la galerie : édition → commune → sections de photos. */
export const galleryEditions: GalleryEdition[] = [
  {
    editionSlug: "cdt-7",
    title: "Choc des Titans 7",
    year: 2026,
    description:
      "L'édition en cours : revivez chaque étape du circuit 2026, commune par commune, combat par combat.",
    cover: "/images/cdt7/bingerville/lourd/lourd-10.jpg",
    communes: [
      {
        slug: "bingerville",
        name: "Bingerville",
        cover: "/images/cdt7/bingerville/panorama/pano-10.jpg",
        sections: [
          { title: "Panorama de la soirée", key: "cdt7/bingerville/panorama" },
          { title: "Poids Lourd — Sylla Ismael vs Fofana Mahamadou", key: "cdt7/bingerville/lourd" },
          { title: "Mi-Lourd — Traoré Adama vs Ouattara Yaya", key: "cdt7/bingerville/mi-lourd" },
          { title: "Poids Moyen — Zah Bi Vanié vs Zio Jocelyn", key: "cdt7/bingerville/moyen" },
          { title: "Welter — Diarrassouba Mamery vs Keita Mohamed", key: "cdt7/bingerville/welter" },
          { title: "Poids Plume (F) — Lopoua Naomie vs Gouaho Parfaite", key: "cdt7/bingerville/plume" },
        ],
      },
    ],
  },
  {
    editionSlug: "cdt-6",
    title: "Choc des Titans 6",
    year: 2025,
    description:
      "L'année des communes : six étapes populaires et une grande finale au sommet. L'album souvenir complet.",
    cover: "/images/cdt6/finale/finale-01.jpg",
    communes: [
      { slug: "abobo", name: "Abobo", cover: "/images/cdt6/abobo/abobo-01.jpg", sections: [{ title: "L'étape d'Abobo", key: "cdt6/abobo" }] },
      { slug: "adjame", name: "Adjamé", cover: "/images/cdt6/adjame/adjame-01.jpg", sections: [{ title: "L'étape d'Adjamé", key: "cdt6/adjame" }] },
      { slug: "bingerville", name: "Bingerville", cover: "/images/cdt6/bingerville/bingerville-01.jpg", sections: [{ title: "L'étape de Bingerville", key: "cdt6/bingerville" }] },
      { slug: "bouake", name: "Bouaké", cover: "/images/cdt6/bouake/bouake-01.jpg", sections: [{ title: "L'étape de Bouaké", key: "cdt6/bouake" }] },
      { slug: "koumassi", name: "Koumassi", cover: "/images/cdt6/koumassi/koumassi-01.jpg", sections: [{ title: "L'étape de Koumassi", key: "cdt6/koumassi" }] },
      { slug: "yopougon", name: "Yopougon", cover: "/images/cdt6/yopougon/yopougon-01.jpg", sections: [{ title: "L'étape de Yopougon", key: "cdt6/yopougon" }] },
      { slug: "abidjan", name: "Grande Finale — Abidjan", cover: "/images/cdt6/finale/finale-01.jpg", sections: [{ title: "La Grande Finale", key: "cdt6/finale" }] },
    ],
  },
];

/** Collections transverses (hors éditions). */
export const galleryCollections: { title: string; description: string; key: string; cover: string }[] = [
  {
    title: "La ferveur du public",
    description: "Les gradins en fusion, la fête populaire autour du ring.",
    key: "misc/public",
    cover: "/images/misc/public/public-01.jpg",
  },
  {
    title: "Dépistage & santé",
    description: "Le volet social du CDT : campagnes de dépistage gratuites en marge des galas.",
    key: "misc/depistage",
    cover: "/images/misc/depistage/depistage-01.jpg",
  },
];

export const getGalleryEdition = (slug: string) =>
  galleryEditions.find((e) => e.editionSlug === slug);

export const getGalleryCommune = (editionSlug: string, communeSlug: string) =>
  getGalleryEdition(editionSlug)?.communes.find((c) => c.slug === communeSlug);

export const communePhotoCount = (c: GalleryCommune) =>
  c.sections.reduce((acc, s) => acc + imagesOf(s.key).length, 0);
