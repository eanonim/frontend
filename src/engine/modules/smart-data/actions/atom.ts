import { type Key, type AtomProps, type AtomReturn } from "../types"

import { mergeProps } from "solid-js"
import { createStore } from "solid-js/store"

const atom = <VALUE, OPTIONS, KEY = Key>(
  options: AtomProps<VALUE, OPTIONS, KEY>,
): AtomReturn<VALUE, OPTIONS, KEY> => {
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
