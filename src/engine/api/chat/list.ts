import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { CHAT_LIST_ATOM } from "engine/state"

const chatList = async (options: Socket["chat.list"]["request"]) => {
  const { response, error } = await socketSend("chat.list", options)
  if (error) {
    return { response, error }
  }

  let newResponse: Record<string, Socket["chat.list"]["response"][0]> = {}

  for (const chat of response ?? []) {
    newResponse[chat.uuid] = chat
  }

  setter(CHAT_LIST_ATOM, "history", newResponse)

  return { response, error }
}

export default chatList
