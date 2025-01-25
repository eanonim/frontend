import { atom } from "elum-state/solid";

const LAST_HISTORY_ATOM = atom<Record<string, string>>({
  key: "last_history_atom",
  default: {}
})

export default LAST_HISTORY_ATOM