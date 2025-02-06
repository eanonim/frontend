import { atom, setter } from "engine/modules/smart-data"

export const TEST_ATOM = atom({
  default: {
    user: {
      first_name: "Иван",
      last_name: "Иванов",
      icon: {
        id: 1,
      },
    },
  },
  // onRequested: (finish) => {
  //   setTimeout(() => {
  //     setter(TEST_ATOM, "user", "first_name", "Егор")
  //     console.log("FINISH")
  //   }, 4000)
  //   setTimeout(() => {
  //     setter(TEST_ATOM, "user", "first_name", "Егор2")
  //     console.log("FINISH 2")
  //   }, 8000)
  // },
})
