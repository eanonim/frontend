import { getter } from "engine/modules/smart-data"
import { Socket, SocketError } from "./module"
import {
  STORE_BACKGROUND_ATOM,
  STORE_THEME_COLOR_ATOM,
  USER_ATOM,
} from "engine/state"
import { isPremium } from "engine"

const checkErrors = (
  errors: (SocketError | undefined)[],
): false | SocketError => {
  return errors.find(Boolean) || false
}

const errorObject = (code: number) => ({
  code: code,
  message: `unknown, code: ${code}`,
})

/* Для этого действия необходим премиум-доступ */
const Error1002 = (userPremium?: boolean, value?: boolean) => {
  if (typeof value === "boolean" && typeof userPremium === "boolean") {
    if (value === true && userPremium !== true) return errorObject(1002)
  }
}

const ServerError = {
  isBackgroundId: (value: Socket["store.list"]["response"]["backgroundId"]) => {
    const user = getter(USER_ATOM)
    const options = getter(STORE_BACKGROUND_ATOM)

    const option = options[value]

    return checkErrors([
      Error1002(isPremium(user?.premium), option?.is_premium),
    ])
  },
  isThemeColor: (value: Socket["store.list"]["response"]["themeColor"]) => {
    const user = getter(USER_ATOM)
    const options = getter(STORE_THEME_COLOR_ATOM)

    const option = options[value]

    return checkErrors([
      Error1002(isPremium(user?.premium), option?.is_premium),
    ])
  },
}

export default ServerError
