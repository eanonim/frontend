import Link from "@component/default/Blocks/Link/Link"
import { modals, pushModal } from "router"

export default {
  not_supported: {
    subtitle:
      "Only available on mobile devices and through the official Telegram app.",
  },
  language: "Language",
  rating: "Rating",
  tasks: "Tasks",
  chat_deleted: {
    subtitle: "You can no longer send messages to this chat.",
  },
  task: {
    title: "Daily Dose of Coins!",
    subtitle:
      "Complete simple tasks from our partners every day and get coins! New tasks appear every day, so come back often!",
  },
  languages: {
    ru: "Russian",
    en: "English",
    fr: "French",
    ar: "Arabic",
    pt: "Portuguese",
    de: "German",
    es: "Spanish",
  },
  dialogs_stub: {
    title: "Chat history",
    subtitle:
      "To make them appear, save the conversations you are interested in.",
  },
  premium: "Premium",
  premium_subtitle:
    "More freedom and dozens of exclusive features with a subscription.",
  search_for_an_interlocutor: "Search for an interlocutor",
  change_interests: "Change interests",
  chats: "Chats",
  search: "Search",
  cancel_search: "Cancel search",
  settings: "Settings",
  change_name: "Change name",
  change_emoji_status: "Change emoji-status",
  change_photo: "Change photo",
  color_scheme: "Color scheme",
  conversation_background: "Conversation background",
  text_size: "Text size",
  cooperation: "Cooperation",
  privacy_policy: "Privacy Policy",
  help: "Help",
  apply: "Apply",
  cancel: "Cancel",
  accept: "Accept",
  reject: "Reject",
  apply_in_all_chats: "Apply in all chats",
  font_size: {
    templates: {
      1: "Does he want me to turn to the right? Or to the left?",
      2: "Head to the right and expressively.",
      3: "Is that all? I think he said a lot more.",
    },
  },
  today: "Today",
  yesterday: "Yesterday",
  theme: {
    system: "System",
    dark: "Dark",
    light: "Light",
  },
  themeColor: {
    standard: "Standard",
    pink: "Pink",
    mint: "Mint",
    earthen: "Earthen",
  },
  leave: {
    title: "Leave chat",
    subtitle:
      "Are you sure you want to leave the chat? All correspondence will be deleted without the possibility of recovery.",
  },
  yes: "Yes",
  no: "No",
  coin: "Coin",
  your_coin_balance: "Your coin balance",
  man: "Man",
  woman: "Woman",
  any: "Any",
  interests: "Interests",
  you: "You",
  companion: "Companion",
  searchInterests: {
    music: "Music",
    travel: "Travel",
    sport: "Sport",
    art: "Art",
    cooking: "Cooking",
    movies: "Movies",
    games: "Games",
    reading: "Reading",
    tech: "Tech",
    animals: "Animals",
    nature: "Nature",
    photography: "Photography",
    dance: "Dance",
    space: "Space",
    science: "Science",
    history: "History",
    fashion: "Fashion",
    yoga: "Yoga",
    psychology: "Psychology",
    volunteering: "Volunteering",
    flirt: "Flirt",
    crypto: "Crypto",
    anime: "Anime",
    lgbt: "LGBT",
  },
  deleted: "Deleted",
  attach_type: {
    invite: "Request to save the correspondence",
    photo: "Photo",
    unknown: "Unknown",
  },
  system: {
    invite: {
      sender: "You have sent a request to save the correspondence",
      title: (first_name: string) =>
        `${first_name} wants to save correspondence with you`,
      subtitle:
        "If you agree, it will be easier for you to find and continue communication in the future.",
    },
  },
  in_response: "In response",
  editing: "Editing",
  reconnect: "Reconnect",
  XTR: "Telegram Stars",
  TON: "TON",
  COIN: "Coin",
  set_color: "Set color",
  pay: "Pay",
  active_until: (time: string) => `Active until: ${time}`,
  per_year: "per year",
  month: "month",
  by_subscription_only: () => (
    <>
      By{" "}
      <Link onClick={() => pushModal({ modalId: modals.MODAL_PREMIUM })}>
        subscription
      </Link>{" "}
      only
    </>
  ),
  prints: "prints",
  answer: "Answer",
  copy: "Copy",
  edit: "Edit",
  delete: "Delete",
  complains: {
    1: "Don't like it.",
    2: "Child abuse.",
    3: "Violence",
    4: "Illegal merchandise",
    5: "Pornographic materials",
    6: "Personal Data",
    7: "Terrorism",
    8: "Fraud or Spam",
    9: "Infringement or Spam",
    10: "Other",
    11: "Does not violate the law, but should be removed.",
  },
  complain: "Complain",
  benefits_of_subscription: "Benefits of Subscription",
  premiums: {
    1: {
      icon_type: "IconFilterUp",
      title: "Advanced filters",
      subtitle: "More opportunities to find the perfect conversation partner.",
    },
    2: {
      icon_type: "IconMessage2Search",
      title: "Chat History",
      subtitle: "Don't miss the chat thread: full access to chat history.",
    },
    3: {
      icon_type: "IconCoins",
      title: "More coins",
      subtitle: "Earn more coins for socializing and completing tasks.",
    },
    4: {
      icon_type: "IconPhotoFilled",
      title: "Sending photos",
      subtitle: "Share your moments: send photos to your interlocutors.",
    },
    5: {
      icon_type: "IconBrush",
      title: "Exclusive topics",
      subtitle: "Personalize your chat: choose exclusive design themes.",
    },
  },
  message: "Message",
  premium_times: {
    12: "Год",
    6: "Полгода",
    3: "Три месяца",
    1: "Месяц",
  },
  task_completed: "Task completed",
  task_type: {
    referral: {
      complete: "Invite Friend",
      check: "Check task",
    },
    promo: {
      complete: "Activate Promo",
      check: "Check task",
    },
    app: {
      complete: "Open App",
      check: "Check task",
    },
    integration: {
      complete: "Open App",
      check: "Check task",
    },
    link: {
      complete: "Subscribe",
      check: "Check subscription",
    },
    sub: {
      complete: "Subscribe",
      check: "Check subscription",
    },
    default: {
      complete: "Complete the task",
      check: "Check Task",
    },
    wallet: {
      complete: "Connect wallet",
      check: "Check Task",
    },
    wallet_okx: {
      complete: "Connect OKX Wallet",
      check: "Check Task",
    },
    boost: {
      complete: "Boost Channel",
      check: "Check Boost",
    },
    transaction: {
      complete: "Complete the task",
      check: "Check Task",
    },
    reward: {
      complete: "Complete the task",
      check: "Check Task",
    },
    ads: {
      complete: "Complete the task",
      check: "Check Task",
    },
  },
  referral: {
    title: "Referral",
    subtitle: "Share your magic link and turn your friends into bonuses!",
  },
  errors: {
    1000: "Unknown error",
    1001: "Request rejected due to timeout",
    1002: "This action requires premium access",
    1003: "Product is not found",
    1004: "Not enough coins",
    1005: "This cannot be done at this time. Try again later",
    1006: "Order has been rejected",
    1007: "Order is not defined",
    1008: "Order is already closed",
    1009: "You or your contact have too many saved conversations",
  },
}
