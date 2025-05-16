import { Socket, socketSend } from "../module"
import { Chats } from "engine/class/useChat"

const messageEdit = async (options: Socket["message.edit"]["request"]) => {
  const chat = Chats.getById(options.dialog)
  const message = chat?.getMessageById(options.message.id)
  message?.setter("isEdit", true)
  message?.setter("isLoading", true)
  message?.setter("attach", options.message.attach)
  message?.setter("text", options.message.message)
  chat?.setMessage("editId", undefined)

  const { response, error } = await socketSend("message.edit", options)

  if (error) {
    return { response, error }
  }

  if (response.result) {
    message?.setter("isLoading", false)
  }

  // setter(CHAT_LIST_ATOM, response)

  return { response, error }
}

export default messageEdit
