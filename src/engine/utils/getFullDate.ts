const getFullDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid Date"
  }

  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return `${day}-${month}-${year}`
}

export default getFullDate
