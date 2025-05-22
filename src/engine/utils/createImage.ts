const createBlobFromBase64 = (imgUrl: string) => {
  try {
    const base64Data = imgUrl.split(",")[1] // Удаляем префикс "data:image/..."
    const binaryStr = atob(base64Data)
    const bytes = new Uint8Array(binaryStr.length)

    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i)
    }

    return new Blob([bytes], { type: "image/webp" })
  } catch (error) {
    throw new Error("Base64 conversion failed")
  }
}

const createImage = async (file: File) => {
  // Проверка типа файла
  if (
    !file.type.match(/image.*/) &&
    !file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  ) {
    return undefined
  }

  return await new Promise<Blob | undefined>((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }

    reader.onload = (event) => {
      if (!event.target?.result || typeof event.target.result !== "string") {
        reject(new Error("Invalid file data"))
        return
      }

      const imgUrl = URL.createObjectURL(
        createBlobFromBase64(event.target.result),
      )
      const img = new Image()

      img.onerror = () => {
        reject(new Error("Failed to load image"))
      }

      img.onload = () => {
        let width = img.width
        let height = img.height

        const maxWidth = 1000
        const maxHeight = 1000

        let ratio = 1
        if (width > maxWidth) {
          ratio = maxWidth / width
        }
        if (height > maxHeight) {
          ratio = Math.min(ratio, maxHeight / height)
        }

        width *= ratio
        height *= ratio

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(imgUrl)
            resolve(blob ?? undefined)
          },
          "image/webp",
          0.85,
        )
      }

      img.src = imgUrl
    }

    reader.readAsDataURL(file)
  })
}

export default createImage
