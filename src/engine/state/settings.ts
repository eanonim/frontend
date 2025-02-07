import { clamp } from "@minsize/utils"
import { atom, getter, setter } from "engine/modules/smart-data"
import { produce } from "solid-js/store"

export const SETTINGS_ATOM = atom({
  default: {
    font_size: 13,
    backgroundId: 2,
    backgroundColor: "#222222",
  },
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

  setter(SETTINGS_ATOM, "font_size", font_size)
}
