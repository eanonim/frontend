import { Socket, socketSend } from "../module"

const messageTyping = async (options: Socket["message.typing"]["request"]) => {
  const { response, error } = await socketSend("message.typing", options)
  if (error) {
    return { response, error }
  }

  // setter(CHAT_LIST_ATOM, response)

  return { response, error }
}

export default messageTyping
