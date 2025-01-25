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
import { getLastPage, setHistory, setParams } from "../utils"

type Props = {
  viewId: string
  is_back?: boolean
  history?: boolean
}

const swipeView = ({
  viewId,
  is_back = false,
  history = true,
}: Props): boolean => {
  const view = getter(STRUCT_ATOM).find((a) => a.viewId === viewId)
  if (!view) {
    console.error("pageId is not found of struct.")
    return false
  }

  const activeView = getter(VIEW_ATOM)

  const pageId =
    activeView !== viewId ? getLastPage(viewId) || view.default : view.default

  const page = getter(STRUCT_ATOM).find((a) => a.panels[pageId])
  if (!page) {
    console.error("pageId 2 is not found of struct.", pageId)
    return false
  }

  const panelId = page.panels[pageId]

  let modalId = ""

  setter(HISTORY_ATOM, (value) => {
    const back_view = value.view?.[activeView]?.back_view
    if (back_view) {
      const lastPage = value.view[activeView].array?.slice(-1)?.[0]
      if (lastPage) {
        lastPage.is_back = false
        value.view[back_view].back_view = undefined
        value.view[back_view].back_panel_id = undefined
      }
    }

    const lastPage = value.view?.[activeView]?.array?.slice(-1)[0]

    if (lastPage?.popoutId) {
      const indexToRemove = value.view?.[activeView]?.array?.indexOf(lastPage)

      if (indexToRemove !== -1) {
        value.view?.[activeView]?.array?.splice(indexToRemove, 1)
      }
    }

    modalId = value.view[viewId]?.array?.slice(-1)?.[0]?.modalId || ""
    const newHistory: HISTORY["history"][0] = {
      viewId,
      panelId,
      modalId,
      is_back,
    }

    // value.history.push(newHistory)

    if (value.view[page.viewId]?.array?.length) {
      if (activeView === viewId) {
        value.view[page.viewId] = {
          index: Object.values(value.view).length || 0,
          array: [newHistory],
        }
      }
      // const last = value.view[page.viewId]?.array?.slice(-1)?.[0]
      // if (last) {
      //   last.is_back = is_back
      // }
      // value.view[page.viewId].push(newHistory)
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

  setParams({ pageId })

  setter(VIEW_ATOM, page.viewId)
  setter(PANEL_ATOM, page.panels[pageId])
  setter(POPOUT_ATOM, "")
  setter(MODAL_ATOM, modalId)

  setHistory({ pageId }, history)
  return true
}

export { swipeView }
