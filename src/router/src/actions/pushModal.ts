import { getter, setter } from "elum-state/solid"
import {
  HISTORY_ATOM,
  LAST_HISTORY_ATOM,
  MODAL_ATOM,
  POPOUT_ATOM,
  STRUCT_ATOM,
  VIEW_ATOM,
} from "../atom"
import { HISTORY } from "../atom/history"
import { getLastPage, setHistory, setParams } from "../utils"
import { routerParams } from "router/routerStruct"

const pushModal = <P extends routerParams, N extends keyof P>({
  modalId,
  params,
  is_back = true,
}: {
  modalId: NonNullable<N>
  params?: P[typeof modalId]
  is_back?: boolean
}): boolean => {
  const activeView = getter(VIEW_ATOM)

  const view = getter(STRUCT_ATOM).find((a) => a.viewId === activeView)
  if (!view) {
    console.error("pageId is not found of struct.")
    return false
  }

  const pageId = getLastPage(activeView) || view.default
  const page = getter(STRUCT_ATOM).find((a) => a.panels[pageId])
  if (!page) {
    console.error("pageId is not found of struct.")
    return false
  }

  const { viewId, panelId } = {
    viewId: page.viewId,
    panelId: page.panels[pageId],
  }

  setter(HISTORY_ATOM, (value) => {
    const newHistory: HISTORY["history"][0] = {
      viewId,
      panelId,
      modalId: String(modalId),
      params,
      is_back,
    }

    value.history.push(newHistory)

    if (value.view[page.viewId]) {
      value.view[page.viewId].array.push(newHistory)
    } else {
      value.view[page.viewId] = {
        index: Object.values(value.view).length || 0,
        array: [newHistory],
      }
    }

    return { ...value }
  })

  setter(LAST_HISTORY_ATOM, (value) => {
    value[page.viewId] = panelId
    return Object.assign({ ...value })
  })

  setParams({ modalId: String(modalId), params })

  setter(MODAL_ATOM, String(modalId))

  setter(POPOUT_ATOM, "")

  setHistory({ pageId, modalId: String(modalId), params })
  return true
}

export { pushModal }
