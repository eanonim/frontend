import { decWord } from "@minsize/utils"

const timeAgoOnlyDate = (timestamp: number) => {
  if (!timestamp) return "только что"
  const date = new Date(timestamp)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const dayMonthString = () =>
    new Intl.DateTimeFormat("RU-ru", { day: "numeric", month: "long" })
      .format(date)
      .replace(".", "")
  const lasing = (title: Array<string> | string, end: string, count: number) =>
    Array.isArray(title)
      ? `${count} ${decWord(count, title)} ${end}`
      : `${title} ${end}`
  switch (true) {
    case seconds < 0:
      return ""
    case seconds < 86400:
      return lasing(`сегодня`, "", Math.floor(seconds / 3600))
    case seconds < 172800:
      return lasing(`вчера`, "", Math.floor(seconds / 86400))
    case seconds >= 31536000 || date.getFullYear() !== new Date().getFullYear():
      return lasing(
        `${dayMonthString()} ${date.getFullYear()} г.`,
        "",
        Math.floor(seconds / 31536000),
      )
    case seconds < 31536000:
      return lasing(`${dayMonthString()}`, "", Math.floor(seconds / 86400))
  }
  return ""
}

export default timeAgoOnlyDate
