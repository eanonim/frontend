import { userEmojiSet, userGet } from "engine/api"
import { Socket } from "engine/api/module"
import { atom } from "engine/modules/smart-data"

export const USER_ATOM = atom<
  Socket["user.get"]["response"],
  Socket["user.get"]["request"],
  "default" | "edit"
>({
  // onKey: (options) => {
  //   return String(options)
  // },
  default: {
    id: 1,
    first_name: "Иван",
    last_name: "Иванов",
    image: "https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE.jpg", //https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE.jpg
    emoji: 0,
    premium: new Date(Date.now() - 1_000),
  },
  updateIntervalMs: 15_000,
  onUpdate: ({ prev, next }, key) => {
    console.log({ prev, next }, key)
    if (key === "default") {
      if (next.emoji !== prev.emoji) {
        userEmojiSet({ emoji: next.emoji })
      }
    }
  },
  onRequested: async (options, key) => {
    userGet({})
  },
})
