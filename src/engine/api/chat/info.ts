import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { CHAT_LIST_ATOM } from "engine/state"
import { produce } from "solid-js/store"

const chatInfo = async (options: Socket["chat.info"]["request"]) => {
  const { response, error } = await socketSend("chat.info", options)
  if (error) {
    return { response, error }
  }

  setter(
    CHAT_LIST_ATOM,
    "history",
    produce((history) => {
      if (!history[response.uuid]) {
        history[response.uuid] = response
      }

      return history
    }),
  )

  // let newResponse: Record<string, Socket["chat.list"]["response"][0]> = {}

  // for (const chat of response ?? []) {
  //   newResponse[chat.uuid] = chat
  // }

  // setter(CHAT_LIST_ATOM, "history", newResponse)

  return { response, error }
}

export default chatInfo
