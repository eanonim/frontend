const timeAgo = (timestamp: number) => {
  if (!timestamp) return "только что"
  const date = new Date(timestamp)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hour = String(date.getHours()).padStart(2, "0")
  const min = String(date.getMinutes()).padStart(2, "0")

  let text = `${day}.${month}.${year}`

  if (seconds < 86400 || date.getDay() !== new Date().getDay()) {
    text = `${hour}:${min}`
  }

  return text
}

export default timeAgo
