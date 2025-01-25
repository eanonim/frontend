import { getter, setter } from "elum-state/solid"
import { Params } from ".."
import {
  HISTORY_ATOM,
  LAST_HISTORY_ATOM,
  MODAL_ATOM,
  PARAMS_ATOM,
  POPOUT_ATOM,
  STRUCT_ATOM,
  VIEW_ATOM,
} from "../atom"
import { HISTORY } from "../atom/history"
import { getLastPage, setHistory, setParams } from "../utils"

type Props<P extends Params> = {
  popoutId: string
  params?: P
  is_back?: boolean
}

const pushPopout = <P extends Params>({
  popoutId,
  params,
  is_back = true,
}: Props<P>): boolean => {
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
      modalId: value.view[page.viewId]?.array?.slice(-1)?.[0]?.modalId || "",
      popoutId,
      params,
      is_back,
    }

    value.history.push(newHistory)

    if (value.view[page.viewId]) {
      const isTest = value.view[page.viewId].array.find(
        (x) =>
          x.viewId === viewId &&
          x.modalId === newHistory.modalId &&
          x.popoutId === newHistory.popoutId &&
          x.panelId === newHistory.panelId,
      )
      if (!isTest) {
        value.view[page.viewId].array.push(newHistory)
      }
    } else {
      value.view[page.viewId] = {
        index: Object.values(value.view).length || 0,
        array: [newHistory],
      }
    }

    return value
  })

  setParams({
    popoutId,
    params,
  })

  setter(POPOUT_ATOM, popoutId)

  setHistory({ pageId, popoutId, params })
  return true
}

export { pushPopout }
