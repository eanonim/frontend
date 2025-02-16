import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import {
  STORE_BACKGROUND_ATOM,
  STORE_INTEREST_ATOM,
  STORE_THEME_COLOR_ATOM,
} from "engine/state"

const storeOptions = async (options: Socket["store.options"]["request"]) => {
  const atoms = {
    backgroundId: STORE_BACKGROUND_ATOM,
    themeColor: STORE_THEME_COLOR_ATOM,
    interest: STORE_INTEREST_ATOM,
  }

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

  setter(atoms[options.key], responseObject)

  return { response: responseObject, error }
}

export default storeOptions
