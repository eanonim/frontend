import { atom } from "engine/modules/smart-data"

import { productGet } from "engine/api"
import { Socket } from "engine/api/module"

export const PRODUCT_ATOM = atom<
  Partial<Socket["product.get"]["response"][""]>,
  Socket["product.get"]["request"],
  string // group + currency + lang
>({
  onKey: (options) => {
    return options.group + options.currency + options.lang
  },
  default: {},
  onRequested: (options, key) => {
    productGet(options)
  },
  updateIntervalMs: 60_000,
})
