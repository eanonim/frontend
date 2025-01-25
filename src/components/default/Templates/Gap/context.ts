import { type Property } from "csstype"
import { createContext } from "solid-js"

const GapContext = createContext<{
  count: Property.Gap<(string & {}) | 0>
}>()

export default GapContext
