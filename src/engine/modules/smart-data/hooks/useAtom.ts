import { type AtomReturn } from "../types"
import { getter, getValue, setter, setterStatus } from ".."

import { createEffect, createMemo, mergeProps, on, splitProps } from "solid-js"
import { createStore, type SetStoreFunction } from "solid-js/store"
import { unlink } from "@minsize/utils"

/**
 * `useAtom` - хук SolidJS для работы с атомарными данными (состоянием).
 * Позволяет подписываться на обновления атомарных данных и автоматически запрашивать данные с сервера.
 */
export const useAtom = <VALUE, OPTIONS, KEY extends string>(
  signal: AtomReturn<VALUE, OPTIONS, KEY>,
  options?: OPTIONS | (() => OPTIONS),
  params?: {
    /**
     * Ключ для кеширования данных.
     */
    key?: KEY | (() => KEY)
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
  const getKey = createMemo(
    () =>
      getValue(
        local.key ? local.key : storeCache.onKey?.(getOptions()) ?? "default",
      ),
    getOptions(),
  )
  const getRequest = () => getValue(local.isRequest)

  let [cache, setCache] = createStore(unlink(getter(signal, getKey()) as any))

  createEffect(
    on(
      [
        () => getter(signal, getKey()),
        () => storeCache.cache[getKey()]?.update_at,
      ],
      (next, prev) => {
        // if (next[3] === "default" && !!params && params.hasOwnProperty("key"))
        //   return

        const nextData = next?.[0]
        const prevData = prev?.[0] || nextData

        if (local.equals?.(prevData, nextData)) return

        const data = storeCache.cache[getKey()]?.data

        if (data) {
          const [getterData] = data

          setCache(unlink(getterData))
        }
      },
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

  return [cache, _setCache]
}

export default useAtom
