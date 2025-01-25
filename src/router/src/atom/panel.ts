import { atom } from "elum-state/solid"

const PANEL_ATOM = atom<string>({
  key: "panel_atom",
  default: ""
})

export default PANEL_ATOM