import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { SEARCH_OPTIONS_ATOM, SETTINGS_ATOM } from "engine/state"
import { setFontSize, setTheme, setThemeColor } from "engine/state/settings"
import { maxInterest } from "root/configs"

const storeList = async (options: Socket["store.list"]["request"]) => {
  const { response, error } = await socketSend("store.list", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  console.log({ response })

  const notArray = [
    "fontSize",
    "backgroundId",
    "backgroundColor",
    "theme",
    "themeColor",
  ]

  for (const key in response) {
    let values = (response as any)[key] as unknown[]

    for (let i = 0; i < values.length; i++) {
      if (typeof Number(values[i]) === "number" && !isNaN(Number(values[i]))) {
        values[i] = Number(values[i])
      } else if (values[i] === "true" || values[i] === "false") {
        values[i] = Boolean(values[i])
      }

      if (notArray.includes(key)) {
        ;(response as any)[key] = values[i]
      } else {
        ;(response as any)[key][i] = values[i]
      }
    }
  }

  /* Установка дефолтной системной темы */
  if (!response.theme) response.theme = "system"
  if (!response.themeColor) response.themeColor = "standard"

  setter(SETTINGS_ATOM, response)
  setter(SEARCH_OPTIONS_ATOM, "interests", (interests) => {
    for (const key of (response.interest ?? []).slice(0, maxInterest)) {
      interests[key] = { isSelected: true }
    }
    return interests
  })

  if (response?.fontSize) {
    setFontSize(response?.fontSize)
  }

  setTheme(response.theme)
  setThemeColor(response.themeColor)

  return { response, error }
}

export default storeList
