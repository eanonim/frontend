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
import { setHistory, setParams } from "../utils"
import { produce } from "solid-js/store"

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

  setParams({ pageId, params })
  setter(
    HISTORY_ATOM,
    produce((value) => {
      if (value.history.length >= 1) {
        value.history = value.history.slice(0, -1)
      }
      const [lastViewId, lastView] = Object.entries(value.view).sort(
        ([, a], [, b]) => b.index - a.index,
      )?.[0]

      if (lastView && lastViewId) {
        const index = value.view[lastViewId].array.indexOf(
          value.view[lastViewId].array[value.view[lastViewId].array.length - 1],
        )
        if (index !== -1) {
          value.view[lastViewId].array.splice(index, 1)
          const preLastView =
            value.view[lastViewId].array[
              value.view[lastViewId].array.length - 1
            ]
          if (preLastView) {
            setter(
              LAST_HISTORY_ATOM,
              produce((value) => {
                value[preLastView.viewId] = preLastView.panelId
                return Object.assign({ ...value })
              }),
            )
          }
        }
      }
      const newHistoryDefault: HISTORY["history"][0] = {
        viewId,
        panelId: page.panels[page.default],
        params: undefined,
        is_back: false,
      }

      if (!value.view[viewId]) {
        value.view[page.viewId] = {
          index: Object.values(value.view).length || 0,
          array: [newHistoryDefault],
        }
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

      console.log("replacePage", { value })
      return { ...value }
    }),
  )

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
