import { Chats } from "engine/class/useChat"
import { Socket, socketSend } from "../module"

const messageComplaint = async (
  options: Socket["message.complaint"]["request"],
) => {
  const { response, error } = await socketSend("message.complaint", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  if (response.result) {
    const chat = Chats.getById(options.dialog)
    chat?.setter("isDeleted", true)
    chat?.setter("isFavorites", false)
  }

  return { response, error }
}

export default messageComplaint
