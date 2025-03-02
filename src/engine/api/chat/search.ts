import { getter, setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { CHAT_LIST_ATOM } from "engine/state"
import { produce } from "solid-js/store"

const chatSearch = async (options: Socket["chat.search"]["request"]) => {
  const { response, error } = await socketSend("chat.search", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  console.log({ response })

  const chatList = getter(CHAT_LIST_ATOM)
  if (Object.keys(chatList.history).length) {
    setter(
      CHAT_LIST_ATOM,
      "history",
      produce((history) => {
        history[response.dialog] = { uuid: response.dialog }
        return history
      }),
    )
  }

  return { response, error }
}

export default chatSearch
