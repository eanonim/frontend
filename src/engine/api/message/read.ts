import { Socket, SocketError, socketSend } from "../module"
import { debounce } from "@solid-primitives/scheduled"
import { Chat } from "engine/class"
import { Chats } from "engine/class/useChat"

const debounceMessageRead = debounce(
  async (
    resolve: (
      value:
        | { error: SocketError; response: undefined }
        | { error: undefined; response: Socket["message.read"]["response"] },
    ) => void,
    options: Socket["message.read"]["request"],
  ) => {
    const { response, error } = await socketSend("message.read", options)
    if (error) {
      resolve({ response, error })
      return
    }

    if (response.result) {
      const chat = Chats.getById(options.dialog)
      const msg = chat?.getMessageById(options.message_id)
      msg?.setter("isRead", true)
    }

    resolve({ response, error })
    return
  },
  250,
)

let lastMessage: Record<string, number> = {}

const messageRead = async (options: Socket["message.read"]["request"]) => {
  if (options.message_id < (lastMessage[options.dialog] || 0)) {
    debounceMessageRead.clear()
  }
  lastMessage[options.dialog] = options.message_id

  return await new Promise<
    | { error: SocketError; response: undefined }
    | { error: undefined; response: Socket["message.read"]["response"] }
  >((resolve) => {
    debounceMessageRead(resolve, options)
  })
}

export default messageRead
