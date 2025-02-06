import { type SetStoreFunction } from "solid-js/store"
import { type AtomValue } from "./AtomValue"

export type AtomReturn<VALUE, OPTIONS> = [
  get: AtomValue<VALUE, OPTIONS>,
  set: SetStoreFunction<AtomValue<VALUE, OPTIONS>>,
]
