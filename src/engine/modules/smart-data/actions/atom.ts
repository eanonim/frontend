import { type AtomProps, type AtomReturn } from "../types"

import { mergeProps } from "solid-js"
import { createStore } from "solid-js/store"

const atom = <VALUE, OPTIONS>(
  options: AtomProps<VALUE, OPTIONS>,
): AtomReturn<VALUE, OPTIONS> => {
  const merged = mergeProps({ updateIntervalMs: 5_000 }, options)

  const onKey = (options: OPTIONS) => {
    try {
      return merged.onKey?.(options) ?? "default"
    } catch {
      return "default"
    }
  }

  return createStore({ ...merged, onKey, cache: {}, requests: {} })
}

export default atom
