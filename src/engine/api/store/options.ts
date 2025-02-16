import { setter } from "engine/modules/smart-data"
import { Socket, socketSend, StoreOptions, StoreOptionsAtom } from "../module"
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

  const responseObject: Record<string, any> = {}

  if (Object.prototype.toString.call(response) === "[object Array]") {
    for (const item of response as any) {
      responseObject[item.value] = item
    }
  }

  setter([STORE_OPTIONS_ATOM, options.key], response)

  return { response: responseObject, error }
}

export default storeOptions
