import { atom, setter } from "elum-state/solid"
import { Component, onMount } from "solid-js"
import { createStore } from "solid-js/store"

const CACHE = atom<Record<string, unknown>>({
  key: "cache" + Math.random(),
  default: {},
})

type Callback<OPTIONS, RESPONSE> = (
  options: OPTIONS,
  resolve: (data: RESPONSE) => void,
  reject: () => void,
) => void

const cache = <OPTIONS, RESPONSE>(
  callback: Callback<OPTIONS, RESPONSE>,
  {
    key,
  }: {
    key: string
  },
) => {
  return callback
}

const createCache = <OPTIONS, RESPONSE>(
  callback: Callback<OPTIONS, RESPONSE>,
  options: OPTIONS,
) => {
  const [store, setStore] = createStore<{
    data?: RESPONSE
    status: "loading" | "error" | "available"
  }>({
    data: undefined,
    status: "loading",
  })

  onMount(() => {
    setStore("status", "loading")

    const resolve = (data: RESPONSE) => {
      setter(CACHE, (value) => {
        value[callback.toString()] = data
        return { ...value }
      })
      setStore("status", "available")
    }

    const reject = () => {
      setStore("status", "error")
    }

    callback(options, resolve, reject)
  })

  return store
}

export type Request = {
  user: number
}

export type Response = {
  first_name: string
  last_name: string
}

/* path: /api/getUser */
const getUser = cache<Request, Response>(
  (options, resolve, reject) =>
    fetch(`/api/users/?user=${options.user}`)
      .then((r) => resolve(r.json() as any))
      .catch(() => reject()),
  {
    key: "test",
  },
)

/* path: /layout/App/App/Default */
const test: Component<JSX.IntrinsicAttributes> = () => {
  const { data, status } = createCache(getUser, { user: 2 })

  return <>{data?.first_name}</>
}
