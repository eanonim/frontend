type RouterStruct = {
  viewId: string
  default: string
  panels: Record<string, string>
}[]

export enum views {
  STARTUP = "view_startup",
  PROFILE = "view_profile",
  SEARCH = "view_search",
  CHATS = "view_chats",
}

export enum panels {
  STARTUP = "panel_startup",

  PROFILE = "panel_profile",
  SETTINGS = "panel_settings",
  FONTSIZE = "panel_fontsize",
  BACKGROUNDS = "panel_backgrounds",
  BACKGROUND_EDIT = "panel_background_edit",
  THEME = "panel_theme",

  SEARCH = "panel_search",

  CHATS = "panel_chats",
  CHAT = "panel_chat",
}

export enum pages {
  STARTUP = "/",

  PROFILE = "/profile",
  SETTINGS = "/profile/settings",
  FONTSIZE = "/settings/fontsize",
  BACKGROUNDS = "/settings/backgrounds",
  BACKGROUND_EDIT = "/settings/background",
  THEME = "/settings/theme",

  SEARCH = "/search",

  CHATS = "/chats",
  CHAT = "/chat",
}

export enum modals {
  STORE_MONEY = "modal_store_money",
}

export enum popouts {
  COPY = "snackbar_copy",
  ERROR = "snackbar_error",
}

export type routerParams = {
  // [modals.STORE_MONEY]: {
  //   group: shopGetRequest["group"]
  // }
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
    viewId: views.PROFILE,
    default: pages.PROFILE,
    panels: {
      [pages.PROFILE]: panels.PROFILE,
      [pages.SETTINGS]: panels.SETTINGS,
      [pages.FONTSIZE]: panels.FONTSIZE,
      [pages.BACKGROUNDS]: panels.BACKGROUNDS,
      [pages.BACKGROUND_EDIT]: panels.BACKGROUND_EDIT,
      [pages.THEME]: panels.THEME,
    },
  },
  {
    viewId: views.SEARCH,
    default: pages.SEARCH,
    panels: {
      [pages.SEARCH]: panels.SEARCH,
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
