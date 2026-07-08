import type { CommuneInfo } from "./types";

/**
 * Communes du circuit Choc des Titans.
 * Le mot du parrain de Bingerville s'appuie sur le parrainage officiel de
 * l'étape 1 du CDT 7 ; les autres textes institutionnels sont des contenus de
 * démonstration à faire valider par chaque commune.
 */
export const communes: CommuneInfo[] = [
  {
    slug: "bingerville",
    name: "Bingerville",
    region: "District Autonome d'Abidjan",
    description:
      "Ancienne capitale coloniale devenue ville-jardin de l'est d'Abidjan, Bingerville cultive une tradition sportive vivace autour de son Foyer des Jeunes. C'est ici que la 7e édition du Choc des Titans a lancé sa conquête.",
    lienCdt:
      "Hôte de l'étape inaugurale du CDT 7 (30 mai 2026) sous le parrainage du Député-Maire, l'Honorable Doumbia Issouf, Bingerville a offert une soirée d'ouverture mémorable : cinq combats, deux K.O et un public en fusion.",
    motInstitutionnel: {
      auteur: "Hon. Doumbia Issouf",
      fonction: "Député-Maire de Bingerville, Parrain de l'étape 1 — CDT 7",
      photo: "/images/officiels/parrain-bingerville.jpg",
      texte:
        "Accueillir l'ouverture de la 7e édition du Choc des Titans est une fierté pour Bingerville. Cette compétition offre à notre jeunesse des modèles de discipline, de courage et de dépassement de soi. Notre commune sera toujours aux côtés de ceux qui se battent, sur le ring comme dans la vie.",
    },
    stats: { clubs: 4, boxeurs: 65, editionsAccueillies: 2 },
  },
  {
    slug: "abobo",
    name: "Abobo",
    region: "District Autonome d'Abidjan",
    description:
      "Commune la plus peuplée du nord d'Abidjan, Abobo est un vivier historique de la boxe ivoirienne. Ses clubs ont formé plusieurs champions du circuit, dont l'invincible Keita Mohamed.",
    lienCdt:
      "Terre des champions Keita Mohamed, Zio Jocelyn, Ouattara Yaya et Fofana Mahamadou, Abobo est la commune la plus titrée du Choc des Titans. Elle accueillera l'étape 3 du CDT 7 en septembre 2026.",
    motInstitutionnel: {
      auteur: "La Commune d'Abobo",
      fonction: "Message institutionnel",
      texte:
        "Abobo est fière de ses Titans. Chaque gant levé sur le ring porte l'espoir de milliers de jeunes de notre commune. Le Choc des Titans est chez lui à Abobo.",
    },
    stats: { clubs: 9, boxeurs: 180, editionsAccueillies: 4 },
  },
  {
    slug: "yopougon",
    name: "Yopougon",
    region: "District Autonome d'Abidjan",
    description:
      "Plus grande commune de Côte d'Ivoire, Yopougon respire le sport et la culture populaire. Son public est réputé pour être le plus chaud du circuit.",
    lienCdt:
      "Fief des guerriers Diarrassouba Mamery et Lopoua Naomie, Yopougon a battu des records d'affluence lors du CDT 6. La commune accueille l'étape 2 du CDT 7 le 25 juillet 2026.",
    motInstitutionnel: {
      auteur: "La Commune de Yopougon",
      fonction: "Message institutionnel",
      texte:
        "Yopougon vit au rythme du noble art. Nous attendons les Titans avec la ferveur légendaire de notre public : que le meilleur gagne, et que la jeunesse triomphe.",
    },
    stats: { clubs: 11, boxeurs: 210, editionsAccueillies: 3 },
  },
  {
    slug: "koumassi",
    name: "Koumassi",
    region: "District Autonome d'Abidjan",
    description:
      "Commune industrieuse du sud d'Abidjan, Koumassi a fait des sports de combat une véritable école de vie pour sa jeunesse.",
    lienCdt:
      "Les Titans de Koumassi — Sylla Ismael, Gouaho Parfaite et Zah Bi Vanié — ont brillé à Bingerville avec deux victoires dont un K.O retentissant du colosse Sylla.",
    motInstitutionnel: {
      auteur: "La Commune de Koumassi",
      fonction: "Message institutionnel",
      texte:
        "Le courage de nos athlètes reflète l'âme de Koumassi : une commune qui travaille, qui se bat et qui gagne. Merci au Choc des Titans de révéler nos talents.",
    },
    stats: { clubs: 7, boxeurs: 140, editionsAccueillies: 3 },
  },
  {
    slug: "adjame",
    name: "Adjamé",
    region: "District Autonome d'Abidjan",
    description:
      "Cœur commerçant d'Abidjan, Adjamé est un carrefour humain où la boxe s'est imposée comme exutoire et ascenseur social.",
    lienCdt:
      "Étape marquante du CDT 6, Adjamé a accueilli des soirées de gala sur la place de sa mairie, rapprochant le ring des quartiers populaires.",
    motInstitutionnel: {
      auteur: "La Commune d'Adjamé",
      fonction: "Message institutionnel",
      texte:
        "À Adjamé, on connaît la valeur du combat quotidien. Le Choc des Titans donne à cette énergie une scène digne et des règles nobles.",
    },
    stats: { clubs: 5, boxeurs: 95, editionsAccueillies: 1 },
  },
  {
    slug: "bouake",
    name: "Bouaké",
    region: "Région de Gbêkê",
    description:
      "Deuxième ville du pays, Bouaké est la capitale du centre et une place forte du sport ivoirien, de l'athlétisme aux sports de combat.",
    lienCdt:
      "Première ville de l'intérieur à rejoindre le circuit (CDT 3), Bouaké est la patrie du Marteau Traoré Adama, vainqueur par K.O à Bingerville. Le Député de Bouaké, l'Honorable Bema Fofana, était présent à l'ouverture du CDT 7.",
    motInstitutionnel: {
      auteur: "La Ville de Bouaké",
      fonction: "Message institutionnel",
      texte:
        "Bouaké, ville de paix et de sport, est fière de porter les couleurs du centre du pays dans cette grande aventure nationale qu'est le Choc des Titans.",
    },
    stats: { clubs: 6, boxeurs: 110, editionsAccueillies: 2 },
  },
  {
    slug: "abidjan",
    name: "Abidjan — Treichville",
    region: "District Autonome d'Abidjan",
    description:
      "Le Palais des Sports de Treichville est le temple des grandes finales : c'est ici que les Titans sont couronnés devant des milliers de spectateurs.",
    lienCdt:
      "Théâtre des grandes finales depuis la création de la compétition, le Palais des Sports accueillera la Grande Finale du CDT 7 en décembre 2026.",
    stats: { clubs: 8, boxeurs: 150, editionsAccueillies: 7 },
  },
];

export const getCommune = (slug: string) =>
  communes.find((c) => c.slug === slug);
