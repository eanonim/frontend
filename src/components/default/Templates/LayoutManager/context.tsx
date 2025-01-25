import { type Component, createContext } from "solid-js"

export const LayoutManagerStore = createContext<{
  getChild?: (type: "first" | "last") =>
    | {
        nav: string
        component: Component
      }
    | undefined
  onAnimationEnd?: (type: "first" | "last") => void
  getAnim?: () => boolean
  styleIndex?: (type: "first" | "last") =>
    | {
        [k: string]: boolean | undefined
      }
    | undefined
}>({})
