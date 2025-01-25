import { type Platform } from "@ui/Types"
import { createContext } from "solid-js"

export const CellStore = createContext<{
  getPlatform: () => Platform
  isSeparator: () => boolean
  getStyle: () => {
    container: string
    content: string
    separator: string
    before: string
    after: string
  }
}>({
  getPlatform: () => "others" as Platform,
  isSeparator: () => false,
  getStyle: () => ({
    container: "",
    content: "",
    separator: "",
    before: "",
    after: "",
  }),
})
