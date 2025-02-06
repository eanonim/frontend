import { type System, type AtomReturn } from "../types"
import { getter, setterStatus } from ".."

import { createEffect, mergeProps, on, splitProps } from "solid-js"
import { createStore } from "solid-js/store"

export const useAtomSystem = <VALUE, OPTIONS>(
  signal: AtomReturn<VALUE, OPTIONS>,
  params?: {
    /**
     * Ключ для кеширования данных.
     */
    key?: string | number | (() => string | number)
  },
): [get: System, set: (options: System) => void] => {
  const merged = mergeProps({ key: "default" }, params)
  const [local] = splitProps(merged, ["key"])

  const [storeCache, setStoreCache] = signal

  const getKey = () => {
    return typeof local.key === "function"
      ? String(local.key())
      : String(local.key)
  }

  const [cache, setCache] = createStore<{ data: System }>({
    data: storeCache.cache[getKey()].system || {
      error: false,
      load: false,
      fullLoad: false,
    },
  })

  createEffect(
    on(
      [
        () => getter(signal, getKey()),
        () => storeCache.cache[getKey()],
        getKey,
      ],
      (next, prev) => {
        const system = next?.[1]?.system
        if (system) {
          setCache("data", system)
        }
      },
    ),
  )

  const _setCache = (options: System) => {
    const key = getKey()
    return setterStatus([signal, key], options)
  }

  return [cache.data, _setCache]
}

export default useAtomSystem
