type RouterStruct = {
  viewId: string
  default: string
  panels: Record<string, string>
}[]

export enum views {
  STARTUP = "view_startup",
  ERROR = "view_error",
  PROFILE = "view_profile",
  SEARCH = "view_search",
  CHATS = "view_chats",
}

export enum panels {
  STARTUP = "panel_startup",
  DUPLICATED = "panel_duplicated",
  BAD = "panel_bad",

  PROFILE = "panel_profile",
  SETTINGS = "panel_settings",
  FONTSIZE = "panel_fontsize",
  BACKGROUNDS = "panel_backgrounds",
  BACKGROUND_EDIT = "panel_background_edit",
  THEME = "panel_theme",
  PREMIUM = "panel_premium",

  SEARCH = "panel_search",
  SEARCH_START = "panel_search_start",

  CHATS = "panel_chats",
  CHAT = "panel_chat",
}

export enum pages {
  STARTUP = "/",
  DUPLICATED = "/duplicated",

  PROFILE = "/profile",
  SETTINGS = "/profile/settings",
  FONTSIZE = "/settings/fontsize",
  BACKGROUNDS = "/settings/backgrounds",
  BACKGROUND_EDIT = "/settings/background",
  THEME = "/settings/theme",
  PREMIUM = "/settings/premium",

  SEARCH = "/search",
  SEARCH_START = "/search/start",

  CHATS = "/chats",
  CHAT = "/chat",
}

export enum modals {
  STORE_MONEY = "modal_store_money",
  INTERESTS_LIST = "modal_interests_list",
  MESSAGE_CONTROL = "modal_message_control",
  USER_EMOJI = "modal_user_emoji",
  USER_CHANGE_NAME = "modal_user_change_name",
  MESSAGE_COMPLAINT = "modal_complaint",
  MODAL_PREMIUM = "modal_premium",
}

export enum popouts {
  ERROR = "snackbar_error",
  NEW_MESSAGE = "snackbar_top_new_message",
}

export type routerParams = {
  [modals.INTERESTS_LIST]: undefined
  [modals.MESSAGE_CONTROL]: {
    dialog: string
    message_id: number
  }
  [modals.USER_EMOJI]: undefined
  [modals.USER_CHANGE_NAME]: undefined
  [modals.MESSAGE_COMPLAINT]: {
    dialog: string
    message_id: number
  }
  [modals.MODAL_PREMIUM]: undefined
}

// type GORouting = {
//   [key: string]:
//     | { pageId: pages; params?: undefined; modalId?: undefined }
//     | { modalId: modals; params: Record<string, number>; pageId?: undefined }
// }

// export const GORouting: GORouting = {
//   go_profile: {
//     pageId: pages.PROFILE,
//   },
//   [`open_store_money-(.*)`]: {
//     // open_store_money-GROUP // open_store_money-currency
//     modalId: modals.STORE_MONEY,
//     params: { group: 1 },
//   },
// }

export const routerStruct: RouterStruct = [
  {
    viewId: views.STARTUP,
    default: pages.STARTUP,
    panels: {
      [pages.STARTUP]: panels.STARTUP,
    },
  },
  {
    viewId: views.ERROR,
    default: pages.DUPLICATED,
    panels: {
      [pages.DUPLICATED]: panels.DUPLICATED,
    },
  },
  {
    viewId: views.PROFILE,
    default: pages.PROFILE,
    panels: {
      [pages.PROFILE]: panels.PROFILE,
      [pages.SETTINGS]: panels.SETTINGS,
      [pages.FONTSIZE]: panels.FONTSIZE,
      [pages.BACKGROUNDS]: panels.BACKGROUNDS,
      [pages.BACKGROUND_EDIT]: panels.BACKGROUND_EDIT,
      [pages.THEME]: panels.THEME,
      [pages.PREMIUM]: panels.PREMIUM,
    },
  },
  {
    viewId: views.SEARCH,
    default: pages.SEARCH,
    panels: {
      [pages.SEARCH]: panels.SEARCH,
      [pages.SEARCH_START]: panels.SEARCH_START,
    },
  },
  {
    viewId: views.CHATS,
    default: pages.CHATS,
    panels: {
      [pages.CHATS]: panels.CHATS,
      [pages.CHAT]: panels.CHAT,
    },
  },
]
