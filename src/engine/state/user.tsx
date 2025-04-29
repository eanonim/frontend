import { userEmojiSet, userGet, userNameSet } from "engine/api"
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
    first_name: "User",
    last_name: "",
    image: "https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE.jpg", //https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE.jpg
    emoji: 0,
    premium: new Date(Date.now() - 1_000),
    coin: 0,
    referrer_code: "",
  },
  updateIntervalMs: 15_000,
  onUpdate: async ({ prev, next }, key) => {
    if (key === "default") {
      if (next.emoji !== prev.emoji) {
        const { error } = await userEmojiSet({ emoji: next.emoji })
        return !!!error
      }
      if (
        next.first_name !== prev.first_name ||
        next.last_name !== prev.last_name
      ) {
        userNameSet({ first_name: next.first_name, last_name: next.last_name })
      }
    }
    return true
  },
  onRequested: async (options, key) => {
    userGet({})
  },
})
