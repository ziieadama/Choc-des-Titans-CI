/**
 * Internationalisation FR/EN.
 * - Le français est la langue de référence.
 * - Les contenus éditoriaux (biographies, articles, récits d'éditions)
 *   restent en français dans cette version test ; l'interface, les
 *   sections et les libellés sont entièrement traduits.
 */

export type Locale = "fr" | "en";
export const LOCALE_COOKIE = "cdt_lang";

const fr = {
  // Navigation
  "nav.home": "Accueil",
  "nav.events": "Événements",
  "nav.fighters": "Combattants",
  "nav.gallery": "Galerie",
  "nav.news": "Actualités",
  "nav.aib": "AIB",
  "nav.partners": "Partenaires",
  "nav.videos": "Vidéos",
  "nav.live": "Le direct",
  "nav.watchLive": "Regarder le direct",
  "nav.openMenu": "Ouvrir le menu",
  "nav.closeMenu": "Fermer le menu",
  "nav.theme.light": "Passer en mode clair",
  "nav.theme.dark": "Passer en mode sombre",

  // Commun
  "common.champion": "Champion",
  "common.winner": "Vainqueur",
  "common.purse": "Prime du vainqueur",
  "common.redCorner": "Coin Rouge",
  "common.blueCorner": "Coin Bleu",
  "common.seeAll": "Tout voir",
  "common.readMore": "Lire",
  "common.back": "Retour",
  "common.days": "Jours",
  "common.hours": "Heures",
  "common.min": "Min",
  "common.sec": "Sec",
  "common.itsNow": "C'est maintenant",
  "common.photos": "photos",
  "common.close": "Fermer",
  "common.live": "En direct",
  "common.female": "Féminin",
  "common.male": "Masculin",
  "common.edition": "Édition",
  "common.demo": "Site de démonstration — contenus en cours de validation officielle.",

  // Accueil
  "home.badge": "7ᵉ édition · Saison 2026 en cours",
  "home.title1": "Le choc des",
  "home.title2": "Titans",
  "home.subtitle":
    "La grande arène ivoirienne de la boxe et du MMA. Des communes aux projecteurs, les meilleurs combattants du pays s'affrontent pour entrer dans la légende.",
  "home.cta.edition": "L'édition 2026",
  "home.nextStage": "Prochaine étape",
  "home.stats.editions": "Éditions",
  "home.stats.communes": "Communes traversées",
  "home.stats.fights": "Combats de gala",
  "home.stats.partners": "Partenaires engagés",
  "home.next.kicker": "À ne pas manquer",
  "home.next.title": "Le prochain rendez-vous",
  "home.next.desc": "Le circuit continue. Réservez votre soirée : les Titans arrivent.",
  "home.next.buyPass": "Acheter le pass",
  "home.next.program": "Le programme",
  "home.results.title": "Le choc de la soirée",
  "home.results.desc":
    "Retour du champion 2024 : Sylla Ismael terrasse le champion en titre par K.O. Revivez l'affiche qui a enflammé Bingerville.",
  "home.results.allResults": "Tous les résultats de l'étape",
  "home.results.seeEdition": "Voir l'édition complète",
  "home.results.mainFight": "Combat principal · Poids Lourd",
  "home.roster.kicker": "Le roster",
  "home.roster.title": "Les Titans",
  "home.roster.desc":
    "Champions en titre et prétendants : les visages qui font vibrer les rings de Côte d'Ivoire.",
  "home.roster.all": "Tout le roster",
  "home.exp.kicker": "Plus qu'une compétition",
  "home.exp.title": "Une fête populaire, une école de vie",
  "home.exp.desc":
    "Étape après étape, le Choc des Titans transforme les places des communes en arènes de légende. Autour du ring : des milliers de supporters, des campagnes de dépistage gratuit, des animations et la fierté de toute une jeunesse.",
  "home.exp.f1.title": "Le public le plus chaud d'Afrique de l'Ouest",
  "home.exp.f1.text":
    "Des gradins combles d'Abobo à Bouaké, une ferveur unique autour des combattants locaux.",
  "home.exp.f2.title": "Un impact social concret",
  "home.exp.f2.text":
    "Dépistages santé gratuits, détection de jeunes talents et valeurs du sport transmises à la jeunesse.",
  "home.exp.f3.title": "Un tremplin vers l'élite",
  "home.exp.f3.text":
    "Le circuit révèle les futurs champions ivoiriens de la boxe et du MMA, encadrés par l'AIB.",
  "home.aib.kicker": "Association Ivoirienne de Boxe",
  "home.aib.title": "L'institution derrière les Titans",
  "home.aib.desc":
    "Présidée par Jhimmy Traoré, l'AIB fédère les clubs de boxe du pays, forme les champions de demain et porte les valeurs du noble art auprès de la jeunesse ivoirienne.",
  "home.aib.discover": "Découvrir l'AIB",
  "home.aib.join": "Rejoindre l'AIB",
  "home.news.kicker": "La gazette du ring",
  "home.news.title": "Actualités",
  "home.news.all": "Toutes les actus",
  "home.partners.kicker": "Ils font le choc",
  "home.partners.title": "Nos partenaires",
  "home.partners.desc":
    "Institutions, grandes marques et collectivités portent le Choc des Titans. Cliquez sur un logo pour découvrir l'engagement du partenaire.",
  "home.partners.all": "Tous les partenaires",
  "home.cta.title1": "Ne regardez pas l'histoire.",
  "home.cta.title2": "Vivez-la.",
  "home.cta.desc":
    "Chaque étape en direct, où que vous soyez. Prenez votre pass et vibrez avec les Titans.",
  "home.cta.button": "Accéder aux directs",

  // Vidéos
  "videos.kicker": "La chaîne du choc",
  "videos.title": "Vidéos officielles",
  "videos.desc":
    "Résumés de combats, face-à-face, coulisses : les dernières vidéos publiées sur la chaîne YouTube officielle du Choc des Titans, synchronisées automatiquement.",
  "videos.home.title": "Dernières vidéos",
  "videos.home.all": "Toutes les vidéos",
  "videos.channel": "Voir la chaîne YouTube",
  "videos.empty":
    "Les vidéos de la chaîne officielle apparaîtront ici dès leur publication sur YouTube.",

  // Direct / PPV
  "live.upcoming": "Prochain direct",
  "live.reserved": "Contenu réservé",
  "live.reservedDesc":
    "Choisissez votre pass pour accéder aux directs du Choc des Titans, en HD, sur tous vos écrans.",
  "live.unlock": "Débloquer l'accès",
  "live.passActive": "Votre pass est actif",
  "live.startsSoon": "Le direct démarre bientôt",
  "live.secure":
    "Paiement sécurisé · Accès instantané · Version test : aucun débit réel n'est effectué",
  "live.offers.kicker": "Pay-per-view",
  "live.offers.title": "Choisissez votre pass",
  "live.offers.desc":
    "Trois formules pour vivre le choc, du gala d'un soir à l'édition complète. Paiement mobile money ou carte bancaire.",
  "live.buyPass": "Acheter ce pass",
  "live.mostChosen": "Le plus choisi",
  "live.payVia": "Paiement via",
  "live.continue": "Continuer vers le paiement",
  "live.payment": "Paiement",
  "live.payMethod": "Moyen de paiement",
  "live.phoneNumber": "Numéro",
  "live.phoneHint": "Vous recevrez une demande de validation sur votre téléphone.",
  "live.cardDemo": "Paiement par carte simulé pour la version test.",
  "live.pay": "Payer",
  "live.encrypted": "Transaction chiffrée — démo sans débit réel",
  "live.processing": "Validation en cours",
  "live.processingCard": "Traitement du paiement sécurisé…",
  "live.processingMobile": "Confirmez la transaction sur votre téléphone…",
  "live.success": "Pass activé !",
  "live.successDesc": "Votre pass est actif sur cet appareil. Bon combat, Titan !",
  "live.goLive": "Accéder au direct",
  "live.phoneError": "Entrez un numéro de téléphone valide (au moins 8 chiffres).",
  "live.payError": "Le paiement a échoué. Réessayez.",

  // Partenaires
  "partners.title": "Nos partenaires",
  "partners.kicker": "Ils font le choc",
  "partners.desc":
    "Une trentaine d'institutions, de marques et de collectivités s'engagent aux côtés du Choc des Titans et de l'AIB. Cliquez sur un partenaire pour découvrir son représentant, son mot de soutien et son lien avec l'événement.",
  "partners.all": "Tous",
  "partners.titanPartner": "Partenaire Titan",
  "partners.goldPartner": "Partenaire Or",
  "partners.officialPartner": "Partenaire Officiel",
  "partners.since": "Partenaire du Choc des Titans depuis",
  "partners.become.title": "Devenez partenaire du choc",
  "partners.become.desc":
    "Associez votre marque au plus grand rendez-vous des sports de combat de Côte d'Ivoire : visibilité nationale, activation terrain dans les communes et impact social réel auprès de la jeunesse.",
  "partners.become.cta": "Nous contacter",
  "partners.cat.Institutionnel": "Institutionnel",
  "partners.cat.Automobile": "Automobile",
  "partners.cat.Média": "Média",
  "partners.cat.Télécom & Finance": "Télécom & Finance",
  "partners.cat.Équipement & Vie": "Équipement & Vie",
  "partners.cat.Collectivité": "Collectivité",

  // Combattants
  "fighters.kicker": "Le roster officiel",
  "fighters.title": "Les combattants",
  "fighters.desc":
    "Champions, challengers et révélations : découvrez les Titans qui font vibrer les rings du circuit.",
  "fighters.allFilter": "Tous",
  "fighter.back": "Tous les combattants",
  "fighter.wins": "Victoires",
  "fighter.losses": "Défaites",
  "fighter.draws": "Nuls",
  "fighter.portrait": "Le portrait",
  "fighter.titles": "Palmarès",
  "fighter.recentFights": "Derniers combats — CDT 7",
  "fighter.attributes": "Attributs de combat",
  "fighter.sameCategory": "Dans la même catégorie",
  "fighter.stats.puissance": "Puissance",
  "fighter.stats.vitesse": "Vitesse",
  "fighter.stats.technique": "Technique",
  "fighter.stats.endurance": "Endurance",

  // Événements
  "events.kicker": "La compétition",
  "events.title": "Événements & éditions",
  "events.desc":
    "Du premier gong en 2020 à la conquête 2026 : chaque édition écrit un chapitre de la légende des Titans.",
  "events.current": "Édition en cours",
  "events.follow": "Suivre l'édition",
  "events.past": "Les éditions précédentes",
  "events.stages": "étapes",
  "events.archived": "Édition archivée",
  "events.calendar": "Calendrier",
  "events.upcoming": "Les grandes dates à venir",
  "events.passLive": "Pass direct",
  "events.nextMeeting": "Prochain rendez-vous",
  "events.personalities": "Personnalités présentes",
  "events.photosOf": "Voir les photos de l'édition",
  "events.stagesOf": "Les étapes de l'édition",
  "events.route": "Le parcours",
  "events.followLive": "Suivre en direct",
  "events.resultsSoon": "Les résultats détaillés de cette étape seront bientôt disponibles.",

  // Galerie
  "gallery.kicker": "Les archives visuelles",
  "gallery.title": "La galerie",
  "gallery.desc":
    "Plus de 400 photos officielles : plongez dans chaque édition, commune par commune, du tapis rouge au dernier gong.",
  "gallery.explore": "Explorer l'album",
  "gallery.aroundRing": "Autour du ring",
  "gallery.communesOf": "commune",
  "gallery.all": "Toute la galerie",
  "gallery.commune": "Commune du circuit",
  "gallery.series": "série",
  "gallery.theCommune": "La commune",
  "gallery.cdtLink": "Son lien avec le Choc des Titans",
  "gallery.clubs": "Clubs affiliés",
  "gallery.boxers": "Boxeurs licenciés",
  "gallery.editions": "Éditions accueillies",
  "gallery.album": "Album",

  // AIB
  "aib.kicker": "L'institution du noble art ivoirien",
  "aib.title1": "Association",
  "aib.title2": "Ivoirienne de Boxe",
  "aib.stats.clubs": "Clubs affiliés",
  "aib.stats.licensed": "Licenciés",
  "aib.stats.regions": "Régions couvertes",
  "aib.stats.editions": "Éditions du CDT",
  "aib.mvv.kicker": "Ce qui nous anime",
  "aib.mvv.title": "Mission, vision, engagements",
  "aib.president.kicker": "Le mot du président",
  "aib.president.name": "Jhimmy Traoré",
  "aib.president.role":
    "Président de l'Association Ivoirienne de Boxe · Promoteur du Choc des Titans",
  "aib.actions.kicker": "Sur le terrain",
  "aib.actions.title": "Nos actions",
  "aib.press.kicker": "Presse & communication",
  "aib.press.title": "L'actualité de l'AIB",
  "aib.join.title": "Club, athlète, bénévole ou mécène ?",
  "aib.join.desc":
    "L'AIB grandit avec celles et ceux qui croient au noble art ivoirien. Rejoignez la grande famille de la boxe.",
  "aib.join.cta": "Déposer ma demande",
  "aib.pressNews": "Presse & actualités",

  // Actualités
  "news.kicker": "La gazette du ring",
  "news.title": "Actualités",
  "news.desc":
    "Résultats officiels, annonces d'événements, interviews des Titans et vie de l'AIB.",
  "news.allNews": "Toutes les actualités",
  "news.readAlso": "À lire aussi",

  // Footer
  "footer.brand":
    "La grande arène ivoirienne de la boxe et du MMA, organisée par JTS Group & Association Ivoirienne de Boxe (AIB). Sous l'égide du Ministère des Sports de Côte d'Ivoire.",
  "footer.navigation": "Navigation",
  "footer.competition": "Compétition",
  "footer.contact": "Contact",
  "footer.watchLive": "Regarder le direct",
  "footer.currentEdition": "Édition en cours — CDT 7",
  "footer.gallery": "Galerie photos",
  "footer.joinAib": "Rejoindre l'AIB",
  "footer.admin": "Espace administration",
  "footer.rights": "Tous droits réservés.",
} as const;

