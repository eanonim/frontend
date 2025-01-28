import { atom } from "elum-state/solid"

export const KEYBOARD_ATOM = atom({
  key: "keyboard_atom",
  default: {
    open: false,
    touch: false,
  },
})
