import handlerError from "../handlerError"
import ServerError from "../ServerError"
import { Socket, socketSend } from "../module"
import storeList from "./list"

const storeSet = async (options: Socket["store.set"]["request"]) => {
  let errorServer

  if (options.key === "backgroundId") {
    errorServer = ServerError.isBackgroundId(options.value)
  }
  if (options.key === "themeColor") {
    errorServer = ServerError.isThemeColor(options.value)
  }

  console.log({ errorServer })

  if (errorServer) {
    storeList({})
    handlerError(errorServer)
    return { response: undefined, error: errorServer }
  }

  options.value = String(options.value)
  const { response, error } = await socketSend("store.set", options)

  if (error) {
    console.log({ error })
    storeList({})
    handlerError({ code: error.code, message: error.message })

    return { response, error }
  }
  // setter(USER_ATOM, "id", response.id)
  return { response, error }
}

export default storeSet
