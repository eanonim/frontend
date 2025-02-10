import { clamp } from "@minsize/utils"
import { atom, getter, setter } from "engine/modules/smart-data"
import { produce } from "solid-js/store"

import { debounce, leading } from "@solid-primitives/scheduled"
import { storeList, storeSet } from "engine/api"
import { Socket } from "engine/api/module"
import {
  bridgeGetInitData,
  bridgeRequestTheme,
  bridgeSetBackgroundColor,
  bridgeSetBottomBarColor,
  bridgeSetHeaderColor,
} from "@apiteam/twa-bridge/solid"

export const SETTINGS_ATOM = atom<
  Socket["store.list"]["response"],
  Socket["store.list"]["request"]
>({
  default: {
    fontSize: 13,
    backgroundId: 0,
    backgroundColor: "#222222",
    theme: "dark",
    themeColor: "system",
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
        "themeColor",
      ]
      keysToCheck.forEach((property) => {
        const key = property
        const value = next[key] as any
        if (prev[key] !== value) {
          storeSet({ key: key, value: value })

          // if (key === "theme") {
          //   setTheme(value)
          // }
          // if (key === "themeColor") {
          //   setTheme(value)
          // }
        }
      })
    },
    2000,
  ),
})

export const setThemeColor = (
  themeColor: Socket["store.list"]["response"]["themeColor"],
  set: boolean = true,
) => {
  if (set) {
    setter(SETTINGS_ATOM, "themeColor", themeColor)
  }

  document.documentElement.setAttribute("theme-color", themeColor)

  if (themeColor === "standard") {
    bridgeRequestTheme()
    return
  }
}

export const setTheme = (
  theme: Socket["store.list"]["response"]["theme"],
  set: boolean = true,
) => {
  if (set) {
    setter(SETTINGS_ATOM, "theme", theme)
  }
  if (theme === "system") {
    bridgeRequestTheme()
    return
  }

  document.documentElement.setAttribute("theme", theme)
  const bodyStyles = window.getComputedStyle(document.body)
  const color = bodyStyles.getPropertyValue("--bg_color")

  bridgeSetHeaderColor({ color })
  bridgeSetBackgroundColor({ color })

  const colorBottom = bodyStyles.getPropertyValue("--section_bg_color")
  bridgeSetBottomBarColor({ color: colorBottom })
}

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
