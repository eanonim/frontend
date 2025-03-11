import { getLocale, ISOLanguage } from "engine/languages"

const timeAgo = (timestamp: number): string => {
  if (!timestamp) return "только что"

  const lang = getLocale()
  const date = new Date(timestamp)

  if (date.getTime() - 1_000 > Date.now()) {
    return new Intl.DateTimeFormat(ISOLanguage[lang], {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
      .format(date)
      .replace(".", "")
  }

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
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
