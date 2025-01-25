import { atom } from "elum-state/solid";

const MODAL_ATOM = atom<string>({
  key: "modal_atom",
  default: ""
})

export default MODAL_ATOM