import { atom } from "engine/modules/smart-data"

import { storeOptions } from "engine/api"
import { Socket } from "engine/api/module"

export const STORE_BACKGROUND_ATOM = atom<
  Partial<Socket["store.options"]["response"]["backgroundId"]>,
  {}
>({
  default: {},
  onRequested: (options, key) => {
    storeOptions({ key: "backgroundId" })
  },
  updateIntervalMs: 60_000,
})

export const STORE_THEME_COLOR_ATOM = atom<
  Partial<Socket["store.options"]["response"]["themeColor"]>,
  {}
>({
  default: {},
  onRequested: (options, key) => {
    storeOptions({ key: "themeColor" })
  },
  updateIntervalMs: 60_000,
})

export const STORE_INTEREST_ATOM = atom<
  Partial<Socket["store.options"]["response"]["interest"]>,
  {}
>({
  default: {},
  onRequested: (options, key) => {
    storeOptions({ key: "interest" })
  },
  updateIntervalMs: 60_000,
})
