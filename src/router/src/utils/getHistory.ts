import { getter } from "elum-state/solid"
import { HISTORY_ATOM } from "../atom"
import getLastPage from "./getLastPage"

const getHistory = () => {
  const history = getter(HISTORY_ATOM)

  const lastView = history.history.slice(-1)[0]

  const pageId = getLastPage()

  return {
    pageId,
    modalId: lastView?.modalId,
    popoutId: lastView?.popoutId,
  }
}

export default getHistory
