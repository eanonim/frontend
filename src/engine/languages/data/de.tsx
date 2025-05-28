import Link from "@component/default/Blocks/Link/Link"
import { modals, pushModal } from "router"

export default {
  not_supported: {
    subtitle:
      "Nur auf mobilen Geräten und über die offizielle Telegram-App verfügbar.",
  },
  chat_onboard:
    "Wenn Ihr Gesprächspartner Spam, Werbung oder verbotene Inhalte verschickt - drücken Sie die Nachricht lange und wählen Sie «Melden». Anonymität ist garantiert.",
  language: "Sprache",
  rating: "Bewertung",
  tasks: "Aufgaben",
  chat_deleted: {
    subtitle: "Sie können keine Nachrichten mehr an diesen Chat senden.",
  },
  task: {
    title: "Tägliche Dosis Münzen!",
    subtitle:
      "Erledigen Sie jeden Tag einfache Aufgaben von unseren Partnern und erhalten Sie Münzen! Neue Aufgaben erscheinen täglich, also schauen Sie oft vorbei!",
  },
  languages: {
    ru: "Russisch",
    en: "Englisch",
    fr: "Französisch",
    ar: "Arabisch",
    pt: "Portugiesisch",
    de: "Deutsch",
    es: "Spanisch",
  },
  dialogs_stub: {
    title: "Chat-Verlauf",
    subtitle:
      "Um sie erscheinen zu lassen, speichern Sie die Gespräche, die Sie interessieren.",
  },
  banner: {
    title: "Hier beginnt anonyme Kommunikation",
    subtitle:
      "Passe Interessen an, wähle einen Gesprächspartner – und starte den Dialog!",
  },
  premium: "Premium",
  premium_subtitle:
    "Mehr Freiheit und Dutzende exklusiver Funktionen mit einem Abonnement.",
  search_for_an_interlocutor: "Nach Gesprächspartner suchen",
  change_interests: "Interessen ändern",
  change_language: "Sprache ändern",
  chats: "Chats",
  search: "Suche",
  cancel_search: "Suche abbrechen",
  settings: "Einstellungen",
  change_name: "Name ändern",
  change_emoji_status: "Emoji-Status ändern",
  change_photo: "Foto ändern",
  color_scheme: "Farbschema",
  conversation_background: "Unterhaltungshintergrund",
  text_size: "Textgröße",
  cooperation: "Zusammenarbeit",
  privacy_policy: "Datenschutzrichtlinie",
  help: "Hilfe",
  apply: "Anwenden",
  cancel: "Abbrechen",
  accept: "Akzeptieren",
  reject: "Ablehnen",
  apply_in_all_chats: "In allen Chats anwenden",
  font_size: {
    templates: {
      1: "Will er, dass ich nach rechts abbiege? Oder nach links?",
      2: "Kopf nach rechts und ausdrucksstark.",
      3: "Ist das alles? Ich denke, er hat viel mehr gesagt.",
    },
  },
  today: "Heute",
  yesterday: "Gestern",
  theme: {
    system: "System",
    dark: "Dunkel",
    light: "Hell",
  },
  themeColor: {
    standard: "Standard",
    pink: "Rosa",
    mint: "Minze",
    earthen: "Erdig",
  },
  leave: {
    title: "Chat verlassen",
    subtitle:
      "Sind Sie sicher, dass Sie den Chat verlassen möchten? Alle Korrespondenz wird ohne Möglichkeit der Wiederherstellung gelöscht.",
  },
  yes: "Ja",
  no: "Nein",
  coin: "Münze",
  your_coin_balance: "Ihr Münzguthaben",
  man: "Mann",
  woman: "Frau",
  any: "Beliebig",
  interests: "Interessen",
  you: "Sie",
  companion: "Begleiter",
  searchTitle: "Suche nach einem Gesprächspartner…",
  searchSubtitle:
    "Jede Sekunde beginnt jemand einen Dialog in ANChat. Sei der Nächste!",
  searchInterests: {
    music: "Musik",
    travel: "Reisen",
    sport: "Sport",
    art: "Kunst",
    cooking: "Kochen",
    movies: "Filme",
    games: "Spiele",
    reading: "Lesen",
    tech: "Technologie",
    animals: "Tiere",
    nature: "Natur",
    photography: "Fotografie",
    dance: "Tanzen",
    space: "Weltraum",
    science: "Wissenschaft",
    history: "Geschichte",
    fashion: "Mode",
    yoga: "Yoga",
    psychology: "Psychologie",
    volunteering: "Freiwilligenarbeit",
    flirt: "Flirten",
    crypto: "Krypto",
    anime: "Anime",
    lgbt: "LGBT",
  },
  deleted: "Gelöscht",
  attach_type: {
    invite: "Anfrage zum Speichern der Korrespondenz",
    photo: "Foto",
    unknown: "Unbekannt",
  },
  system: {
    invite: {
      sender: "Sie haben eine Anfrage zum Speichern der Korrespondenz gesendet",
      title: (first_name: string) =>
        `${first_name} möchte die Korrespondenz mit Ihnen speichern`,
      subtitle:
        "Wenn Sie zustimmen, wird es einfacher, in Zukunft Kommunikation zu finden und fortzusetzen.",
    },
  },
  in_response: "Als Antwort",
  editing: "Bearbeitung",
  reconnect: "Wiederverbinden",
  XTR: "Telegram Stars",
  TON: "TON",
  COIN: "Münze",
  set_color: "Farbe festlegen",
  pay: "Bezahlen",
  active_until: (time: string) => `Aktiv bis: ${time}`,
  per_year: "pro Jahr",
  month: "Monat",
  by_subscription_only: () => (
    <>
      Nur mit{" "}
      <Link onClick={() => pushModal({ modalId: modals.MODAL_PREMIUM })}>
        Abonnement
      </Link>{" "}
    </>
  ),
  prints: "schreibt",
  answer: "Antworten",
  copy: "Kopieren",
  edit: "Bearbeiten",
  delete: "Löschen",
  complains: {
    1: "Gefällt mir nicht.",
    2: "Kinder Missbrauch.",
    3: "Gewalt",
    4: "Illegale Waren",
    5: "Pornografische Materialien",
    6: "Persönliche Daten",
    7: "Terrorismus",
    8: "Betrug oder Spam",
    9: "Verletzung oder Spam",
    10: "Anderes",
    11: "Verstößt nicht gegen das Gesetz, sollte aber entfernt werden.",
  },
  complain: "Beschwerde",
  benefits_of_subscription: "Vorteile des Abonnements",
  premiums: {
    1: {
      icon_type: "IconFilterUp",
      title: "Erweiterte Filter",
      subtitle: "Mehr Möglichkeiten, den perfekten Gesprächspartner zu finden.",
    },
    2: {
      icon_type: "IconMessage2Search",
      title: "Chat-Verlauf",
      subtitle:
        "Verpassen Sie nicht den Chat-Thread: Vollständiger Zugriff auf die Chat-Historie.",
    },
    3: {
      icon_type: "IconCoins",
      title: "Mehr Münzen",
      subtitle:
        "Verdienen Sie mehr Münzen fürs Socializing und Aufgaben erledigen.",
    },
    4: {
      icon_type: "IconPhotoFilled",
      title: "Foto senden",
      subtitle:
        "Teilen Sie Ihre Momente: Senden Sie Fotos an Ihre Gesprächspartner.",
    },
    5: {
      icon_type: "IconBrush",
      title: "Exklusive Themen",
      subtitle:
        "Individualisieren Sie Ihren Chat: Wählen Sie exklusive Designs.",
    },
  },
  message: "Nachricht",
  premium_times: {
    12: "Jahr",
    6: "Halbes Jahr",
    3: "Drei Monate",
    1: "Monat",
  },
  unavailable: (time: string) => `Nicht verfügbar bis ${time}`,
  purchased: "Gekauft",
  task_completed: "Aufgabe abgeschlossen",
  task_type: {
    referral: {
      complete: "Freund einladen",
      check: "Aufgabe überprüfen",
    },
    promo: {
      complete: "Promo aktivieren",
      check: "Aufgabe überprüfen",
    },
    app: {
      complete: "App öffnen",
      check: "Aufgabe überprüfen",
    },
    integration: {
      complete: "App öffnen",
      check: "Aufgabe überprüfen",
    },
    link: {
      complete: "Abonnieren",
      check: "Abonnement überprüfen",
    },
    sub: {
      complete: "Abonnieren",
      check: "Abonnement überprüfen",
    },
    default: {
      complete: "Aufgabe abschließen",
      check: "Aufgabe überprüfen",
    },
    wallet: {
      complete: "Wallet verbinden",
      check: "Aufgabe überprüfen",
    },
    wallet_okx: {
      complete: "OKX Wallet verbinden",
      check: "Aufgabe überprüfen",
    },
    boost: {
      complete: "Kanal verstärken",
      check: "Verstärkung überprüfen",
    },
    transaction: {
      complete: "Aufgabe abschließen",
      check: "Aufgabe überprüfen",
    },
    reward: {
      complete: "Aufgabe abschließen",
      check: "Aufgabe überprüfen",
    },
    ads: {
      complete: "Aufgabe abschließen",
      check: "Aufgabe überprüfen",
    },
  },
  referral: {
    title: "Empfehlung",
    subtitle:
      "Teilen Sie Ihren magischen Link und verwandeln Sie Ihre Freunde in Boni!",
  },
  invite_friend: "Einen Freund einladen",
  name: "Name",
  errors: {
    9901: "Aufgabe nicht abgeschlossen.",
    1000: "Unbekannter Fehler",
    1001: "Anfrage wegen Zeitüberschreitung abgelehnt",
    1002: "Diese Aktion erfordert Premium-Zugang",
    1003: "Produkt nicht gefunden",
    1004: "Nicht genügend Münzen",
    1005: "Dies kann momentan nicht getan werden. Versuchen Sie es später erneut.",
    1006: "Bestellung wurde abgelehnt",
    1007: "Bestellung ist nicht definiert",
    1008: "Bestellung ist bereits geschlossen",
    1009: "Sie oder Ihr Kontakt haben zu viele gespeicherte Gespräche",
  },
}
