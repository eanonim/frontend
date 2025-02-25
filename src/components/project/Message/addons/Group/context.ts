import { createContext } from "solid-js"

type Context = {
  getScrollTop: () => number
  setVisible: (key: number, height: number) => void
  getIsVisible: (key: number) => void
}

const ContextGroup = createContext<Context>()
export default ContextGroup
