import { createContext } from "solid-js"

type Context = {
  getScrollTop: () => number
  setVisible: (key: number, height: number) => void
  getIsVisible: (key: number) => boolean
}

const ContextGroup = createContext<Context>()
export default ContextGroup
