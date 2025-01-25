import { getter, setter } from "elum-state/solid"
import { Params } from ".."
import { HISTORY_ATOM, PARAMS_ATOM, STRUCT_ATOM } from "../atom"

import { getLastPage, setHistory } from "../utils"

const replaceParams = <P extends Params>(params: P): boolean => {
  const pageId = getLastPage() || ""

  const page = getter(STRUCT_ATOM).find((a) => a.panels[pageId])
  if (!page) {
    console.error("pageId is not found of struct.")
    return false
  }

  const history = getter(HISTORY_ATOM)

  const lastView = history.history.slice(-1)[0]
  if (!lastView) {
    console.error("pageId is not found of struct.")
    return false
  }

  setter(HISTORY_ATOM, (value) => {
    const lastView = value.history[value.history.length - 1]

    if (lastView) {
      lastView.params = params
    }
    return { ...value }
  })

  setter(PARAMS_ATOM, (value) => {
    value["all"] = params

    if (!!lastView.popoutId) {
      value[`popout=${lastView.popoutId}`] = params
    } else if (!!lastView.modalId) {
      value[`modal=${lastView.modalId}`] = params
    } else if (!!pageId) {
      value[`page=${pageId}`] = params
    }

    return Object.assign({ ...value })
  })

  setHistory({
    pageId,
    popoutId: lastView.popoutId,
    modalId: lastView.modalId,
    params,
  })
  return true
}

export { replaceParams }
