import { Socket, socketSend } from "../module"

const storeSet = async (options: Socket["store.set"]["request"]) => {
  options.value = String(options.value)
  const { response, error } = await socketSend("store.set", options)

  if (error) {
    console.log({ error })
    return { response, error }
  }

  // setter(USER_ATOM, "id", response.id)
  return { response, error }
}

export default storeSet
