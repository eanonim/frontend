import { Socket, socketSend } from "../module"
import { Chats } from "engine/class/useChat"

const chatClose = async (options: Socket["chat.close"]["request"]) => {
  const { response, error } = await socketSend("chat.close", options)
  if (error) {
    return { response, error }
  }

  if (response) {
    const chat = Chats.getById(options.dialog)

    chat?.setter("isFavorites", false)
    chat?.setter("isDeleted", true)
  }

  return { response, error }
}

export default chatClose
