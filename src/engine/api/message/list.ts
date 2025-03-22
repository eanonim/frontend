import { setter, setterStatus } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { addMessage, MESSAGE_INFO_ATOM } from "engine/state"
import { unlink } from "@minsize/utils"
import { produce } from "solid-js/store"

const messageList = async (
  options: Socket["message.list"]["request"],
  cbLoad?: () => void,
) => {
  if (!options.dialog) return
  const { response, error } = await socketSend("message.list", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }
  console.log({ response })
  cbLoad?.()
  if (!response) {
    setterStatus([MESSAGE_INFO_ATOM, options.dialog], { fullLoad: true })
  }

  setter(
    [MESSAGE_INFO_ATOM, options.dialog],
    produce((messages) => {
      if (options.offset === 0) {
        messages.dialogs = []
        messages.history = new Map()
      }

      if (response) {
        for (const message of response.reverse()) {
          addMessage(messages, message as any, "push")[0]
        }
        console.log({ messages })
        messages.last_offset += response.length
      }

      console.log({ messages, messages2: unlink(messages) })

      return messages
    }),
  )
  return { response, error }
}

export default messageList
