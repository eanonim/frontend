import { SetStoreFunction, Store } from "solid-js/store"
import { type System } from "./System"

export type SmartData<T> = {
  data: [get: Store<T>, set: SetStoreFunction<T>]

  update_at: Date
  system?: System
}
