import { type AtomProps, type AtomReturn } from "../types"

import { mergeProps, splitProps } from "solid-js"
import { createStore } from "solid-js/store"

const atom = <VALUE, OPTIONS>(
  options: AtomProps<VALUE, OPTIONS>,
): AtomReturn<VALUE, OPTIONS> => {
  const merged = mergeProps({ updateIntervalMs: 5_000 }, options)

  const [local, others] = splitProps(merged, [
    "default",
    "onRequested",
    "updateIntervalMs",
  ])

  return createStore({
    default: local.default,
    updateIntervalMs: local.updateIntervalMs,
    onRequested: local.onRequested,
    cache: {},
    requests: {},
  })
}

export default atom
