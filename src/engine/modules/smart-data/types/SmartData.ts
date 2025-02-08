import { type System } from "./System"

export type SmartData<T> = {
  data: T

  update_at: Date
  system?: System
}
