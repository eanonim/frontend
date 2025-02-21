import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { MESSAGE_INFO_ATOM } from "engine/state"
import { produce } from "solid-js/store"

const messageDelete = async (options: Socket["message.delete"]["request"]) => {
  setter(
    [MESSAGE_INFO_ATOM, options.dialog],
    "history",
    produce((history) => {
      const message = history.find((x) => x.id === options.message_id)

      if (message) {
        message.deleted = true
      }
      return history
    }),
  )

  const { response, error } = await socketSend("message.delete", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  if (!response.result) {
    setter(
      [MESSAGE_INFO_ATOM, response.dialog],
      "history",
      produce((history) => {
        const message = history.find((x) => x.id === options.message_id)

        if (message) {
          message.deleted = false
        }
        return history
      }),
    )
  }

  console.log({ response })

  // setter(CHAT_LIST_ATOM, response)

  return { response, error }
}

export default messageDelete
