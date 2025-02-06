import { atom, setter } from "engine/modules/smart-data"

export const USER_ATOM = atom({
  default: {
    id: 1,
    first_name: "Иван",
    last_name: "Иванов",
    photo: "", //https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE.jpg
  },
  onRequested: () => {
    setTimeout(() => {
      setter(
        USER_ATOM,
        "photo",
        "https://pbs.twimg.com/media/Fn5qjz9WQAAXUgE.jpg",
      )
      console.log("END 2")
    }, 5000)
  },
})
