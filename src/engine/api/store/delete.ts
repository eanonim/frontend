import { Socket, socketSend } from "../module"

const storeDelete = async (options: Socket["store.delete"]["request"]) => {
  const { response, error } = await socketSend("store.delete", {
    ...{ value: String(options.value) },
    ...options,
  })

  return { response, error }
}

export default storeDelete
