import { getter, setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { MESSAGE_INFO_ATOM, USER_ATOM } from "engine/state"
import { produce } from "solid-js/store"

const messageSend = async (options: Socket["message.send"]["request"]) => {
  console.log("message.send [OPTIONS]", options)
  const messageId = Math.random()
  setter(
    [MESSAGE_INFO_ATOM, options.dialog],
    produce((messages) => {
      const reply = messages.history.find(
        (x) => x.id === messages.message.reply_id,
      )

      messages.history.push({
        loading: true,
        author: getter(USER_ATOM).id,
        id: messageId,
        message: options.message.message,
        reply: reply
          ? { id: reply.id, message: reply.message || "UNDEFINED" }
          : undefined,
        time: new Date(),
      })

      messages.message.message = ""
      messages.message.reply_id = undefined

      return messages
    }),
  )

  const { response, error } = await socketSend("message.send", options)

  if (error) {
    console.log({ error })
    return { response, error }
  }

  console.log({ response })

  if (response.result) {
    setter(
      [MESSAGE_INFO_ATOM, options.dialog],
      produce((messages) => {
        const message = messages.history.find((x) => x.id === messageId)
        if (message) {
          message.id = response.id // new message id
          message.loading = false
        }

        return messages
      }),
    )
  }

  // setter(CHAT_LIST_ATOM, response)

  return { response, error }
}

export default messageSend
