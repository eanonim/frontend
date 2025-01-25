import { type Platform } from "@ui/Types"
import usePlatform from "@ui/default/utils/usePlatform"

import { createEffect, on } from "solid-js"
import { createStore } from "solid-js/store"

/**
 * Хук для получения и отслеживания вычисленных стилей.
 */
const useComputedBlockStyles = <T extends unknown>({
  ref,
  platform,
  onUpdate,
}: {
  ref: () => T
  platform?: Platform
  onUpdate: () => void
}) => {
  const platformValue = usePlatform(platform)
  const [store, setStore] = createStore<Partial<CSSStyleDeclaration>>({})

  const _onUpdate = () => {
    if (ref()) {
      const computedStyle = window.getComputedStyle(ref() as HTMLElement)
      setStore(computedStyle)
    }
  }
  createEffect(on([platformValue, ref, onUpdate], _onUpdate))

  return store
}

export default useComputedBlockStyles
