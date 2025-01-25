import { atom } from "elum-state/solid";
import { type Params } from "..";

const PARAMS_ATOM = atom<Record<string, Params>>({
  key: "params_atom",
  default: {}
})

export default PARAMS_ATOM