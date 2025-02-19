import { atom } from "engine/modules/smart-data"

import { chatList, storeList, storeOptions } from "engine/api"
import { Socket } from "engine/api/module"

export const CHAT_LIST_ATOM = atom<Socket["chat.list"]["response"], {}>({
  default: [],
  onRequested: (options, key) => {
    chatList({})
  },
  updateIntervalMs: 60_000,
})
