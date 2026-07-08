import type { NewsArticle } from "./types";

/**
 * Actualités du Choc des Titans et de l'AIB.
 * L'article sur l'étape 1 du CDT 7 reprend les résultats officiels ; les autres
 * articles sont des contenus rédactionnels de démonstration.
 */
export const news: NewsArticle[] = [
  {
    slug: "cdt7-etape1-bingerville-resultats",
    title: "CDT 7 — Bingerville s'embrase pour l'ouverture : deux K.O et un champion toujours invincible",
    excerpt:
      "Le Foyer des Jeunes de Bingerville a vibré pour le lancement de la 7e édition : Keita Mohamed étend sa série d'invincibilité, Traoré Adama et Sylla Ismael frappent par K.O.",
    date: "2026-05-31",
    category: "Résultats",
    cover: "/images/cdt7/bingerville/lourd/lourd-10.jpg",
    body: [
      "Sous le parrainage de l'Honorable Doumbia Issouf, Député-Maire de Bingerville, la première étape de la 7e édition du Choc des Titans a tenu toutes ses promesses samedi soir au Foyer des Jeunes.",
      "Chez les Welters, le champion en titre Keita Mohamed (Abobo) a dominé Diarrassouba Mamery (Yopougon) au terme d'un duel tactique somptueux. Triple champion, il détient désormais la plus longue série d'invincibilité depuis la création de la compétition.",
      "Le choc des Poids Moyens a vu Zio Jocelyn (Abobo) confirmer son emprise sur Zah Bi Vanié (Koumassi), battu pour la deuxième fois en autant de confrontations.",
      "Dans le combat féminin des Poids Plume, Gouaho Parfaite (Koumassi) a pris le meilleur sur son éternelle rivale Lopoua Naomie (Yopougon), relançant une rivalité désormais à 2 victoires contre 1.",
      "Les deux dernières affiches ont soulevé le public : Traoré Adama (Bouaké) a terrassé par K.O le champion en titre des Mi-Lourds Ouattara Yaya (Abobo), avant que Sylla Ismael (Koumassi), champion 2024 de retour sur le circuit, n'envoie au tapis le champion des Lourds Fofana Mahamadou (Abobo).",
      "Étaient également présents le Directeur Général de l'ONS, M. Gbané Ousmane, et le Député de Bouaké, l'Honorable Bema Fofana. Prochain rendez-vous : Yopougon, le 25 juillet 2026.",
    ],
  },
  {
    slug: "cdt7-etape2-yopougon-annonce",
    title: "Étape 2 : Yopougon attend ses Titans le 25 juillet",
    excerpt:
      "Le circuit met le cap sur la plus grande commune du pays. Billetterie et pass directs bientôt disponibles.",
    date: "2026-06-20",
    category: "Annonce",
    cover: "/images/cdt6/yopougon/yopougon-05.jpg",
    body: [
      "Après une ouverture réussie à Bingerville, le Choc des Titans pose ses gants à Yopougon le samedi 25 juillet 2026 au Complexe Sportif.",
      "Le public le plus chaud du circuit attend notamment la revanche annoncée entre Lopoua Naomie, reine de Yopougon, et Gouaho Parfaite chez les Poids Plume, ainsi que le retour du Lion de Yop, Diarrassouba Mamery.",
      "Les pass pour le direct seront disponibles sur la plateforme officielle : Pass Soirée à 2 000 FCFA, Pass Édition à 7 500 FCFA. Paiement Orange Money, MTN MoMo, Moov Money, Wave et carte bancaire.",
      "La carte des combats sera dévoilée dans les prochains jours. Restez connectés.",
    ],
  },
  {
    slug: "aib-programme-jeunes-talents",
    title: "L'AIB lance son programme « Jeunes Talents » dans 10 communes",
    excerpt:
      "Détection, encadrement, équipement : l'Association Ivoirienne de Boxe investit dans la relève avec un programme national inédit.",
    date: "2026-06-10",
    category: "AIB",
    cover: "/images/misc/depistage/depistage-05.jpg",
    body: [
      "Sous l'impulsion de son président Jhimmy Traoré, l'Association Ivoirienne de Boxe déploie un programme de détection et de formation destiné aux 12-18 ans dans dix communes du pays.",
      "Chaque commune bénéficiera de séances de détection encadrées par des entraîneurs certifiés, d'un kit d'équipement pour les clubs affiliés et d'un suivi médical en partenariat avec les campagnes de dépistage organisées en marge des étapes du Choc des Titans.",
      "« La boxe est une école de vie. Notre mission est d'ouvrir ses portes au plus grand nombre », a déclaré le président de l'AIB.",
      "Les clubs souhaitant rejoindre le programme peuvent déposer leur candidature via l'espace « Rejoindre l'AIB » de la plateforme.",
    ],
  },
  {
    slug: "interview-sylla-ismael-retour",
    title: "Sylla Ismael : « Je suis revenu pour reprendre ce qui m'appartient »",
    excerpt:
      "Le champion 2024 des Poids Lourds, vainqueur par K.O à Bingerville, se confie sur son retour fracassant.",
    date: "2026-06-05",
    category: "Interview",
    cover: "/images/cdt7/bingerville/lourd/lourd-15.jpg",
    body: [
      "Absent de la 6e édition, le colosse de Koumassi a fait taire les doutes en 2026 : un K.O net face au champion en titre Fofana Mahamadou, dès l'étape d'ouverture.",
      "« Une année loin du ring, c'est long. J'ai regardé la 6e édition depuis les gradins, ça m'a brûlé de l'intérieur. Je suis revenu pour reprendre ce qui m'appartient », confie le Titan.",
      "Sur sa rivalité avec Fofana : « Il m'avait battu ailleurs, sur d'autres circuits. Mais le Choc des Titans, c'est ma maison. Ici, c'est moi le patron des Lourds. La trilogie ? Quand il veut. »",
      "Le champion 2024 vise désormais la Grande Finale de décembre au Palais des Sports de Treichville.",
    ],
  },
  {
    slug: "partenariat-automobile-cdt7",
    title: "GWM, KIA et BAW : le CDT 7 roule avec les grands de l'automobile",
    excerpt:
      "Trois constructeurs majeurs rejoignent le circuit aux côtés de Rimco Motors pour la 7e édition.",
    date: "2026-05-15",
    category: "Partenariat",
    cover: "/images/cdt7/bingerville/panorama/pano-01.jpg",
    body: [
      "La 7e édition du Choc des Titans franchit un cap avec l'arrivée de partenaires automobiles de premier plan : GWM, KIA et BAW, aux côtés du concessionnaire Rimco Motors.",
      "Ces partenariats, visibles sur l'ensemble des supports officiels et du tapis rouge des étapes, témoignent de l'attractivité grandissante de la compétition auprès des grandes marques présentes en Côte d'Ivoire.",
      "« Des marques mondiales qui s'associent à un spectacle 100% ivoirien : c'est la preuve que notre vision porte », se félicite l'organisation.",
    ],
  },
  {
    slug: "depistage-sante-bilan",
    title: "Santé : plus de 1 200 personnes dépistées gratuitement en marge du circuit",
    excerpt:
      "Le volet social du Choc des Titans s'amplifie : bilan des campagnes de dépistage menées avec les centres de santé communaux.",
    date: "2026-04-28",
    category: "AIB",
    cover: "/images/misc/depistage/depistage-10.jpg",
    body: [
      "Depuis la 2e édition, chaque étape du Choc des Titans s'accompagne d'une campagne de dépistage gratuit ouverte au public : tension artérielle, glycémie, VIH et hépatites.",
      "Plus de 1 200 personnes ont bénéficié de ces consultations lors du dernier circuit, grâce à la mobilisation des centres de santé communaux et des équipes médicales bénévoles de l'AIB.",
      "« Le sport rassemble, et ce rassemblement doit servir la santé de nos populations », rappelle l'Association Ivoirienne de Boxe, qui étendra le dispositif à toutes les étapes du CDT 7.",
    ],
  },
];

export const getArticle = (slug: string) => news.find((n) => n.slug === slug);
