import { setter } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { SEARCH_OPTIONS_ATOM, SETTINGS_ATOM } from "engine/state"
import { setFontSize, setTheme, setThemeColor } from "engine/state/settings"
import { maxInterest } from "root/configs"
import { swap } from "engine/languages"
import { unlink } from "@minsize/utils"

const storeList = async (options: Socket["store.list"]["request"]) => {
  const { response, error } = await socketSend("store.list", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }

  console.log({ response: unlink(response) })

  const notArray: (keyof Socket["store.list"]["response"])[] = [
    "fontSize",
    "backgroundId",
    "backgroundColor",
    "theme",
    "themeColor",
    "filterMyAge",
    "filterMySex",
    "filterYourAgeEnd",
    "filterYourAgeStart",
    "filterYourSex",
    "filterLanguage",
    "language",
    "bannerStartup",
  ]

  for (const key in response) {
    let values = (response as any)[key] as unknown[]

    for (let i = 0; i < values.length; i++) {
      if (
        values[i] === "true" ||
        values[i] === "false" ||
        typeof values[i] === "boolean"
      ) {
        values[i] = Boolean(values[i])
      } else if (
        typeof Number(values[i]) === "number" &&
        !isNaN(Number(values[i]))
      ) {
        values[i] = Number(values[i])
      }

      if (notArray.includes(key as any)) {
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
  setter(SEARCH_OPTIONS_ATOM, (searchOptions) => {
    if (response.filterMyAge) {
      searchOptions.you.age.from = response.filterMyAge
      const list: Record<number, number> = {
        18: 24,
        25: 31,
        32: 38,
        39: 45,
        46: 116,
      }
      searchOptions.you.age.to = list[response.filterMyAge]
    }
    if (response.filterMySex) {
      searchOptions.you.male = response.filterMySex
    }
    if (response.filterYourAgeEnd && response.filterYourAgeStart) {
      searchOptions.companion.age.from = response.filterYourAgeStart
      searchOptions.companion.age.to = response.filterYourAgeEnd
    }

    if (response.filterYourSex) {
      searchOptions.companion.male = response.filterYourSex
    }

    for (const key of (response.interest ?? []).slice(0, maxInterest)) {
      searchOptions.interests[key] = { isSelected: true }
    }
    return searchOptions
  })

  if (response?.fontSize) {
    setFontSize(response?.fontSize)
  }

  setTheme(response.theme)
  setThemeColor(response.themeColor)
  if (response.language) {
    swap(response.language)
  }
  document.documentElement.setAttribute("theme-color", response.themeColor)

  return { response, error }
}

export default storeList
