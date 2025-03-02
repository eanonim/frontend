import { getLocale, ISOLanguage } from "engine/languages"

const timeAgo = (timestamp: number): string => {
  if (!timestamp) return "только что"

  const date = new Date(timestamp)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const lang = getLocale()
  const options: Intl.DateTimeFormatOptions = {}

  if (seconds < 86400) {
    options.hour = "2-digit"
    options.minute = "2-digit"
  } else if (date.getFullYear() === new Date().getFullYear()) {
    options.day = "numeric"
    options.month = "short"
  } else {
    options.day = "numeric"
    options.month = "short"
    options.year = "numeric"
  }

  return new Intl.DateTimeFormat(ISOLanguage[lang], options)
    .format(date)
    .replace(".", "")
}

export default timeAgo
