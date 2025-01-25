import { type Platform } from "@ui/Types"
import usePlatform from "@ui/default/utils/usePlatform"

import { createEffect, on } from "solid-js"
import { createStore } from "solid-js/store"

/**
 * Хук для выбора стилей в зависимости от платформы.
 */
const useStyle = <T extends CSSModuleClasses>(
  styles: Record<Platform, T>,
  customPlatform?: Platform,
) => {
  const platform = usePlatform(customPlatform)
  const [store, setStore] = createStore({ ...styles[platform()] })

  createEffect(
    on(platform, (platform) => {
      setStore({ ...styles[platform] })
    }),
  )

  return store
}

export default useStyle
