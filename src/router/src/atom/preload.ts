import { atom } from "elum-state/solid";

const PRELOAD_ATOM = atom<Record<string, () => Promise<unknown>>>({
  key: "preload_atom",
  default: {}
})

export default PRELOAD_ATOM