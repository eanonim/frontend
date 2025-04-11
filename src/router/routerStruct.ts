import { Socket } from "engine/api/module"

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
  RATING = "view_rating",
  TASK = "view_task",
}

export enum panels {
  STARTUP = "panel_startup",
  DUPLICATED = "panel_duplicated",
  BAD = "panel_bad",
  PLATFORM = "panel_platform",

  PROFILE = "panel_profile",
  SETTINGS = "panel_settings",
  FONTSIZE = "panel_fontsize",
  BACKGROUNDS = "panel_backgrounds",
  BACKGROUND_EDIT = "panel_background_edit",
  THEME = "panel_theme",
  PREMIUM = "panel_premium",
  LANGUAGE = "panel_language",
  REFERRAL = "panel_referral",

  SEARCH = "panel_search",
  SEARCH_START = "panel_search_start",

  CHATS = "panel_chats",
  CHAT = "panel_chat",

  RATING = "panel_rating",

  TASK = "panel_task",
}

export enum pages {
  STARTUP = "/",
  DUPLICATED = "/duplicated",
  BAD = "/bad",
  PLATFORM = "/platform",

  PROFILE = "/profile",
  SETTINGS = "/profile/settings",
  FONTSIZE = "/settings/fontsize",
  BACKGROUNDS = "/settings/backgrounds",
  BACKGROUND_EDIT = "/settings/background",
  THEME = "/settings/theme",
  PREMIUM = "/settings/premium",
  LANGUAGE = "/settings/language",
  REFERRAL = "/settings/referral",

  SEARCH = "/search",
  SEARCH_START = "/search/start",

  CHATS = "/chats",
  CHAT = "/chat",

  RATING = "/rating",

  TASK = "/task",
}

export enum modals {
  STORE_MONEY = "modal_store_money",
  INTERESTS_LIST = "modal_interests_list",
  MESSAGE_CONTROL = "modal_message_control",
  USER_EMOJI = "modal_user_emoji",
  USER_CHANGE_NAME = "modal_user_change_name",
  MESSAGE_COMPLAINT = "modal_complaint",
  MODAL_PREMIUM = "modal_premium",
  MODAL_LEAVE = "modal_leave",
  MODAL_TASK = "modal_task",
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
  [modals.MODAL_LEAVE]: {
    dialog: string
  }
  [modals.MODAL_TASK]: {
    task_id: number
    group: Socket["task.list"]["request"]["group"]
  }
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
    viewId: views.TASK,
    default: pages.TASK,
    panels: {
      [pages.TASK]: panels.TASK,
    },
  },
  {
    viewId: views.RATING,
    default: pages.RATING,
    panels: {
      [pages.RATING]: panels.RATING,
    },
  },
  {
    viewId: views.ERROR,
    default: pages.DUPLICATED,
    panels: {
      [pages.DUPLICATED]: panels.DUPLICATED,
      [pages.PLATFORM]: panels.PLATFORM,
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
      [pages.LANGUAGE]: panels.LANGUAGE,
      [pages.REFERRAL]: panels.REFERRAL,
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
