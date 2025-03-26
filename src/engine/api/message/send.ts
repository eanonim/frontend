import { Socket, socketSend } from "../module"
import { Chats } from "engine/class/useChat"

const messageSend = async (options: Socket["message.send"]["request"]) => {
  const messageId = Math.random()
  const chat = Chats.getById(options.dialog)

  const message = chat?.newMessage({
    id: messageId,
    isLoading: true,
    target: "my",
    text: options.message.message,
    replyId: options.message.reply_id,
    time: new Date(),
    attach: options.message.attach,
    type: "default",
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
