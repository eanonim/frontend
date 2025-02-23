import { getter, setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { addMessage, MESSAGE_INFO_ATOM, USER_ATOM } from "engine/state"
import { produce } from "solid-js/store"
import { getFullDate } from "engine"
import { unlink } from "@minsize/utils"
import { groupMessagesCount } from "root/configs"

const messageSend = async (options: Socket["message.send"]["request"]) => {
  const messageId = Math.random()
  let [dialogIndex, groupMessagesIndex, messageIndex] = [0, 0, 0]

  const time = new Date()
  const fullTime = getFullDate(time)

  setter(
    [MESSAGE_INFO_ATOM, options.dialog],
    produce((messages) => {
      const reply =
        !!messages.message.reply_id &&
        messages.history.get(messages.message.reply_id)

      const message = {
        loading: true,
        author: getter(USER_ATOM).id,
        id: messageId,
        message: options.message.message,
        reply: reply
          ? { id: reply.id, message: reply.message || "UNDEFINED" }
          : undefined,
        time: new Date(),
        indexes: [0, 0, 0] as [number, number, number],
      }

      const [_, indexes] = addMessage(messages, message)
      ;[dialogIndex, groupMessagesIndex, messageIndex] = indexes

      messages.message.message = ""
      messages.message.reply_id = undefined
      messages.message.edit_id = undefined

      return messages
    }),
  )

  const { response, error } = await socketSend("message.send", options)

  if (error) {
    console.log({ error })
    return { response, error }
  }

  if (response.result) {
    setter(
      [MESSAGE_INFO_ATOM, options.dialog],
      produce((messages) => {
        let message = unlink(messages.history.get(messageId))
        if (message) {
          message.id = response.id
          message.loading = false
          messages.history.set(response.id, message)
          messages.history.delete(messageId)

          message = messages.history.get(response.id)
          if (message) {
            if (
              messages.dialogs[dialogIndex][1][groupMessagesIndex][messageIndex]
            ) {
              console.log({
                f: messages.dialogs[dialogIndex][1][groupMessagesIndex][
                  messageIndex
                ],
              })

              messages.dialogs[dialogIndex][1][groupMessagesIndex][
                messageIndex
              ] = message
            }
          }
        }

        console.log({ messages: unlink(messages) })
        // console.log(unlink(messages))
        return messages
      }),
    )
  }

  // setter(CHAT_LIST_ATOM, response)

  return { response, error }
}

export default messageSend
