import { setter } from "engine/modules/smart-data"
import { Socket, socketSend, StoreOptionsAtom } from "../module"
import { STORE_OPTIONS_ATOM } from "engine/state"

const storeOptions = async (options: Socket["store.options"]["request"]) => {
  const { response, error } = await socketSend("store.options", options)
  if (error) {
    return { response, error }
  }

  for (const key in response) {
    let value = (response as any)[key].value
    if (typeof Number(value) === "number" && !isNaN(Number(value))) {
      value = Number(value)
    } else if (value === "true" || value === "false") {
      value = Boolean(value)
    }
    ;(response as any)[key].value = value
  }

  // const elements: StoreOptionsAtom = {}

  // for (const data of response) {
  //   elements[data.value] = data
  // }

  setter([STORE_OPTIONS_ATOM, options.key], response)

  return { response, error }
}

export default storeOptions
