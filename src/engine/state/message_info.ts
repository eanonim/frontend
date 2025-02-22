import { atom, setter } from "engine/modules/smart-data"
import { Socket } from "engine/api/module"
import { produce } from "solid-js/store"
import { CHAT_LIST_ATOM } from "./chat_list"

export const MESSAGE_INFO_ATOM = atom<
  {
    dialogs: [string, Socket["message.info"]["response"]][]
    history: Map<
      number,
      {
        dialog_index: number
        message_index: number
      } & Socket["message.info"]["response"][0]
    >
    last_read_message_id?: number
    message: {
      message: string
      reply_id?: number
      edit_id?: number
      typing?: boolean
    }
  },
  Socket["message.info"]["request"],
  string
>({
  onKey: (options) => {
    return options.dialog
  },
  default: {
    dialogs: [],
    history: new Map(),
    message: {
      message: "",
      typing: false,
    },
  },
  onUpdate: ({ prev, next }, key) => {
    console.log("onUpdate", key, { prev, next })
  },
  onRequested: (options, key) => {
    console.log("onRequested", key, options)
  },
  updateIntervalMs: 60_000,
})

let timer: Record<string, NodeJS.Timeout> = {}

export const setTyping = (dialog: string) => {
  setter(
    [MESSAGE_INFO_ATOM, dialog],
    "message",
    produce((message) => {
      message.typing = true

      return message
    }),
  )
  setter(CHAT_LIST_ATOM, "history", dialog, "typing", true)

  clearTimeout(timer[dialog])

  timer[dialog] = setTimeout(() => {
    setter(
      [MESSAGE_INFO_ATOM, dialog],
      "message",
      produce((message) => {
        message.typing = false

        return message
      }),
    )

    setter(CHAT_LIST_ATOM, "history", dialog, "typing", false)
  }, 5000)
}
