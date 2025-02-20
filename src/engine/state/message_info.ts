import { atom } from "engine/modules/smart-data"

import { Socket } from "engine/api/module"

export const MESSAGE_INFO_ATOM = atom<
  {
    history: Socket["message.info"]["response"]
    message: {
      message: string
      reply_id?: number
      edit_id?: number
    }
  },
  Socket["message.info"]["request"],
  string
>({
  onKey: (options) => {
    return options.dialog
  },
  default: {
    history: [
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
      {
        id: 1,
        author: 2,
        message: "Test",
        time: new Date(Date.now() + 1_000),
      },
    ],
    message: {
      message: "",
    },
  },
  // onRequested: (options, key) => {},
  updateIntervalMs: 60_000,
})
