import Link from "@component/default/Blocks/Link/Link"
import { modals, pushModal } from "router"

export default {
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
  },
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
  errors: {
    1002: "This action requires premium access",
  },
}
