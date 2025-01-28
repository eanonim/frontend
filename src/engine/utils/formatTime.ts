const formatTime = (
  date: Date,
  format: "HH:mm" | "HH:mm:ss" = "HH:mm",
): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid Date"
  }

  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")

  if (format === "HH:mm") {
    return `${hours}:${minutes}`
  }
  return `${hours}:${minutes}:${seconds}`
}

export default formatTime
