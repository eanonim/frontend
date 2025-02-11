import { atom } from "engine/modules/smart-data"

import { storeOptions } from "engine/api"
import { Socket } from "engine/api/module"

export const STORE_OPTIONS_ATOM = atom<
  Socket["store.options"]["response"],
  Socket["store.options"]["request"]
>({
  onKey: (options) => {
    return options.key
  },
  default: [],
  onRequested: (options, key) => {
    storeOptions(options)
  },
  updateIntervalMs: 60_000,
})
