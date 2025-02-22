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
      produce((messages) => {
        const message = messages.history.get(options.message_id)
        if (message) {
          if (
            messages.dialogs[message.dialog_index][1][message.message_index]
          ) {
            messages.dialogs[message.dialog_index][1][
              message.message_index
            ].readed = true
          }
        }

        messages.last_read_message_id = options.message_id

        return messages
      }),
    )
  }

  console.log({ response })

  // setter(CHAT_LIST_ATOM, response)

  return { response, error }
}

export default messageRead
