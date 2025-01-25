import { getter } from "elum-state/solid"
import { HISTORY_ATOM, STRUCT_ATOM } from "../atom"

const getLastPage = (view?: string) => {
  if (view) {
    const lastView = getter(HISTORY_ATOM).view[view]?.array?.slice(-1)?.[0]
    if (lastView) {
      const _view = getter(STRUCT_ATOM).find(
        (a) => a.viewId === lastView.viewId,
      )
      if (_view) {
        const foundPage = Object.entries(_view.panels).find(
          ([_, panelId]) => panelId === lastView.panelId,
        )
        return foundPage?.[0]
      }
    }
  } else {
    const lastView = getter(HISTORY_ATOM).history.slice(-1)[0]
    if (lastView) {
      const view = getter(STRUCT_ATOM).find((a) => a.viewId === lastView.viewId)
      if (view) {
        const foundPage = Object.entries(view.panels).find(
          ([_, panelId]) => panelId === lastView.panelId,
        )
        return foundPage?.[0]
      }
    }
  }
  return undefined
}

export default getLastPage
