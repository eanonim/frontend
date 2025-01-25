import { Platform } from "@ui/Types"
import { Accessor, createSignal } from "solid-js"

const [signal, setSignal] = createSignal<Platform>("iOS")

/**
 * Функция для определения и установки платформы на основе userAgent.
 */
const setPlatform = () => {
  let platform: Platform = "others"
  if (/iPhone|iPad|iPod|Mac OS|Macintosh/i.test(navigator.userAgent)) {
    platform = "iOS"
  } else if (/Android|Linux/i.test(navigator.userAgent)) {
    platform = "android"
  }

  platform = "iOS"

  setSignal(platform)
}

/**
 * Первоначальная установка платформы.
 */
setPlatform()

/**
 * Добавляем обработчик события resize, чтобы переопределять платформу при изменении размера окна.
 */
window.addEventListener("resize", setPlatform)

/**
 * Хук для получения текущей платформы.
 */
const usePlatform = (platform?: Platform): Accessor<Platform> =>
  platform ? () => platform : signal

export default usePlatform
