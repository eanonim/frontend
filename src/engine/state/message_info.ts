import { atom } from "engine/modules/smart-data"

import { Socket } from "engine/api/module"

export const MESSAGE_INFO_ATOM = atom<
  Socket["message.info"]["response"],
  Socket["message.info"]["request"],
  string
>({
  onKey: (options) => {
    return options.dialog
  },
  default: [
    {
      id: 1,
      author: 1,
      message: "Test",
      time: new Date(Date.now() + 1_000),
    },
  ],
  // onRequested: (options, key) => {},
  updateIntervalMs: 60_000,
})
