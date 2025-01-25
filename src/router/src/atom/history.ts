import { atom } from "elum-state/solid"
import { type Params } from ".."

type View = {
  viewId: string
  panelId: string
  is_back: boolean
  /**
   * passed parameters
   */
  params?: Params
  /**
   * Open is ModalPage
   */
  modalId?: string
  popoutId?: string
}

export type HISTORY = {
  view: Record<
    string,
    {
      index: number
      array: View[]
      back_view?: string
      back_panel_id?: string
    }
  >
  history: View[]
}

const HISTORY_ATOM = atom<HISTORY>({
  key: "history_atom",
  default: {
    view: {},
    history: [],
  },
})

export default HISTORY_ATOM
