import { getter } from "engine/modules/smart-data"
import { Socket, SocketError, StoreOptions } from "./module"
import { STORE_OPTIONS_ATOM, USER_ATOM } from "engine/state"

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
    const options = getter(STORE_OPTIONS_ATOM, StoreOptions.backgroundId)

    const option = options[value]

    return checkErrors([Error1002(user?.premium, option?.is_premium)])
  },
  isThemeColor: (value: Socket["store.list"]["response"]["themeColor"]) => {
    const user = getter(USER_ATOM)
    const options = getter(STORE_OPTIONS_ATOM, StoreOptions.themeColor)

    const option = options[value]

    return checkErrors([Error1002(user?.premium, option?.is_premium)])
  },
}

export default ServerError
