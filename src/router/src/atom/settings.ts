import { atom } from "elum-state/solid"

type SETTINGS = {
  pathname?: string
}

const SETTINGS_ATOM = atom<SETTINGS>({
  key: "FF_settings_atom",
  default: {
    pathname: "",
  },
})

export default SETTINGS_ATOM
