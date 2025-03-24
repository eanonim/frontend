import { getter, setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import {
  addMessage,
  CHAT_LIST_ATOM,
  Message,
  MESSAGE_INFO_ATOM,
} from "engine/state"
import { produce } from "solid-js/store"
import { unlink } from "@minsize/utils"

const messageSend = async (options: Socket["message.send"]["request"]) => {
  const messageId = Math.random()
  let [dialogIndex, groupMessagesIndex, messageIndex] = [0, 0, 0]

  setter(
    [MESSAGE_INFO_ATOM, options.dialog],
    produce((messages) => {
      const reply =
        !!messages.message.reply_id &&
        messages.history.get(messages.message.reply_id)

      const message: Message = {
        loading: true,
        target: "my",
        id: messageId,
        message: options.message.message,
        reply: reply
          ? { id: reply.id, message: reply.message || "UNDEFINED" }
          : undefined,
        time: new Date(),
        indexes: [0, 0, 0] as [number, number, number],
        readed: false,
        deleted: false,
      }

      const chatList = getter(CHAT_LIST_ATOM)
      if (!!chatList.history[options.dialog]) {
        setter(
          CHAT_LIST_ATOM,
          produce((chats) => {
            const chat = chats.history[options.dialog]
            if (chat && message) {
              chat.message = message
              chat.loading = true
              chat.typing = false
            }
            return chats
          }),
        )
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

          messages.last_message_id = message.id

          message = messages.history.get(response.id)
          if (message) {
            if (
              messages.dialogs[dialogIndex][1][groupMessagesIndex][messageIndex]
            ) {
              messages.dialogs[dialogIndex][1][groupMessagesIndex][
                messageIndex
              ] = message
            }

            const chatList = getter(CHAT_LIST_ATOM)
            if (!!chatList.history[options.dialog]) {
              setter(
                CHAT_LIST_ATOM,
                produce((chats) => {
                  const chat = chats.history[options.dialog]
                  if (chat && chat.message && message) {
                    chat.message.id = message.id
                    chat.loading = false
                  }
                  return chats
                }),
              )
            }
          }
        }

        return messages
      }),
    )
  }

  // setter(CHAT_LIST_ATOM, response)

  return { response, error }
}

export default messageSend
