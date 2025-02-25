import { createContext } from "solid-js"

type Context = {
  getHeight: () => number
}

const ContextList = createContext<Context>()
export default ContextList
