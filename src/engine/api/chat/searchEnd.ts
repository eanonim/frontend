import { Socket, socketSend } from "../module"

const chatSearchEnd = async (options: Socket["chat.searchEnd"]["request"]) => {
  const { response, error } = await socketSend("chat.searchEnd", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  return { response, error }
}

export default chatSearchEnd
