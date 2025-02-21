import { atom } from "engine/modules/smart-data"

import { chatList, storeList, storeOptions } from "engine/api"
import { Socket } from "engine/api/module"

export const CHAT_LIST_ATOM = atom<
  {
    history: Record<string, Socket["chat.list"]["response"][0]>
  },
  {}
>({
  default: {
    history: {},
  },
  onRequested: (options, key) => {
    chatList({})
  },
  updateIntervalMs: 60_000,
})
