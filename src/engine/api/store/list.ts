import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { SETTINGS_ATOM } from "engine/state"
import { setFontSize, setTheme, setThemeColor } from "engine/state/settings"

const storeList = async (options: Socket["store.list"]["request"]) => {
  const { response, error } = await socketSend("store.list", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  for (const key in response) {
    let value = (response as any)[key]
    if (typeof Number(value) === "number" && !isNaN(Number(value))) {
      value = Number(value)
    } else if (value === "true" || value === "false") {
      value = Boolean(value)
    }
    ;(response as any)[key] = value
  }

  /* Установка дефолтной системной темы */
  if (!response.theme) response.theme = "system"
  if (!response.themeColor) response.themeColor = "system"

  setter(SETTINGS_ATOM, response)

  if (response?.fontSize) {
    setFontSize(response?.fontSize)
  }

  setTheme(response.theme)
  setThemeColor(response.themeColor)
  console.log({ fresponse: response })

  return { response, error }
}

export default storeList
