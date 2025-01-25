const generateColor = (index: number): [number, number, number] => {
  const row = Math.floor(index / 12) // Номер строки
  const column = index % 12 // Номер столбца

  if (row === 0) {
    // Первая строка: от белого к черному
    const gray = Math.round((column / 11) * 255) // 0-255
    return [gray, gray, gray] // Только яркость изменяется
  } else {
    // Остальные строки: радуга
    const hue = (column / 12) * 360 // Оттенок (0-360)
    const saturation = row * 25 // Насыщенность (100-90)
    const lightness = 30 + (row - 1) * 7 // Яркость (50-140)

    // Перевод HSL в RGB (без отдельной функции)
    const c = ((1 - Math.abs((2 * lightness) / 100 - 1)) * saturation) / 100
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
    const m = lightness / 100 - c / 2
    let r, g, b

    if (hue < 60) {
      ;[r, g, b] = [c, x, 0]
    } else if (hue < 120) {
      ;[r, g, b] = [x, c, 0]
    } else if (hue < 180) {
      ;[r, g, b] = [0, c, x]
    } else if (hue < 240) {
      ;[r, g, b] = [0, x, c]
    } else if (hue < 300) {
      ;[r, g, b] = [x, 0, c]
    } else {
      ;[r, g, b] = [c, 0, x]
    }

    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return [r, g, b]
  }
}

export default generateColor
