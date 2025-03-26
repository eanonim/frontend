import { globalSignal } from "elum-state/solid"
import { AUTH_TOKEN_ATOM } from "engine/state"
import { HOST_CDN } from "root/configs"
import { createEffect, createSignal, on, onMount } from "solid-js"

const images = new Map<string, string>()

const useImage = (id: string) => {
  const [image, setImage] = createSignal()
  const [token] = globalSignal(AUTH_TOKEN_ATOM)

  const load = async () => {
    const response = await fetch(
      `https://${HOST_CDN}/v1/image/x1000/${id}?${token()}`,
    )

    if (!response.ok) {
      // повторить запрос на получение токена
    }

    const blob = await response.blob()

    const blobUrl = URL.createObjectURL(blob)
    images.set(id, blobUrl)
    setImage(blobUrl)
  }

  createEffect(
    on([() => id, token], () => {
      load()
    }),
  )

  return image()
}

export default useImage
