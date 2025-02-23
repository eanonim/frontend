import { setter } from "engine/modules/smart-data"
import { Socket, SocketError, socketSend } from "../module"
import { MESSAGE_INFO_ATOM } from "engine/state"
import { produce } from "solid-js/store"
import { debounce } from "@solid-primitives/scheduled"

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
      setter(
        [MESSAGE_INFO_ATOM, options.dialog],
        produce((messages) => {
          const message = messages.history.get(options.message_id)
          if (message) {
            const [dialogIndex, groupMessagesIndex, messageIndex] =
              message.indexes
            if (
              messages.dialogs[dialogIndex][1][groupMessagesIndex][messageIndex]
            ) {
              messages.dialogs[dialogIndex][1][groupMessagesIndex][
                messageIndex
              ].readed = true
            }
          }

          messages.last_read_message_id = options.message_id

          return messages
        }),
      )
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

  return await new Promise((resolve) => {
    debounceMessageRead(resolve, options)
  })
}

export default messageRead
