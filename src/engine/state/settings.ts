import { clamp } from "@minsize/utils"
import { atom, getter, setter } from "elum-state/solid"

export const SETTINGS_ATOM = atom({
  key: "settings_atom",
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
  setter(SETTINGS_ATOM, (settings) => {
    settings.backgroundId = id
    settings.backgroundColor = color
    return { ...settings }
  })
}

export const setFontSize = (count: number) => {
  setter(SETTINGS_ATOM, (settings) => {
    settings.font_size = clamp(count, 10, 16)

    document.body.style.setProperty(
      "--message_font_size",
      `${settings.font_size}pt`,
    )
    document.body.style.setProperty(
      "--message_line_height",
      `${settings.font_size + 4}pt`,
    )

    return { ...settings }
  })
}
