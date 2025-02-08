import { bridgeSessionStorageSet } from "@apiteam/twa-bridge/solid"
import { HISTORY_ATOM, PARAMS_ATOM, SETTINGS_ATOM, VIEW_ATOM } from "../atom"
import { getter } from "elum-state/solid"

type HistoryParams = {
  pageId: string
  modalId?: string
  popoutId?: string
  params?: any
}

const setHistory = (
  { pageId, modalId, popoutId, params }: HistoryParams,
  history = true,
) => {
  const context = getter(SETTINGS_ATOM)

  let path = ""
  if (context.pathname) path = context.pathname
  if (pageId) path += pageId
  if (modalId) path += `=${modalId}`
  if (popoutId) path += `-${popoutId}`
  if (params) {
    let stringParams = ""
    for (var item of Object.entries(params)) {
      if (item[1]) stringParams += `${item[0]}=${item[1]},`
    }
    if (stringParams) path += `:${stringParams.slice(0, -1)}`
  }
  try {
    // window.history.pushState(
    //   {},
    //   "",
    //   path + window.location.search + window.location.hash,
    // )
  } catch (e) {
    console.log({ e })
  }

  bridgeSessionStorageSet({
    key: "router_history",
    value: getter(HISTORY_ATOM),
  })
  if (history) {
    bridgeSessionStorageSet({
      key: "router_last_view",
      value: getter(VIEW_ATOM),
    })
  }
}

/*
https://apiteam.ru/home=modalId:id=1,userId=2
*/

export default setHistory
