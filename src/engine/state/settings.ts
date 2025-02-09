import { clamp } from "@minsize/utils"
import { atom, getter, setter } from "engine/modules/smart-data"
import { produce } from "solid-js/store"

import { debounce, leading } from "@solid-primitives/scheduled"
import { storeList, storeSet } from "engine/api"
import { Socket } from "engine/api/module"

export const SETTINGS_ATOM = atom<
  Socket["store.list"]["response"],
  Socket["store.list"]["request"]
>({
  default: {
    fontSize: 13,
    backgroundId: 0,
    backgroundColor: "#222222",
    theme: "dark",
  },
  onRequested: (options, key) => {
    storeList(options)
  },
  updateIntervalMs: 30_000,
  onUpdate: leading(
    debounce,
    ({ prev, next }, key) => {
      const keysToCheck: Socket["store.set"]["request"]["key"][] = [
        "backgroundColor",
        "backgroundId",
        "fontSize",
        "theme",
      ]
      keysToCheck.forEach((property) => {
        const key = property
        const value = next[key] as any
        if (prev[key] !== value) {
          storeSet({ key: key, value: value })
        }
      })
    },
    2000,
  ),
})

export const setBackground = (
  id: number = getter(SETTINGS_ATOM).backgroundId,
  color: string = getter(SETTINGS_ATOM).backgroundColor,
) => {
  setter(
    SETTINGS_ATOM,
    produce((settings) => {
      settings.backgroundId = id
      settings.backgroundColor = color
      return settings
    }),
  )
}

export const setFontSize = (count: number) => {
  const font_size = clamp(count, 10, 16)

  document.body.style.setProperty("--message_font_size", `${font_size}pt`)
  document.body.style.setProperty("--message_line_height", `${font_size + 4}pt`)

  setter(SETTINGS_ATOM, "fontSize", font_size)
}
