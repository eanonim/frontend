import { Socket, socketSend } from "../module"
import { Chats } from "engine/class/useChat"

const messageSend = async (options: Socket["message.send"]["request"]) => {
  const messageId = Math.random()
  const chat = Chats.getById(options.dialog)

  const messageReply = chat?.getMessageById(options.message.reply_id)

  const message = chat?.newMessage({
    id: messageId,
    isLoading: true,
    target: "my",
    text: options.message.message,
    reply: messageReply
      ? { id: messageReply.id, message: messageReply.text || "UNDEFINED" }
      : undefined,
    time: new Date(),
    attach: options.message.attach,
  })

  const { response, error } = await socketSend("message.send", options)

  if (error) {
    console.log({ error })
    return { response, error }
  }

  if (response.result) {
    message?.setter("id", response.id)
    message?.setter("isLoading", false)
  }

  return { response, error }
}

export default messageSend