export type DictKey = keyof typeof fr;

const en: Record<DictKey, string> = {
  ...fr,
  // Navigation
  "nav.home": "Home",
  "nav.events": "Events",
  "nav.fighters": "Fighters",
  "nav.gallery": "Gallery",
  "nav.news": "News",
  "nav.aib": "AIB",
  "nav.partners": "Partners",
  "nav.videos": "Videos",
  "nav.live": "Live",
  "nav.watchLive": "Watch live",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",
  "nav.theme.light": "Switch to light mode",
  "nav.theme.dark": "Switch to dark mode",

  "common.champion": "Champion",
  "common.winner": "Winner",
  "common.purse": "Winner's purse",
  "common.redCorner": "Red Corner",
  "common.blueCorner": "Blue Corner",
  "common.seeAll": "See all",
  "common.readMore": "Read",
  "common.back": "Back",
  "common.days": "Days",
  "common.hours": "Hours",
  "common.min": "Min",
  "common.sec": "Sec",
  "common.itsNow": "It's happening now",
  "common.photos": "photos",
  "common.close": "Close",
  "common.live": "Live",
  "common.female": "Women",
  "common.male": "Men",
  "common.edition": "Edition",
  "common.demo": "Demo website — content pending official validation.",

  "home.badge": "7th edition · 2026 season underway",
  "home.title1": "Clash of the",
  "home.title2": "Titans",
  "home.subtitle":
    "Ivory Coast's grand boxing and MMA arena. From the communes to the spotlight, the country's best fighters battle their way into legend.",
  "home.cta.edition": "The 2026 edition",
  "home.nextStage": "Next stage",
  "home.stats.editions": "Editions",
  "home.stats.communes": "Communes visited",
  "home.stats.fights": "Gala fights",
  "home.stats.partners": "Committed partners",
  "home.next.kicker": "Don't miss it",
  "home.next.title": "The next showdown",
  "home.next.desc": "The circuit rolls on. Save your evening: the Titans are coming.",
  "home.next.buyPass": "Buy a pass",
  "home.next.program": "Fight card",
  "home.results.title": "Fight of the night",
  "home.results.desc":
    "The 2024 champion returns: Sylla Ismael knocks out the reigning champion. Relive the clash that set Bingerville on fire.",
  "home.results.allResults": "All results from the stage",
  "home.results.seeEdition": "See the full edition",
  "home.results.mainFight": "Main event · Heavyweight",
  "home.roster.kicker": "The roster",
  "home.roster.title": "The Titans",
  "home.roster.desc":
    "Reigning champions and contenders: the faces that electrify Ivorian rings.",
  "home.roster.all": "Full roster",
  "home.exp.kicker": "More than a competition",
  "home.exp.title": "A people's celebration, a school of life",
  "home.exp.desc":
    "Stage after stage, the Clash of the Titans turns commune squares into legendary arenas. Around the ring: thousands of fans, free health screenings, entertainment and the pride of a whole generation.",
  "home.exp.f1.title": "West Africa's loudest crowd",
  "home.exp.f1.text":
    "From packed stands in Abobo to Bouaké, a unique fervour around local fighters.",
  "home.exp.f2.title": "Real social impact",
  "home.exp.f2.text":
    "Free health screenings, young talent scouting and sporting values passed on to the youth.",
  "home.exp.f3.title": "A springboard to the elite",
  "home.exp.f3.text":
    "The circuit reveals Ivory Coast's future boxing and MMA champions, guided by the AIB.",
  "home.aib.kicker": "Ivorian Boxing Association",
  "home.aib.title": "The institution behind the Titans",
  "home.aib.desc":
    "Chaired by Jhimmy Traoré, the AIB unites the country's boxing clubs, trains tomorrow's champions and champions the values of the noble art among Ivorian youth.",
  "home.aib.discover": "Discover the AIB",
  "home.aib.join": "Join the AIB",
  "home.news.kicker": "Ringside gazette",
  "home.news.title": "News",
  "home.news.all": "All news",
  "home.partners.kicker": "They make the clash",
  "home.partners.title": "Our partners",
  "home.partners.desc":
    "Institutions, major brands and local governments power the Clash of the Titans. Click a logo to discover each partner's commitment.",
  "home.partners.all": "All partners",
  "home.cta.title1": "Don't just watch history.",
  "home.cta.title2": "Live it.",
  "home.cta.desc":
    "Every stage live, wherever you are. Grab your pass and roar with the Titans.",
  "home.cta.button": "Watch the streams",

  "videos.kicker": "The clash channel",
  "videos.title": "Official videos",
  "videos.desc":
    "Fight recaps, face-offs and behind the scenes: the latest videos from the official Clash of the Titans YouTube channel, synced automatically.",
  "videos.home.title": "Latest videos",
  "videos.home.all": "All videos",
  "videos.channel": "Visit the YouTube channel",
  "videos.empty":
    "Videos from the official channel will appear here as soon as they are published on YouTube.",

  "live.upcoming": "Next live event",
  "live.reserved": "Members only",
  "live.reservedDesc":
    "Choose your pass to watch Clash of the Titans live, in HD, on all your screens.",
  "live.unlock": "Unlock access",
  "live.passActive": "Your pass is active",
  "live.startsSoon": "The live stream starts soon",
  "live.secure":
    "Secure payment · Instant access · Test version: no real charge is made",
  "live.offers.kicker": "Pay-per-view",
  "live.offers.title": "Choose your pass",
  "live.offers.desc":
    "Three plans to live the clash, from a single fight night to the full edition. Mobile money or bank card.",
  "live.buyPass": "Buy this pass",
  "live.mostChosen": "Most popular",
  "live.payVia": "Pay with",
  "live.continue": "Continue to payment",
  "live.payment": "Payment",
  "live.payMethod": "Payment method",
  "live.phoneNumber": "Number",
  "live.phoneHint": "You will receive a validation request on your phone.",
  "live.cardDemo": "Card payment is simulated in this test version.",
  "live.pay": "Pay",
  "live.encrypted": "Encrypted transaction — demo, no real charge",
  "live.processing": "Processing",
  "live.processingCard": "Processing secure payment…",
  "live.processingMobile": "Confirm the transaction on your phone…",
  "live.success": "Pass activated!",
  "live.successDesc": "Your pass is active on this device. Enjoy the fights, Titan!",
  "live.goLive": "Go to the live stream",
  "live.phoneError": "Enter a valid phone number (at least 8 digits).",
  "live.payError": "Payment failed. Please try again.",

  "partners.title": "Our partners",
  "partners.kicker": "They make the clash",
  "partners.desc":
    "Around thirty institutions, brands and local governments stand with the Clash of the Titans and the AIB. Click a partner to see its representative, message of support and its link with the event.",
  "partners.all": "All",
  "partners.titanPartner": "Titan Partner",
  "partners.goldPartner": "Gold Partner",
  "partners.officialPartner": "Official Partner",
  "partners.since": "Partner of the Clash of the Titans since",
  "partners.become.title": "Become a partner",
  "partners.become.desc":
    "Link your brand to Ivory Coast's biggest combat-sports event: nationwide visibility, on-the-ground activation in the communes and real social impact for the youth.",
  "partners.become.cta": "Contact us",
  "partners.cat.Institutionnel": "Institutional",
  "partners.cat.Automobile": "Automotive",
  "partners.cat.Média": "Media",
  "partners.cat.Télécom & Finance": "Telecom & Finance",
  "partners.cat.Équipement & Vie": "Equipment & Lifestyle",
  "partners.cat.Collectivité": "Local government",

  "fighters.kicker": "The official roster",
  "fighters.title": "The fighters",
  "fighters.desc":
    "Champions, challengers and rising stars: meet the Titans who set the circuit's rings alight.",
  "fighters.allFilter": "All",
  "fighter.back": "All fighters",
  "fighter.wins": "Wins",
  "fighter.losses": "Losses",
  "fighter.draws": "Draws",
  "fighter.portrait": "Profile",
  "fighter.titles": "Titles",
  "fighter.recentFights": "Recent fights — CDT 7",
  "fighter.attributes": "Fight attributes",
  "fighter.sameCategory": "Same division",
  "fighter.stats.puissance": "Power",
  "fighter.stats.vitesse": "Speed",
  "fighter.stats.technique": "Technique",
  "fighter.stats.endurance": "Stamina",

  "events.kicker": "The competition",
  "events.title": "Events & editions",
  "events.desc":
    "From the first bell in 2020 to the 2026 conquest: every edition writes a chapter of the Titans' legend.",
  "events.current": "Current edition",
  "events.follow": "Follow the edition",
  "events.past": "Past editions",
  "events.stages": "stages",
  "events.archived": "Archived edition",
  "events.calendar": "Calendar",
  "events.upcoming": "Upcoming dates",
  "events.passLive": "Live pass",
  "events.nextMeeting": "Next showdown",
  "events.personalities": "Attending personalities",
  "events.photosOf": "See the edition's photos",
  "events.stagesOf": "The edition's stages",
  "events.route": "The route",
  "events.followLive": "Follow live",
  "events.resultsSoon": "Detailed results for this stage will be available soon.",

  "gallery.kicker": "The visual archives",
  "gallery.title": "The gallery",
  "gallery.desc":
    "Over 400 official photos: dive into every edition, commune by commune, from the red carpet to the final bell.",
  "gallery.explore": "Explore the album",
  "gallery.aroundRing": "Around the ring",
  "gallery.communesOf": "commune",
  "gallery.all": "Full gallery",
  "gallery.commune": "Circuit commune",
  "gallery.series": "series",
  "gallery.theCommune": "The commune",
  "gallery.cdtLink": "Its link with the Clash of the Titans",
  "gallery.clubs": "Affiliated clubs",
  "gallery.boxers": "Licensed boxers",
  "gallery.editions": "Editions hosted",
  "gallery.album": "Album",

  "aib.kicker": "The institution of the Ivorian noble art",
  "aib.title1": "Ivorian",
  "aib.title2": "Boxing Association",
  "aib.stats.clubs": "Affiliated clubs",
  "aib.stats.licensed": "Licensed members",
  "aib.stats.regions": "Regions covered",
  "aib.stats.editions": "CDT editions",
  "aib.mvv.kicker": "What drives us",
  "aib.mvv.title": "Mission, vision, commitments",
  "aib.president.kicker": "A word from the president",
  "aib.president.name": "Jhimmy Traoré",
  "aib.president.role":
    "President of the Ivorian Boxing Association · Promoter of the Clash of the Titans",
  "aib.actions.kicker": "In the field",
  "aib.actions.title": "Our actions",
  "aib.press.kicker": "Press & communication",
  "aib.press.title": "AIB news",
  "aib.join.title": "Club, athlete, volunteer or sponsor?",
  "aib.join.desc":
    "The AIB grows with those who believe in the Ivorian noble art. Join the great boxing family.",
  "aib.join.cta": "Submit my application",
  "aib.pressNews": "Press & news",

  "news.kicker": "Ringside gazette",
  "news.title": "News",
  "news.desc":
    "Official results, event announcements, Titan interviews and AIB life.",
  "news.allNews": "All news",
  "news.readAlso": "Also read",

  "footer.brand":
    "Ivory Coast's grand boxing and MMA arena, organised by JTS Group & the Ivorian Boxing Association (AIB). Under the aegis of the Ministry of Sports of Côte d'Ivoire.",
  "footer.navigation": "Navigation",
  "footer.competition": "Competition",
  "footer.contact": "Contact",
  "footer.watchLive": "Watch live",
  "footer.currentEdition": "Current edition — CDT 7",
  "footer.gallery": "Photo gallery",
  "footer.joinAib": "Join the AIB",
  "footer.admin": "Admin area",
  "footer.rights": "All rights reserved.",
};

const dicts: Record<Locale, Record<DictKey, string>> = { fr, en };

export function getDict(locale: Locale) {
  return dicts[locale] ?? dicts.fr;
}

export function makeT(locale: Locale) {
  const d = getDict(locale);
  return (key: DictKey) => d[key] ?? key;
}

export const dateLocale = (locale: Locale) => (locale === "en" ? "en-GB" : "fr-FR");
