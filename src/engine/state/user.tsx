import { atom, setter } from "engine/modules/smart-data"

type User = {
  id: number
  first_name: string
  last_name: string
  photo: string
}

type Request = {
  user: number
}

export const USER_ATOM = atom<User, Request>({
  default: {
    id: 1,
    first_name: "Иван",
    last_name: "Иванов",
    photo: "https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE.jpg", //https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE.jpg
  },
  onRequested: (options, key) => {
    setTimeout(() => {
      setter([USER_ATOM, key], "photo", "")
      console.log("END 2")
    }, 5000)
  },
})
