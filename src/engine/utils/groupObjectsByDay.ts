const groupObjectsByDay = <T extends { time: Date }>(
  objects: readonly T[],
): T[][] => {
  // readonly для входного массива

  if (!objects || objects.length === 0) {
    return []
  }

  const groupedObjects: Map<string, T[]> = new Map() // Используем Map для эффективного поиска

  for (let i = 0; i < objects.length; i++) {
    // Используем индексный цикл
    const obj = objects[i]

    if (!obj || !obj.time) {
      continue // Пропускаем элементы без поля time или null/undefined.
    }

    const dateObj = obj.time // Используем существующий Date объект напрямую
    const dateString = dateObj.toISOString().slice(0, 10) // Используем slice для избежания создания массива

    let group = groupedObjects.get(dateString)
    if (!group) {
      group = [] // Создаем массив только если его нет
      groupedObjects.set(dateString, group)
    }
    group.push(obj)
  }

  return Array.from(groupedObjects.values()) // Преобразуем Map в массив массивов
}

export default groupObjectsByDay
