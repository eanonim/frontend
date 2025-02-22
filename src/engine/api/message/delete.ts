import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { MESSAGE_INFO_ATOM } from "engine/state"
import { produce } from "solid-js/store"
import { getFullDate } from "engine"
import { unlink } from "@minsize/utils"

const messageDelete = async (options: Socket["message.delete"]["request"]) => {
  const edit = (status: boolean) =>
    setter(
      [MESSAGE_INFO_ATOM, options.dialog],
      produce((messages) => {
        const message = unlink(messages.history.get(options.message_id))
        if (message) {
          if (
            messages.dialogs[message.dialog_index][1][message.message_index]
          ) {
            messages.dialogs[message.dialog_index][1][
              message.message_index
            ].deleted = status
          }
        }
        return messages
      }),
    )
  edit(true)

  const { response, error } = await socketSend("message.delete", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  if (!response.result) {
    edit(false)
  }

  console.log({ response })

  // setter(CHAT_LIST_ATOM, response)

  return { response, error }
}

export default messageDelete
