import { atom } from "elum-state/solid"

export const AUTH_TOKEN_ATOM = atom({
  key: "auth_atom_token",
  default: "",
})
