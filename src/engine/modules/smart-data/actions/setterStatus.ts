import { type Key, type AtomReturn, type System } from "../types"
import getDefault from "../utils/getDefault"
import { batch } from "solid-js"

type SetterStatusOptions<VALUE, OPTIONS, KEY> =
  | AtomReturn<VALUE, OPTIONS, KEY>
  | [signal: AtomReturn<VALUE, OPTIONS, KEY>, key: Key]

const setterStatus = <VALUE, OPTIONS, KEY>(
  options: SetterStatusOptions<VALUE, OPTIONS, KEY>,
  params: System,
) => {
  const [signal, key] = Array.isArray(options[0])
    ? [options[0], options[1] as string]
    : [options as AtomReturn<VALUE, OPTIONS, KEY>, "default"]

  if (signal) {
    batch(() => {
      const [getter, setter] = signal

      const cache = getter.cache[key]

      const system = {
        error: params.error ?? !!cache?.system?.error ?? false,
        load: (params.load ?? !!cache?.system?.load ?? false) && !cache?.data,
        fullLoad: params.fullLoad ?? !!cache?.system?.fullLoad ?? false,
      }

      if (!cache) {
        setter("cache", key, {
          data: getDefault(getter.default),
          system: system,
          update_at: new Date(),
        })
      } else {
        setter("cache", key, "system", system)
      }

      setter("requests", key, params.load ? "start" : "end")
    })
  }
}

export default setterStatus
