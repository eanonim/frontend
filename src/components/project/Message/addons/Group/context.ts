import { createContext } from "solid-js"

type Context = {
  getScrollTop: () => number
  setVisible: (key: number, value: boolean) => void
  getIsVisible: (key: number) => void
}

const ContextGroup = createContext<Context>()
export default ContextGroup
