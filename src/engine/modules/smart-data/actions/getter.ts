import { type AtomReturn, type Key } from "../types"
import getDefault from "../utils/getDefault"

const getter = <VALUE, OPTIONS, KEY extends string>(
  signal: AtomReturn<VALUE, OPTIONS, KEY>,
  key?: KEY,
) => {
  const data = signal[0]

  const cache = data?.cache?.[key ?? "default"]?.data
  if (cache) {
    const [getterData] = cache

    return getterData
  }

  return getDefault(data.default)
}

export default getter
