import { getter, setter } from "elum-state/solid"
import { Params } from ".."
import {
  HISTORY_ATOM,
  LAST_HISTORY_ATOM,
  PANEL_ATOM,
  STRUCT_ATOM,
  VIEW_ATOM,
} from "../atom"
import { HISTORY } from "../atom/history"
import { setHistory } from "../utils"

type Props<P extends Params> = {
  pageId: string
  params?: P
  is_back?: boolean
}

const replacePage = <P extends unknown>({
  pageId,
  params,
  is_back = false,
}: Props<P>): boolean => {
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
    if (value.history.length >= 1) {
      value.history = value.history.slice(0, -1)
    }
    const newHistory: HISTORY["history"][0] = {
      viewId,
      panelId,
      params,
      is_back,
    }

    value.history.push(newHistory)

    if (value.view[viewId]) {
      value.view[viewId].array.push(newHistory)
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

  setter(VIEW_ATOM, viewId)
  setter(PANEL_ATOM, panelId)

  setHistory({
    pageId,
    params,
  })
  return true
}

export { replacePage }
