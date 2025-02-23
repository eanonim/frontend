import { decWord } from "@minsize/utils"
import { getLoc, getLocale, ISOLanguage } from "engine/languages"

const timeAgoOnlyDate = (timestamp: number) => {
  const lang = getLocale()

  if (!timestamp) return "только что"
  const date = new Date(timestamp)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  console.log({ seconds })

  const dayMonthString = (year: boolean = false) =>
    new Intl.DateTimeFormat(ISOLanguage[lang], {
      day: "numeric",
      month: "long",
      year: year ? "numeric" : undefined,
    })
      .format(date)
      .replace(".", "")
  const lasing = (title: Array<string> | string, end: string, count: number) =>
    Array.isArray(title)
      ? `${count} ${decWord(count, title)} ${end}`
      : `${title} ${end}`
  switch (true) {
    case seconds < 0:
      return ""

    case date.getDay() !== new Date().getDay():
      return lasing(getLoc("yesterday"), "", Math.floor(seconds / 86400))
    case seconds < 86400:
      return lasing(getLoc("today"), "", Math.floor(seconds / 3600))
    case seconds < 172800:
      return lasing(getLoc("yesterday"), "", Math.floor(seconds / 86400))
    case seconds >= 31536000 || date.getFullYear() !== new Date().getFullYear():
      return lasing(
        `${dayMonthString(true)}`,
        "",
        Math.floor(seconds / 31536000),
      )
    case seconds < 31536000:
      return lasing(`${dayMonthString()}`, "", Math.floor(seconds / 86400))
  }
  return ""
}

export default timeAgoOnlyDate
