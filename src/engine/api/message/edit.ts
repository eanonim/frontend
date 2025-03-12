import { getter, setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { CHAT_LIST_ATOM, MESSAGE_INFO_ATOM, USER_ATOM } from "engine/state"
import { produce } from "solid-js/store"
import { unlink } from "@minsize/utils"
import isEmoji from "engine/utils/isEmoji"

const messageEdit = async (options: Socket["message.edit"]["request"]) => {
  setter(
    [MESSAGE_INFO_ATOM, options.dialog],
    produce((messages) => {
      let message = unlink(messages.history.get(options.message.id))
      if (message) {
        message.loading = true
        message.message = options.message.message
        message.is_emoji = isEmoji(message.message)
        message.attach = options.message.attach
        messages.history.delete(options.message.id)
        messages.history.set(options.message.id, message)

        let [dialogIndex, groupMessagesIndex, messageIndex] = message.indexes
        messages.dialogs[dialogIndex][1][groupMessagesIndex][messageIndex] =
          message
      }

      const chatList = getter(CHAT_LIST_ATOM)
      if (!!chatList.history[options.dialog]) {
        setter(
          CHAT_LIST_ATOM,
          produce((chats) => {
            const chat = chats.history[options.dialog]
            if (
              chat &&
              chat.message?.id &&
              message &&
              chat.message?.id === message.id
            ) {
              chat.message.message = message.message
              chat.loading = true
            }
            return chats
          }),
        )
      }

      return messages
    }),
  )

  const { response, error } = await socketSend("message.edit", options)

  if (error) {
    console.log({ error })
    return { response, error }
  }

  if (response.result) {
    setter(
      [MESSAGE_INFO_ATOM, options.dialog],
      produce((messages) => {
        let message = unlink(messages.history.get(options.message.id))
        if (message) {
          message.loading = false
          messages.history.delete(options.message.id)
          messages.history.set(options.message.id, message)

          let [dialogIndex, groupMessagesIndex, messageIndex] = message.indexes
          messages.dialogs[dialogIndex][1][groupMessagesIndex][messageIndex] =
            message
        }

        const chatList = getter(CHAT_LIST_ATOM)
        if (!!chatList.history[options.dialog]) {
          setter(
            CHAT_LIST_ATOM,
            produce((chats) => {
              const chat = chats.history[options.dialog]
              if (
                chat &&
                chat.message?.id &&
                message &&
                chat.message.id === message.id
              ) {
                chat.loading = false
              }
              return chats
            }),
          )
        }

        return messages
      }),
    )
  }

  // setter(CHAT_LIST_ATOM, response)

  return { response, error }
}

export default messageEdit
