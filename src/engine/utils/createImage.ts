const createImage = async (file: FileList[0]) => {
  if (!file.type.match(/image.*/)) return undefined

  return await new Promise<Blob | undefined>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string
      const img = new Image()

      img.onload = () => {
        let width = img.width
        let height = img.height

        // Максимальные размеры канвы
        const maxWidth = 1000
        const maxHeight = 1000

        // Вычисляем коэффициент масштабирования, если изображение больше максимальных размеров
        let ratio = 1
        if (width > maxWidth) {
          ratio = maxWidth / width
        }
        if (height > maxHeight) {
          ratio = Math.min(ratio, maxHeight / height) // Берем меньший коэффициент, чтобы вписаться в оба ограничения
        }

        // Масштабируем размеры изображения
        width *= ratio
        height *= ratio

        // Создаем канву с новыми размерами
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height) // Рисуем изображение на канве

          canvas.toBlob(function (blob) {
            resolve(blob !== null ? blob : undefined)
          }, "image/webp")
        }
      }

      img.src = imgUrl
    }
    reader.readAsDataURL(file)
  })
}

export default createImage
