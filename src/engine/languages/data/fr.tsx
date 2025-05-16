import Link from "@component/default/Blocks/Link/Link"
import { modals, pushModal } from "router"

export default {
  not_supported: {
    subtitle:
      "Disponible uniquement sur les appareils mobiles et via l'application officielle Telegram.",
  },
  language: "Langue",
  rating: "Évaluation",
  tasks: "Tâches",
  chat_deleted: {
    subtitle: "Vous ne pouvez plus envoyer de messages à ce chat.",
  },
  task: {
    title: "Dose quotidienne de pièces!",
    subtitle:
      "Complétez des tâches simples de nos partenaires chaque jour et obtenez des pièces ! De nouvelles tâches apparaissent chaque jour, alors revenez souvent!",
  },
  languages: {
    ru: "Russe",
    en: "Anglais",
    fr: "Français",
    ar: "Arabe",
    pt: "Portugais",
    de: "Allemand",
    es: "Espagnol",
  },
  dialogs_stub: {
    title: "Historique du chat",
    subtitle:
      "Pour les faire apparaître, enregistrez les conversations qui vous intéressent.",
  },
  premium: "Premium",
  premium_subtitle:
    "Plus de liberté et des dizaines de fonctionnalités exclusives avec un abonnement.",
  search_for_an_interlocutor: "Recherche d'un interlocuteur",
  change_interests: "Modifier les intérêts",
  change_language: "Changer de langue",
  chats: "Chats",
  search: "Recherche",
  cancel_search: "Annuler la recherche",
  settings: "Paramètres",
  change_name: "Changer le nom",
  change_emoji_status: "Changer le statut emoji",
  change_photo: "Changer la photo",
  color_scheme: "Schéma de couleurs",
  conversation_background: "Arrière-plan de la conversation",
  text_size: "Taille du texte",
  cooperation: "Coopération",
  privacy_policy: "Politique de confidentialité",
  help: "Aide",
  apply: "Appliquer",
  cancel: "Annuler",
  accept: "Accepter",
  reject: "Rejeter",
  apply_in_all_chats: "Appliquer à tous les chats",
  font_size: {
    templates: {
      1: "Veut-il que je tourne à droite ? Ou à gauche ?",
      2: "Tourne à droite et de manière expressive.",
      3: "C'est tout ? Je pense qu'il a dit beaucoup plus.",
    },
  },
  today: "Aujourd'hui",
  yesterday: "Hier",
  theme: {
    system: "Système",
    dark: "Sombre",
    light: "Clair",
  },
  themeColor: {
    standard: "Standard",
    pink: "Rose",
    mint: "Menthe",
    earthen: "Terreux",
  },
  leave: {
    title: "Quitter le chat",
    subtitle:
      "Êtes-vous sûr de vouloir quitter le chat ? Toute la correspondance sera supprimée sans possibilité de récupération.",
  },
  yes: "Oui",
  no: "Non",
  coin: "Pièce",
  your_coin_balance: "Votre solde de pièces",
  man: "Homme",
  woman: "Femme",
  any: "N'importe quel",
  interests: "Intérêts",
  you: "Vous",
  companion: "Compagnon",
  searchTitle: "Recherche d'un partenaire de conversation…",
  searchSubtitle:
    "Chaque seconde, quelqu'un commence un dialogue dans ANChat. Soyez le prochain !",
  searchInterests: {
    music: "Musique",
    travel: "Voyage",
    sport: "Sport",
    art: "Art",
    cooking: "Cuisine",
    movies: "Films",
    games: "Jeux",
    reading: "Lecture",
    tech: "Technologie",
    animals: "Animaux",
    nature: "Nature",
    photography: "Photographie",
    dance: "Danse",
    space: "Espace",
    science: "Science",
    history: "Histoire",
    fashion: "Mode",
    yoga: "Yoga",
    psychology: "Psychologie",
    volunteering: "Bénévolat",
    flirt: "Flirter",
    crypto: "Crypto",
    anime: "Anime",
    lgbt: "LGBT",
  },
  deleted: "Supprimé",
  attach_type: {
    invite: "Demande de sauvegarde de la correspondance",
    photo: "Photo",
    unknown: "Inconnu",
  },
  system: {
    invite: {
      sender: "Vous avez envoyé une demande pour sauvegarder la correspondance",
      title: (first_name: string) =>
        `${first_name} veut sauvegarder la correspondance avec vous`,
      subtitle:
        "Si vous acceptez, il vous sera plus facile de trouver et de continuer la communication à l'avenir.",
    },
  },
  in_response: "En réponse",
  editing: "Modification",
  reconnect: "Reconnecter",
  XTR: "Étoiles de Telegram",
  TON: "TON",
  COIN: "Pièce",
  set_color: "Définir la couleur",
  pay: "Payer",
  active_until: (time: string) => `Actif jusqu'à : ${time}`,
  per_year: "par an",
  month: "mois",
  by_subscription_only: () => (
    <>
      Par{" "}
      <Link onClick={() => pushModal({ modalId: modals.MODAL_PREMIUM })}>
        abonnement
      </Link>{" "}
      seulement
    </>
  ),
  prints: "écrit",
  answer: "Répondre",
  copy: "Copier",
  edit: "Modifier",
  delete: "Supprimer",
  complains: {
    1: "Ne l'aime pas.",
    2: "Abus d'enfants.",
    3: "Violence",
    4: "Marchandise illégale",
    5: "Matériaux pornographiques",
    6: "Données personnelles",
    7: "Terrorisme",
    8: "Fraude ou Spam",
    9: "Violation ou Spam",
    10: "Autre",
    11: "Ne viole pas la loi, mais doit être supprimé.",
  },
  complain: "Se plaindre",
  benefits_of_subscription: "Avantages de l'Abonnement",
  premiums: {
    1: {
      icon_type: "IconFilterUp",
      title: "Filtres avancés",
      subtitle:
        "Plus d'opportunités pour trouver le partenaire de conversation parfait.",
    },
    2: {
      icon_type: "IconMessage2Search",
      title: "Historique du chat",
      subtitle:
        "Ne manquez pas le fil de discussion : accès complet à l'historique des discussions.",
    },
    3: {
      icon_type: "IconCoins",
      title: "Plus de pièces",
      subtitle: "Gagnez plus de pièces pour discuter et accomplir des tâches.",
    },
    4: {
      icon_type: "IconPhotoFilled",
      title: "Envoi de photos",
      subtitle:
        "Partagez vos moments : envoyez des photos à vos interlocuteurs.",
    },
    5: {
      icon_type: "IconBrush",
      title: "Thèmes exclusifs",
      subtitle:
        "Personnalisez votre chat : choisissez des thèmes de design exclusifs.",
    },
  },
  message: "Message",
  premium_times: {
    12: "An",
    6: "Six mois",
    3: "Trois mois",
    1: "Mois",
  },
  unavailable: (time: string) => `Indisponible jusqu'à ${time}`,
  purchased: "Acheté",
  task_completed: "Tâche accomplie",
  task_type: {
    referral: {
      complete: "Inviter un ami",
      check: "Vérifier la tâche",
    },
    promo: {
      complete: "Activer Promo",
      check: "Vérifier la tâche",
    },
    app: {
      complete: "Ouvrir l'application",
      check: "Vérifier la tâche",
    },
    integration: {
      complete: "Ouvrir l'application",
      check: "Vérifier la tâche",
    },
    link: {
      complete: "S'abonner",
      check: "Vérifier l'abonnement",
    },
    sub: {
      complete: "S'abonner",
      check: "Vérifier l'abonnement",
    },
    default: {
      complete: "Accomplir la tâche",
      check: "Vérifier la tâche",
    },
    wallet: {
      complete: "Connecter le portefeuille",
      check: "Vérifier la tâche",
    },
    wallet_okx: {
      complete: "Connecter le portefeuille OKX",
      check: "Vérifier la tâche",
    },
    boost: {
      complete: "Booster le Canal",
      check: "Vérifier le boost",
    },
    transaction: {
      complete: "Accomplir la tâche",
      check: "Vérifier la tâche",
    },
    reward: {
      complete: "Accomplir la tâche",
      check: "Vérifier la tâche",
    },
    ads: {
      complete: "Accomplir la tâche",
      check: "Vérifier la tâche",
    },
  },
  referral: {
    title: "Référent",
    subtitle: "Partagez votre lien magique et transformez vos amis en bonus!",
  },
  invite_friend: "Inviter un ami",
  name: "Nom",
  errors: {
    9901: "Tâche non complétée.",
    1000: "Erreur inconnue",
    1001: "Requête rejetée en raison du délai d'attente",
    1002: "Cette action nécessite un accès premium",
    1003: "Produit introuvable",
    1004: "Pas assez de pièces",
    1005: "Cela ne peut être fait pour le moment. Réessayez plus tard.",
    1006: "Commande rejetée",
    1007: "Commande non définie",
    1008: "La commande est déjà clôturée",
    1009: "Vous ou votre contact avez trop de conversations enregistrées",
  },
}
