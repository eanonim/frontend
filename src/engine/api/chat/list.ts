import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { CHAT_LIST_ATOM } from "engine/state"

const chatList = async (options: Socket["chat.list"]["request"]) => {
  const { response, error } = await socketSend("chat.list", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  console.log({ response })

  setter(CHAT_LIST_ATOM, response)

  return { response, error }
}

export default chatList
