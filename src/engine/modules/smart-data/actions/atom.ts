import { type AtomProps, type AtomReturn } from "../types"

import { mergeProps } from "solid-js"
import { createStore } from "solid-js/store"

const atom = <VALUE, OPTIONS>(
  options: AtomProps<VALUE, OPTIONS>,
): AtomReturn<VALUE, OPTIONS> => {
  const merged = mergeProps({ updateIntervalMs: 5_000 }, options)
  return createStore({ ...merged, cache: {}, requests: {} })
}

export default atom
