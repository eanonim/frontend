import { globalSignal } from "elum-state/solid"
import {
  MODAL_ATOM,
  POPOUT_ATOM,
  VIEW_ATOM,
  LAST_HISTORY_ATOM,
  HISTORY_ATOM,
  STRUCT_ATOM,
} from "../atom"
import { createEffect, createSignal, onCleanup, onMount } from "solid-js"
import { backPage } from "../actions/backPage"
import { listener } from "@apiteam/twa-bridge/solid"

const atoms = {
  view: VIEW_ATOM,
  modal: MODAL_ATOM,
  popout: POPOUT_ATOM,
}

export const useRouter = (type: keyof typeof atoms) => {
  const [value] = globalSignal(atoms[type])

  return () => value() || ""
}

export const useRouterPanel = (
  view: (() => string) | string,
  ramified: boolean = true,
) => {
  const [history] = globalSignal(HISTORY_ATOM)
  const [value] = globalSignal(LAST_HISTORY_ATOM)
  const [struct] = globalSignal(STRUCT_ATOM)

  const [viewDefault, setViewDefault] = createSignal("")

  const getView = () => (typeof view === "function" ? view() : view)

  createEffect(() => {
    const viewDefault = struct()?.find((x) => x.viewId === getView())
    if (viewDefault) {
      const page = viewDefault?.panels[viewDefault.default]
      if (page) setViewDefault(page)
    }
  })

  if (ramified)
    return () =>
      history().view[getView()]?.array?.slice(-1)?.[0]?.panelId || viewDefault()

  return () => value()[getView()] || viewDefault()
}
