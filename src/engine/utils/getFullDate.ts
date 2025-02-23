const getFullDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid Date"
  }

  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return `${year} ${month + 1} ${day}`
}

export default getFullDate
