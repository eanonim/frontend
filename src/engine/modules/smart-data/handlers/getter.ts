import { type AtomReturn } from "../types"
import getDefault from "../utils/getDefault"

const getter = <VALUE, OPTIONS>(
  signal: AtomReturn<VALUE, OPTIONS>,
  key: string | number = "default",
) => {
  const data = signal[0]

  return data.cache?.[key]?.data || getDefault(data.default)
}

export default getter
