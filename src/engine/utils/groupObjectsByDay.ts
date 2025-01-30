const groupObjectsByDay = <T extends { time: Date }>(objects: T[]) => {
  if (!objects || objects.length === 0) {
    return []
  }

  const groupedObjects: { [key: string]: T[] } = {}

  for (const obj of objects) {
    if (!obj || !obj.time) {
      continue // Пропускаем объекты без поля time или null/undefined.
    }

    const dateObj = obj.time // Получаем объект Date из поля time
    const dateString = dateObj.toISOString().split("T")[0] // Получаем YYYY-MM-DD

    if (!groupedObjects[dateString]) {
      groupedObjects[dateString] = []
    }
    groupedObjects[dateString].push(obj)
  }

  // Преобразовываем объект в массив массивов
  return Object.values(groupedObjects)
}

export default groupObjectsByDay
