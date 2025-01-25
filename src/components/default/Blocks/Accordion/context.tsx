import { createContext } from "solid-js"

export const AccordionStore = createContext<{
  status?: () => boolean
  onChange?: () => void
}>({})

export const AccordionStoreList = createContext<{
  status?: (uId: string) => boolean
  onChange?: (uId: string) => boolean
}>({})
