import { getter, setter } from "elum-state/solid"
import { Params } from ".."
import {
  HISTORY_ATOM,
  LAST_HISTORY_ATOM,
  MODAL_ATOM,
  PANEL_ATOM,
  POPOUT_ATOM,
  STRUCT_ATOM,
  VIEW_ATOM,
} from "../atom"
import { HISTORY } from "../atom/history"
import { setHistory, setParams } from "../utils"

type Props<P extends Params> = {
  pageId: string
  params?: P
  is_back?: boolean
  handler?: () => Promise<boolean>
}

const pushPage = <P extends Params>({
  pageId,
  params,
  is_back = true,
  handler,
}: Props<P>): boolean => {
  const page = getter(STRUCT_ATOM).find((a) => a.panels[pageId])
  if (!page) {
    console.error("pageId is not found of struct.")
    return false
  }

  setParams({ pageId, params })
  const lastView = getter(VIEW_ATOM)

  const { viewId, panelId } = {
    viewId: page.viewId,
    panelId: page.panels[pageId],
  }

  setter(HISTORY_ATOM, (value) => {
    const newHistory: HISTORY["history"][0] = {
      viewId,
      panelId,
      params,
      is_back,
      handler,
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
      } else {
        isTest.is_back = is_back
        isTest.params = params
      }

      if (lastView !== viewId && is_back) {
        value.view[page.viewId].back_view = lastView
        value.view[page.viewId].back_panel_id =
          value.view[page.viewId]?.array?.slice(-1)?.[0].panelId
      }
    } else {
      value.view[page.viewId] = {
        index: Object.values(value.view).length || 0,
        array: [newHistory],
      }
      if (lastView !== viewId && is_back) {
        value.view[page.viewId].back_view = lastView
        value.view[page.viewId].back_panel_id =
          value.view[page.viewId]?.array?.slice(-1)?.[0].panelId
      }
    }

    return { ...value }
  })

  setter(LAST_HISTORY_ATOM, (value) => {
    value[page.viewId] = panelId
    return Object.assign({ ...value })
  })

  setter(VIEW_ATOM, page.viewId)
  setter(PANEL_ATOM, page.panels[pageId])
  setter(POPOUT_ATOM, "")
  setter(MODAL_ATOM, "")

  setHistory({ pageId, params })
  return true
}

export { pushPage }
