import { atom } from "elum-state/solid";

const VIEW_ATOM = atom<string>({
  key: "view_atom",
  default: ""
})

export default VIEW_ATOM