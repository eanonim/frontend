import { atom } from "elum-state/solid";

const POPOUT_ATOM = atom<string>({
  key: "popout_atom",
  default: undefined
})

export default POPOUT_ATOM