import { type AtomReturn, type System } from "../types"
import { getDefault } from ".."
import { batch } from "solid-js"

type SetterStatusOptions<VALUE, OPTIONS> =
  | AtomReturn<VALUE, OPTIONS>
  | [signal: AtomReturn<VALUE, OPTIONS>, key: string]

const setterStatus = <VALUE, OPTIONS>(
  options: SetterStatusOptions<VALUE, OPTIONS>,
  params: System,
) => {
  const [signal, key] = Array.isArray(options[0])
    ? [options[0], options[1] as string]
    : [options as AtomReturn<VALUE, OPTIONS>, "default"]

  if (signal) {
    batch(() => {
      const [getter, setter] = signal

      const cache = getter.cache[key]

      const error = params.error ?? !!cache?.system?.error ?? false
      const load =
        (params.load ?? !!cache?.system?.load ?? false) && !!!cache?.data
      const fullLoad = params.fullLoad ?? !!cache?.system?.fullLoad ?? false

      const system = { error, load, fullLoad }

      if (!cache) {
        setter("cache", key, {
          data: getDefault(getter.default),
          system: system,
          update_at: new Date(),
        })
      }

      setter("requests", key, params.load ? "start" : "end")
      setter("cache", key, "system", system)
    })
  }
}

export default setterStatus
