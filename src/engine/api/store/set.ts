import handlerError from "../handlerError"
import { Socket, socketSend } from "../module"
import storeList from "./list"

const storeSet = async (options: Socket["store.set"]["request"]) => {
  options.value = String(options.value)
  const { response, error } = await socketSend("store.set", options)

  if (error) {
    /**
     Добавить в state запись данных после ответа от сервера, и добавить в useAtomSystem статус fetch, что бы показывать loader или крестик
     */
    console.log({ error })
    storeList({})
    handlerError({ error_code: error.code, message: error.message })

    return { response, error }
  }
  console.log({ response })
  // setter(USER_ATOM, "id", response.id)
  return { response, error }
}

export default storeSet
