import {
  type GlobalAtom,
  type Atom,
  type SmartData,
  SetStateAction,
} from "../types"
import { atom, getter, setter } from "elum-state/solid"

import {
  Accessor,
  createEffect,
  createSignal,
  createUniqueId,
  mergeProps,
  on,
  onCleanup,
  onMount,
  splitProps,
  untrack,
} from "solid-js"
import { globalSignal } from "elum-state/solid"
import { createStore } from "solid-js/store"

export type SmartDataAtom<T, OPTIONS> = {
  default: T
  cache: Map<string, SmartData<T>>
  requests: Map<string, boolean>
  onRequested?: (
    onFinish: () => void,
    key: string | number,
    options: OPTIONS,
  ) => void
  update_via: number
}

/* Create Atom */
export const smartDataAtom = <T, OPTIONS>(
  opt: Atom<T, OPTIONS>,
): GlobalAtom<T, OPTIONS> => {
  return atom({
    key: opt.key,
    default: {
      default: opt.default,
      update_via: opt.update_via || 5_000,
      onRequested: opt.onRequested,
      cache: new Map<string, SmartData<T>>(),
      requests: new Map<string, boolean>(),
    },
  }) as unknown as GlobalAtom<T, OPTIONS>
}

const getDefault = <T>(data: T): T => {
  return Array.isArray(data) ? ([...data] as T) : { ...data }
}

export const createSystemSmartData = <T, OPTIONS>(
  atom: GlobalAtom<T, OPTIONS>,
  {
    key = "default",
    equals,
  }: {
    key?: string | number | (() => string | number)
    /*
    true - Не нужно обновлять сигнал
    */
    equals?: (prev: T, next: T) => boolean
  },
): [get: Accessor<SmartData<T>["system"]>] => {
  const getKey = () => {
    return typeof key === "function" ? String(key()) : String(key)
  }

  const [getter, setter] = globalSignal(
    atom as unknown as GlobalAtom<SmartDataAtom<T, OPTIONS>, OPTIONS>,
  )

  const [system, setSystem] = createSignal<SmartData<T>["system"]>(
    getter()?.cache?.get(getKey())?.system,
  )

  createEffect(() => {
    const data = getter().cache.get(getKey()) || {
      data: getDefault(getter().default),
      update_at: new Date(),
      req_id: createUniqueId(),
    }
    if (!data.system) {
      data.system = {
        isError: false,
        isLoad: false,
        isFullLoad: false,
      }
    }
    if (!!!data?.data) {
      data.system.isLoad = true
      data.update_at = new Date(0)
    }

    setSystem({ ...data.system })
  })

  return [system]
}

/* Use Signal by Atom */
export const createSmartData = <T, OPTIONS>(
  atom: GlobalAtom<T, OPTIONS>,
  options: OPTIONS | (() => OPTIONS),
  params: {
    key?: string | number | (() => string | number)
    /*
    нужно ли автоматически отправить запрос
    */
    isRequest?: boolean | (() => boolean)
    /*
    true - Не нужно обновлять сигнал
    */
    equals?: (prev: T, next: T) => boolean
  } /*
  {
    key = "default",
    isRequest = true,
    equals,
  }: 
  */,
): [
  get: Accessor<T>,
  set: (value: SetStateAction<T>) => void,
  get: Accessor<SmartData<T>["system"]>,
] => {
  const merged = mergeProps(
    {
      key: "default",
      isRequest: true,
    },
    params,
  )
  const [local] = splitProps(merged, ["equals", "isRequest", "key"])

  const [store, setStore] = createStore({
    when: true,
  })
  // const [_, start] = useTransition()

  const [getter, setter] = globalSignal(
    atom as unknown as GlobalAtom<SmartDataAtom<T, OPTIONS>, OPTIONS>,
  )

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

  const [cache, setCache] = createSignal<SmartData<T>>(
    {
      data: getDefault(untrack(getter).default),
      update_at: new Date(),
      req_id: "default",
    },
    {
      equals: (prev, next) => {
        return !local.equals
          ? prev?.req_id === next?.req_id
          : local.equals(prev?.data, next?.data)
      },
    },
  )

  const [system, setSystem] = createSignal<SmartData<T>["system"]>(
    untrack(cache)?.system,
  )

  onMount(() => {
    setStore("when", true)
  })

  onCleanup(() => setStore("when", false))

  createEffect(
    on(getKey, (prev, next) => {
      if (prev !== next) {
        const state = untrack(getter)
        const key = prev
        const onRequested = state.onRequested

        const _isRequest = state.requests.get(key)

        if (!_isRequest && getRequest() && store.when) {
          const onResult = (status: boolean) => {
            setter((value) => {
              value.requests.set(key, status)
              return { ...value }
            })
          }

          if (onRequested) {
            onResult(true)
            onRequested(() => onResult(false), key, getOptions())
          }
        }
      }
    }),
  )

  createEffect(() => {
    const data = getter().cache.get(getKey()) || {
      data: getDefault(getter().default),
      update_at: new Date(),
      req_id: "default",
    }
    if (!data.system) {
      data.system = {
        isError: false,
        isLoad: false,
        isFullLoad: false,
      }
    }
    // if (!!!data?.data) {
    //   data.system.isLoad = true
    //   data.update_at = new Date(0)
    // }

    if (data.req_id === "default") {
      data.req_id = createUniqueId()
      setter((value) => {
        value.cache.set(getKey(), data)
        return { ...value }
      })
    }

    setCache({ ...data })
    setSystem({ ...data.system })
  })

  const _setCache = (v: SetStateAction<T>, update_via?: number) => {
    return setter((value) => {
      const _update_via = update_via || getter().update_via

      const newValue = value.cache.get(getKey()) || {
        data: getDefault(value.default),
        update_at: new Date(Date.now() + _update_via),
        req_id: "default",
      }

      newValue.data =
        typeof v === "function"
          ? (v as Function)(
              Array.isArray(newValue.data)
                ? [...newValue.data]
                : { ...newValue.data },
            )
          : v
      newValue.update_at = new Date(Date.now() + _update_via)
      newValue.req_id = createUniqueId()

      value.cache.set(getKey(), newValue)
      return { ...value }
    })
  }

  return [() => cache()?.data, _setCache, system]
}

