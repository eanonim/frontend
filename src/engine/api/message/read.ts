import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { MESSAGE_INFO_ATOM } from "engine/state"
import { produce } from "solid-js/store"

const messageRead = async (options: Socket["message.read"]["request"]) => {
  const { response, error } = await socketSend("message.read", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  if (response.result) {
    setter(
      [MESSAGE_INFO_ATOM, options.dialog],
      "history",
      produce((history) => {
        const message = history.find((x) => x.id === options.message_id)
        if (message) {
          message.readed = true

          for (const item of history.filter((x) => x.id <= message.id)) {
            item.readed = true
          }
        }

        return history
      }),
    )
  }

  console.log({ response })

  // setter(CHAT_LIST_ATOM, response)

  return { response, error }
}

export default messageRead
