import { createSmartData, smartDataAtom } from "engine/modules/smart-data"

export const USER_ATOM = smartDataAtom({
  key: "user_atom",
  default: {
    id: 1,
    first_name: "Иван",
    last_name: "Иванов",
    photo: "https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE.jpg",
  },
})
