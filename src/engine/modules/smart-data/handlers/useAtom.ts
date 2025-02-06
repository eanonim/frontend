import { type AtomReturn } from "../types"
import { getter, setter, setterStatus } from ".."

import { createEffect, mergeProps, on, splitProps } from "solid-js"
import { createStore, SetStoreFunction } from "solid-js/store"

/**
 * `useAtom` - хук SolidJS для работы с атомарными данными (состоянием).
 * Позволяет подписываться на обновления атомарных данных и автоматически запрашивать данные с сервера.
 */
export const useAtom = <VALUE, OPTIONS>(
  signal: AtomReturn<VALUE, OPTIONS>,
  options?: OPTIONS | (() => OPTIONS),
  params?: {
    /**
     * Ключ для кеширования данных.
     */
    key?: string | number | (() => string | number)
    /**
     * Определяет, нужно ли автоматически выполнять начальный запрос данных при монтировании компонента.
     */
    isRequest?: boolean | (() => boolean)
    /**
     * Функция для сравнения предыдущего и нового значений атома. Если функция возвращает `true`, хук не будет вызывать обновление сигнала, предотвращая ненужные перерисовки компонента.
     */
    equals?: (prev: VALUE, next: VALUE) => boolean
  },
): [get: VALUE, set: SetStoreFunction<VALUE>] => {
  const merged = mergeProps({ key: "default", isRequest: true }, params)
  const [local] = splitProps(merged, ["isRequest", "key", "equals"])

  const [storeCache, setStoreCache] = signal

  const getKey = () => {
    return typeof local.key === "function"
      ? String(local.key())
      : String(local.key)
  }

  const getOptions = () => {
    return typeof options === "function" ? (options as Function)() : options
  }

  const getRequest = () => {
    return typeof local.isRequest === "function"
      ? (local.isRequest as Function)()
      : local.isRequest
  }

  const [cache, setCache] = createStore<{ data: VALUE }>({
    data: getter(signal, getKey()),
  })

  createEffect(
    on(
      [
        () => getter(signal, getKey()),
        () => storeCache.cache[getKey()],
        getKey,
      ],
      (next, prev) => {
        const nextData = next?.[0]
        const prevData = prev?.[0] || nextData

        if (local.equals?.(prevData, nextData)) return

        setCache("data", next?.[1].data)
      },
      { defer: true },
    ),
  )

  createEffect(
    on(getKey, (key, next) => {
      if (key !== next) {
        const data = storeCache.cache[key]

        /* Если fullLoad === true, запрашивать данные больше не нужно */
        if (data?.system?.fullLoad) return
        if (data?.update_at.getTime() > Date.now()) return

        const isRequest = storeCache.requests[key] !== "start"
        // if (!_isRequest && getRequest() && store.when) {
        if (isRequest && getRequest()) {
          const onRequested = storeCache.onRequested
          if (onRequested) {
            setterStatus([signal, key], { load: true })

            onRequested(getOptions(), key)
          } else {
            setterStatus([signal, key], { load: false })
          }
        }
      }
    }),
  )

  const _setCache: SetStoreFunction<VALUE> = (...args: unknown[]) => {
    const key = getKey()
    return (setter as any)([signal, key], ...args)
  }

  return [cache.data, _setCache]
}

export default useAtom
