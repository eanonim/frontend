import { getter, setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { MESSAGE_INFO_ATOM, USER_ATOM } from "engine/state"
import { produce } from "solid-js/store"
import { getFullDate } from "engine"
import { unlink } from "@minsize/utils"

const messageSend = async (options: Socket["message.send"]["request"]) => {
  const messageId = Math.random()
  let messageIndex = -1
  let dialogIndex = -1

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
        message_index: messageIndex,
        dialog_index: dialogIndex,
      }

      dialogIndex = messages.dialogs.findIndex((x) => x[0] === fullTime)
      if (dialogIndex !== -1) {
        messageIndex = messages.dialogs[dialogIndex][1].push(message) - 1
      } else {
        dialogIndex = messages.dialogs.push([fullTime, [message]]) - 1
        messageIndex = 0
      }
      messages.message.message = ""
      messages.message.reply_id = undefined

      message.dialog_index = dialogIndex
      message.message_index = messageIndex

      messages.history.set(message.id, message)

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
            if (messages.dialogs[dialogIndex][1][messageIndex]) {
              messages.dialogs[dialogIndex][1][messageIndex] = message
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
