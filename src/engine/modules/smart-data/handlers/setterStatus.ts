import { produce } from "solid-js/store"
import { AtomReturn } from "../types"
import { getDefault } from ".."
import { batch } from "solid-js"

type SetterStatusOptions<VALUE, OPTIONS> =
  | AtomReturn<VALUE, OPTIONS>
  | [signal: AtomReturn<VALUE, OPTIONS>, key: string]

const setterStatus = <VALUE, OPTIONS>(
  options: SetterStatusOptions<VALUE, OPTIONS>,
  params: {
    load?: boolean
    error?: boolean
    fullLoad?: boolean
  },
) => {
  let key = "default"
  let signal: AtomReturn<VALUE, OPTIONS> | undefined

  if (Array.isArray(options[0]) && typeof options[1] === "string") {
    signal = options[0]
    key = options[1]
  }
  if (!Array.isArray(options[0]) && typeof options[1] !== "string") {
    signal = [options[0], options[1]]
  }

  if (signal) {
    batch(() => {
      const [getter, setter] = signal

      const cache = getter.cache[key]

      const error =
        params.error !== undefined ? params.error : !!cache?.system?.error
      const load =
        (params.load !== undefined ? params.load : !!cache?.system?.load) &&
        !!!cache?.data
      const fullLoad =
        params.fullLoad !== undefined
          ? params.fullLoad
          : !!cache?.system?.fullLoad

      if (!cache) {
        setter("cache", key, {
          data: getDefault(getter.default),
          system: { error: error, load: load, fullLoad: fullLoad },
          update_at: new Date(),
        })
      }

      setter("requests", key, params.load ? "start" : "end")
      setter("cache", key, "system", {
        load: load,
        error: error,
        fullLoad: fullLoad,
      })
      console.log("END")
    })
  }
}

export default setterStatus
