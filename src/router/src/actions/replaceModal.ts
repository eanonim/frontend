import { getter, setter } from "elum-state/solid"
import { Params } from ".."
import {
  HISTORY_ATOM,
  LAST_HISTORY_ATOM,
  MODAL_ATOM,
  PANEL_ATOM,
  STRUCT_ATOM,
  VIEW_ATOM,
} from "../atom"
import { HISTORY } from "../atom/history"
import { getLastPage, setHistory, setParams } from "../utils"
import { routerParams } from "router/routerStruct"

const replaceModal = <P extends routerParams, N extends keyof P>({
  modalId,
  params,
  is_back = true,
}: {
  modalId: NonNullable<N>
  params?: P[typeof modalId]
  is_back?: boolean
}): boolean => {
  const _modalId = String(modalId)

  const pageId = getLastPage(getter(VIEW_ATOM))

  if (pageId) {
    setter(HISTORY_ATOM, (value) => {
      if (value.history.length >= 1) {
        value.history = value.history.slice(0, -1)
      }

      const old = value.view[getter(VIEW_ATOM)].array?.slice(-1)?.[0]

      if (old) {
        old.modalId = _modalId
        old.params = old.params
        old.is_back = old.is_back
      }
      return { ...value }
    })

    setter(MODAL_ATOM, _modalId)

    setParams({
      modalId: _modalId,
      params,
    })

    setHistory({
      pageId,
      modalId: _modalId,
      params,
    })
  }
  return true
}

export { replaceModal }
