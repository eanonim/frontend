import { type SmartData } from "./SmartData"

export type SmartDataAtom<T, OPTIONS> = {
  default: T
  cache: Map<string, SmartData<T>>
  requests: Map<string, boolean>
  onRequested?: (
    onFinish: () => void,
    key: string | number,
    options: OPTIONS,
  ) => void
  update_via: number
}
