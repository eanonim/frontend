import { type SetStoreFunction } from "solid-js/store"
import { type AtomValue } from "./AtomValue"

export type AtomReturn<VALUE, OPTIONS, KEY> = [
  get: AtomValue<VALUE, OPTIONS, KEY>,
  set: SetStoreFunction<AtomValue<VALUE, OPTIONS, KEY>>,
]
