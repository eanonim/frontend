const findUniqueDayIndices = <T extends { time: Date }>(arr: T[]) => {
  if (!arr || arr.length === 0) {
    return [] // Возвращаем пустой массив для пустого или недействительного ввода
  }

  const seenDays = new Set()
  const uniqueIndices = []

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (!item || !item.time || !(item.time instanceof Date)) {
      console.warn(
        `Элемент с индексом ${i} имеет неверный формат времени, пропускаем.`,
      )
      continue // Пропускаем элемент если нет времени или не Date
    }
    const day = item.time.toDateString() // Получаем строку вида "Mon Oct 23 2023"

    if (!seenDays.has(day)) {
      seenDays.add(day)
      uniqueIndices.push(i)
    }
  }

  return uniqueIndices
}

export default findUniqueDayIndices
