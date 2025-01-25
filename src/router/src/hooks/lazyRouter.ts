import { type Component, lazy } from "solid-js"

import { setter } from "elum-state/solid"
import { PRELOAD_ATOM } from "../atom"

export const lazyRouter = <T extends Component<any>>(
  contentId: string,
  fn: () => Promise<{ default: T; }>
) => {
  const component = lazy(fn)

  setter(PRELOAD_ATOM, (state) => {
    state[contentId] = component.preload
    return Object.assign({ ...state })
  })

  return component
}