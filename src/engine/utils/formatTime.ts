import { getLocale, ISOLanguage } from "engine/languages"

const formatTime = (
  date: Date,
  format: "HH:mm" | "HH:mm:ss" | "DD.MM.YYYY" = "HH:mm",
): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid Date"
  }

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth()).padStart(2, "0")
  const year = date.getFullYear()

  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")

  if (format === "HH:mm") {
    return `${hours}:${minutes}`
  }

  if (format === "DD.MM.YYYY") {
    const lang = getLocale()
    return new Intl.DateTimeFormat(ISOLanguage[lang], {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
      .format(date)
      .replace(".", "")
  }

  return `${hours}:${minutes}:${seconds}`
}

export default formatTime
