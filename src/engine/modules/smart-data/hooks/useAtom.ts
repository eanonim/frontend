import { type Key, type AtomReturn } from "../types"
import { getDefault, getter, getValue, setter, setterStatus } from ".."

import { createEffect, mergeProps, on, splitProps } from "solid-js"
import { createStore, type SetStoreFunction } from "solid-js/store"

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
    key?: Key | (() => Key)
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
  const merged = mergeProps({ isRequest: true }, params)
  const [local] = splitProps(merged, ["isRequest", "key", "equals"])

  const [storeCache, setStoreCache] = signal

  const getOptions = () => getValue(options)
  const getKey = () =>
    getValue(
      local.key ? local.key : storeCache.onKey?.(getOptions()) ?? "default",
    )
  const getRequest = () => getValue(local.isRequest)

  const [cache, setCache] = createStore(getter(signal, getKey()) as any)

  createEffect(
    on(
      [
        () => getter(signal, getKey()),
        () => storeCache.cache[getKey()],
        () => storeCache.cache[getKey()]?.update_at,
        getKey,
      ],
      (next, prev) => {
        const nextData = next?.[0]
        const prevData = prev?.[0] || nextData

        if (local.equals?.(prevData, nextData)) return

        setCache(next?.[1].data)
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
        if (isRequest && getRequest()) {
          const onRequested = storeCache.onRequested
          onRequested?.(getOptions(), key)

          setterStatus([signal, key], { load: !!onRequested })
        }
      }
    }),
  )

  const _setCache: SetStoreFunction<VALUE> = (...args: unknown[]) => {
    return (setter as any)([signal, getKey()], ...args)
  }

  createEffect(() => {
    console.log({ data: cache })
  })

  return [cache, _setCache]
}

export default useAtom
