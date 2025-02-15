import { type AtomReturn, type Key } from "../types"
import getDefault from "../utils/getDefault"

const getter = <VALUE, OPTIONS, KEY extends string>(
  signal: AtomReturn<VALUE, OPTIONS, KEY>,
  key?: KEY,
) => {
  const data = signal[0]
  return data.cache?.[key ?? "default"]?.data || getDefault(data.default)
}

export default getter
