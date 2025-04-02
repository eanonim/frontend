import { getter, setter } from "elum-state/solid"
import { debounce, leading } from "@solid-primitives/scheduled"
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
import { setHistory, setParams } from "../utils"
import { bridgeClose, bridgeSessionStorageSet } from "@apiteam/twa-bridge/solid"
import { unlink } from "@minsize/utils"

const backPage = leading(
  debounce,
  async (backIndex: number = 1): Promise<boolean> => {
    // if (backIndex - 1) {
    //   window.history.go((backIndex - 1) * -1)
    // }
    const history = getter(HISTORY_ATOM)
    const activeView = getter(VIEW_ATOM)

    const lastView = history.view[activeView].array.slice(-1)?.[0]
    if (lastView && !!lastView.handler) {
      const status = await lastView.handler()
      if (!status) return false
    }

    if (activeView) {
      let back_view

      const lastPage = history.view[activeView]?.array?.slice(-1)?.[0]
      if (
        !!history.view[activeView].back_view &&
        lastPage?.panelId === history.view[activeView].back_panel_id &&
        !!!lastPage?.modalId
      ) {
        back_view = history.view[activeView].back_view
      }

      let lastView = history.view[back_view || activeView]?.array?.slice(
        back_view ? -1 : -2,
      )[0]

      if (!!lastView?.popoutId) {
        backIndex++
        lastView = history.view[back_view || activeView]?.array?.slice(
          back_view ? -2 : -3,
        )[0]
      }

      if (!!lastView?.modalId) {
        // backIndex++
        lastView = history.view[back_view || activeView]?.array?.slice(
          back_view ? -2 : -3,
        )[0]
      }

      if (!lastView) {
        console.error("lastView is not found of struct.")
        bridgeSessionStorageSet({
          key: "router_history",
          value: undefined,
        })

        bridgeSessionStorageSet({
          key: "router_last_view",
          value: undefined,
        })
        window.location.reload()
        bridgeClose()
        return false
      }
      const struct = getter(STRUCT_ATOM)

      const view = struct.find((a) => a.viewId === lastView.viewId)
      if (!view) {
        console.error("view is not found of struct.")
        return false
      }

      const foundPage = Object.entries(view.panels).find(
        ([_, panelId]) => panelId === lastView.panelId,
      )
      if (!foundPage) {
        console.error("foundPage is not found of struct.")
        return false
      }

      const pageId = foundPage[0]

      const page = struct.find((a) => a.panels[pageId])
      if (!page) {
        console.error("page is not found of struct.")
        return false
      }

      const { viewId, panelId } = {
        viewId: page.viewId,
        panelId: page.panels[pageId],
      }

      setter(HISTORY_ATOM, (value) => {
        if (backIndex && history.view[activeView].array.length >= 1) {
          value.history = value.history.slice(0, backIndex * -1)

          history.view[activeView].array = history.view[activeView].array.slice(
            0,
            backIndex * -1,
          )
        }

        return { ...value }
      })

      setter(LAST_HISTORY_ATOM, (value) => {
        value[viewId] = panelId
        return Object.assign({ ...value })
      })

      if (back_view) {
        history.view[back_view].back_view = undefined
        history.view[back_view].back_panel_id = undefined
      }

      // setParams({
      //   popoutId: lastView.popoutId,
      //   modalId: lastView.modalId,
      //   pageId,
      //   params: lastView.params,
      // })

      setter(VIEW_ATOM, viewId)
      setter(PANEL_ATOM, panelId)
      setter(MODAL_ATOM, lastView.modalId)
      setter(POPOUT_ATOM, lastView.popoutId)

      setHistory({
        pageId: pageId,
        modalId: lastView.modalId,
        popoutId: lastView.popoutId,
        params: lastView.params,
      })
      return true
    }
    return false

    // const lastView = history.history.slice(-2)[0]
    // if (!lastView) {
    //   console.error("pageId is not found of struct.")
    //   return false
    // }

    // const struct = getter(STRUCT_ATOM)

    // const view = struct.find((a) => a.viewId === lastView.viewId)
    // if (!view) {
    //   console.error("pageId is not found of struct.")
    //   return false
    // }

    // const foundPage = Object.entries(view.panels).find(
    //   ([_, panelId]) => panelId === lastView.panelId,
    // )
    // if (!foundPage) {
    //   console.error("pageId is not found of struct.")
    //   return false
    // }

    // const pageId = foundPage[0]

    // const page = struct.find((a) => a.panels[pageId])
    // if (!page) {
    //   console.error("pageId is not found of struct.")
    //   return false
    // }

    // const { viewId, panelId } = {
    //   viewId: page.viewId,
    //   panelId: page.panels[pageId],
    // }

    // setHistory({
    //   pageId: pageId,
    //   modalId: lastView.modalId,
    //   popoutId: lastView.popoutId,
    //   params: lastView.params,
    // })

    // setter(HISTORY_ATOM, (value) => {
    //   if (backIndex && value.history.length >= 1) {
    //     value.history = value.history.slice(0, backIndex * -1)
    //   }

    //   return { ...value }
    // })

    // setter(LAST_HISTORY_ATOM, (value) => {
    //   value[viewId] = panelId
    //   return Object.assign({ ...value })
    // })

    // setter(PARAMS_ATOM, (value) => {
    //   value["all"] = lastView.params
    //   if (!!lastView.popoutId) {
    //     value[`popout=${lastView.popoutId}`] = lastView.params
    //   } else if (!!lastView.modalId) {
    //     value[`modal=${lastView.modalId}`] = lastView.params
    //   } else if (!!pageId) {
    //     value[`page=${pageId}`] = lastView.params
    //   }
    //   return Object.assign({ ...value })
    // })

    // setter(VIEW_ATOM, viewId)
    // setter(PANEL_ATOM, panelId)
    // setter(MODAL_ATOM, lastView.modalId)
    // setter(POPOUT_ATOM, lastView.popoutId)

    // return true
  },
  500,
)

export { backPage }
