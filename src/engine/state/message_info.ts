import { atom, setter } from "engine/modules/smart-data"

import { Socket } from "engine/api/module"
import { produce } from "solid-js/store"
import { CHAT_LIST_ATOM } from "./chat_list"

export const MESSAGE_INFO_ATOM = atom<
  {
    history: Socket["message.info"]["response"]
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
    history: [],
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
    // setter([MESSAGE_INFO_ATOM, key], "history", [
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    //   {
    //     id: 1,
    //     author: 2,
    //     message: "Test",
    //     time: new Date(Date.now() + 1_000),
    //   },
    // ])
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
