import { type Drags } from "@ui/Types"

import { createContext } from "solid-js"

export const DropContext = createContext<{
  getDrag: (key: string) => Drags
  initDrag: (key: string, position: number, ref: HTMLElement) => void
  editPositionElement: (
    key: string,
    x: number,
    y: number,
  ) => { x: number; y: number }
  getActive: (key: string) => boolean
  getTransform: (key: string) => { y: number }
  onEnd: (key: string) => void
  getSettings: () => {
    block: {
      x: boolean
      safe: boolean
    }
    bounding: DOMRect
  }
}>()

export const TouchContext = createContext<{
  key: string
  position: number
}>()
