import { createContext } from "solid-js"

type Context = {
  getVisible: () => boolean
}

const ContextList = createContext<Context>()
export default ContextList
