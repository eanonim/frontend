import { atom } from "engine/modules/smart-data"

import { storeOptions } from "engine/api"
import { Socket, StoreOptions } from "engine/api/module"

export const STORE_OPTIONS_ATOM = atom<
  Partial<Socket["store.options"]["response"]>,
  Socket["store.options"]["request"],
  Socket["store.options"]["request"]["key"]
>({
  onKey: (options) => {
    return options.key
  },
  default: {},
  onRequested: (options, key) => {
    storeOptions(options)
  },
  updateIntervalMs: 60_000,
})