export const getterSmartData = <T, OPTIONS>(
  atom: GlobalAtom<T, OPTIONS>,
  key: string | number = "default",
) => {
  const store = getter(
    atom as unknown as GlobalAtom<SmartDataAtom<T, OPTIONS>, OPTIONS>,
  )
  return store.cache.get(String(key))?.data
}

export const setterSmartData = <T, OPTIONS>(
  atom: GlobalAtom<T, OPTIONS>,
  v: SetStateAction<T> | undefined,
  {
    key = "default",
    update_via,
    isLoad = false,
    isError = false,
    isFullLoad = false,
  }: {
    key?: string | number
    update_via?: number
    isLoad?: boolean | "auto"
    isError?: boolean | "auto"
    isFullLoad?: boolean | "auto"
  },
) => {
  return setter(
    atom as unknown as GlobalAtom<SmartDataAtom<T, OPTIONS>, OPTIONS>,
    (value) => {
      const _update_via = update_via || value.update_via

      let newValue = value.cache.get(String(key)) || {
        data: getDefault(value.default),
        update_at: new Date(Date.now() + _update_via),
        req_id: "default",
      }
      if (!newValue.system) {
        newValue.system = {
          isError: false,
          isLoad: false,
          isFullLoad: false,
        }
      }

      if (v !== undefined) {
        newValue.data =
          typeof v === "function"
            ? (v as Function)(
                Array.isArray(newValue.data)
                  ? [...newValue.data]
                  : { ...newValue.data },
              )
            : v
      }
      newValue.update_at = new Date(Date.now() + _update_via)
      newValue.req_id = createUniqueId()
      newValue.system.isLoad =
        isLoad === "auto" ? !!newValue.system.isLoad : isLoad
      newValue.system.isError =
        isError === "auto" ? !!newValue.system.isError : isError
      newValue.system.isFullLoad =
        isFullLoad === "auto" ? !!newValue.system.isFullLoad : isFullLoad

      value.cache.set(String(key), newValue)
      return { ...value }
    },
  )
}

export const managerSmartData = <T, OPTIONS>(
  atom: GlobalAtom<T, OPTIONS>,
  {
    key = "default",
    update_via,
  }: {
    key?: string | number
    update_via?: number
  },
) => {
  const state = getter(
    atom as unknown as GlobalAtom<SmartDataAtom<T, OPTIONS>, OPTIONS>,
  )

  const data = state.cache.get(String(key))

  const _set = (_key: "isError" | "isLoad", _value: boolean) => {
    // if (data?.system?.[_key] === _value) return

    setter(
      atom as unknown as GlobalAtom<SmartDataAtom<T, OPTIONS>, OPTIONS>,
      (value) => {
        const _update_via = update_via || value.update_via

        const newValue = value.cache.get(String(key)) || {
          data: getDefault(value.default),
          update_at: new Date(Date.now() + _update_via),
          req_id: "default",
        }

        if (!newValue.system) {
          newValue.system = {
            isError: false,
            isLoad: false,
            isFullLoad: false,
          }
        }
        newValue.system[_key] = _value
        newValue.req_id = createUniqueId()

        value.cache.set(String(key), newValue)
        return { ...value }
      },
    )
  }

  return {
    ...data,
    setError: (value: boolean) => _set("isError", value),
    setter: (
      v: SetStateAction<T>,
      params: {
        isError?: boolean | "auto"
        isLoad?: boolean | "auto"
        isFullLoad?: boolean | "auto"
      } = {
        isLoad: false,
        isError: "auto",
        isFullLoad: "auto",
      },
    ) => {
      setterSmartData(atom, v, {
        key,
        isError: params?.isError,
        isLoad: params?.isLoad,
        isFullLoad: params?.isFullLoad,
      })
    },
    /*
      Установка статуса лоадера, если не указан будет астановлен автоматически
    */
    setLoad: (value?: boolean) => _set("isLoad", value || !!!data?.data),
  }
}
