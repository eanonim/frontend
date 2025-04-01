import { Socket, socketSend } from "../module"
import { Chats } from "engine/class/useChat"

const chatClose = async (options: Socket["chat.close"]["request"]) => {
  console.log({ options })
  const { response, error } = await socketSend("chat.close", options)
  if (error) {
    console.log({ error })
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
