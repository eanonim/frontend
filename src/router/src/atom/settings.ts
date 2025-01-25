import { atom } from "elum-state/solid"

type SETTINGS = {
  pathname?: string
}

const SETTINGS_ATOM = atom<SETTINGS>({
  key: "settings_atom",
  default: {
    pathname: "",
  },
})

export default SETTINGS_ATOM
