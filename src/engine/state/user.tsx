import { userGet } from "engine/api"
import { Socket } from "engine/api/module"
import { atom } from "engine/modules/smart-data"

export const USER_ATOM = atom<
  Socket["user.get"]["response"],
  Socket["user.get"]["request"],
  "default"
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
    premium: false,
  },
  updateIntervalMs: 15_000,
  onRequested: async (options, key) => {
    userGet({})
  },
})
