import { createContext } from "solid-js"

type Context = {
  getSelected: (key: string) => boolean
  setSelected: (key: string, status: boolean) => void
  getAnimation: () => boolean
}

const SegmentedControlContext = createContext<Context>()

export default SegmentedControlContext
