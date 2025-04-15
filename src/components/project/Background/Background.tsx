import { createStore } from "solid-js/store"
import { Overlay, Preview } from "./addons"

import style from "./Background.module.css"

import {
  type JSX,
  type Component,
  splitProps,
  mergeProps,
  createEffect,
  on,
  onMount,
  onCleanup,
  untrack,
  Show,
  useTransition,
  Switch,
  Match,
  startTransition,
} from "solid-js"
import { Mutex } from "@minsize/mutex"
import { createVisibilityObserver } from "@solid-primitives/intersection-observer"
import { backgrounds } from "root/configs"

const cache = new Map<number, string>()
const mutex = Mutex({ globalLimit: 1 })

const cacheBlob = new Map<number, string>()
const createBlob = (type: number, data: string) => {
  const cache = cacheBlob.get(type)

  if (!!cache) return cache

  const blob = new Blob([data], { type: "image/svg+xml" })

  const MASK = URL.createObjectURL(blob)

  cacheBlob.set(type, MASK)

  return MASK
}

const preload = async (type: number, signal = new AbortController().signal) => {
  try {
    const response = await fetch(
      `${import.meta.env.MODE === "development" ? "" : ""}/backgrounds/${
        backgrounds.find((x) => x.id === type)?.name
      }`,
      { signal },
    )
    const svgString = await response.text()

    cache.set(type, svgString)

    return svgString
  } catch {
    return ""
  }
}

interface Background extends JSX.HTMLAttributes<HTMLDivElement> {
  type: number
  color?: string
  fixed?: boolean
  quality?: number
  onSize?: () => { width: number; height: number }
  onContext?: (context: CanvasRenderingContext2D) => void

  render?: "canvas" | "svg"
}

type ComponentBackground = Component<Background> & {
  Preview: typeof Preview
  Overlay: typeof Overlay
  preload: typeof preload
}

type Store = {
  isVisible: boolean
  isHidden: boolean
}

const Background: ComponentBackground = (props) => {
  const merged = mergeProps(
    {
      color: "#222222",
      quality: window.devicePixelRatio || 1,
      onSize: () => ({ width: window.innerWidth, height: window.innerHeight }),
      render: "canvas",
    },
    props,
  )
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "type",
    "color",
    "fixed",
    "quality",
    "onSize",
    "onContext",
    "render",
  ])

  let refDiv: HTMLDivElement
  let ref: HTMLCanvasElement

  const useVisibilityObserver = createVisibilityObserver({
    initialValue: false,
  })

  const visibleCanvas = useVisibilityObserver(() => ref!)

  const [store, setStore] = createStore<Store>({
    isVisible: visibleCanvas() && !!cache.has(local.type),
    isHidden: false,
  })

  const controller = new AbortController()

  onCleanup(() => {
    controller?.abort?.()
  })

  const handlerRenderSvg = async () => {
    const release = await mutex.wait()
    try {
      if (!refDiv!) return

      if (local.type) {
        let svgString = cache.get(local.type)

        if (!svgString) {
          svgString = await preload(local.type)
        }

        const MASK = createBlob(local.type, svgString)
        refDiv.style.mask = `url(${MASK})`
        refDiv.style.webkitMask = `url(${MASK})`
        refDiv.style.backgroundSize = "contain"
        refDiv.style.backgroundRepeat = "repeat"
      }
      refDiv.style.backgroundColor = local.color
    } finally {
      release()
    }
  }

  const handlerRenderCanvas = async () => {
    if (!visibleCanvas()) return
    const release = await mutex.wait()

    try {
      if (!ref!) return

      const context = ref.getContext("2d")
      if (!context) return

      const size = local.onSize()

      let svgString = cache.get(local.type)

      if (local.type) {
        if (!svgString) {
          svgString = await preload(local.type, controller.signal)
        }

        svgString = svgString.replaceAll(
          `"currentColor"`,
          `"${untrack(() => local.color)}"`,
        )

        const match = svgString.match(/width="([^"]*)" height="([^"]*)"/)

        if (match) {
          const originalWidth = parseFloat(match[1])
          const originalHeight = parseFloat(match[2])

          // Проверяем, удалось ли получить значения ширины и высоты
          if (!isNaN(originalWidth) && !isNaN(originalHeight)) {
            const newWidth = originalWidth * local.quality
            const newHeight = originalHeight * local.quality

            svgString = svgString.replace(
              /width="[^"]*" height="[^"]*"/g,
              `width="${newWidth}" height="${newHeight}"`,
            )
          }
        }
      }

      if (local.type && svgString) {
        // Создаем изображение
        const img = new Image()
        img.onload = () => {
          context.imageSmoothingEnabled = false

          ref.width = size.width * local.quality
          ref.height = size.height * local.quality

          const pattern = context.createPattern(img, "repeat")
          if (pattern) {
            context.fillStyle = pattern

            context.fillRect(
              0,
              0,
              size.width * local.quality,
              size.height * local.quality,
            )
          }

          local.onContext?.(context)

          setStore("isVisible", true)
          setStore("isHidden", false)
        }

        img.src = `data:image/svg+xml;utf8,${encodeURIComponent(
          svgString,
        ).replace(/'/g, "%27")}`
      } else {
        context.fillStyle = local.color
        context.fillRect(
          0,
          0,
          size.width * local.quality,
          size.height * local.quality,
        )

        setStore("isVisible", true)
        setStore("isHidden", false)
      }
    } finally {
      release()
    }
  }

  const handlerRender = () => {
    startTransition(() => {
      switch (local.render) {
        case "canvas": {
          handlerRenderCanvas()
        }
        case "svg": {
          handlerRenderSvg()
        }
      }
    })
  }

  createEffect(
    on([() => ref!, () => refDiv!, visibleCanvas], () => {
      if (local.render === "svg") {
        handlerRender()
      } else {
        setStore("isHidden", false)
        handlerRender()
      }
    }),
  )

  createEffect(
    on(
      [() => local.color, () => local.type],
      () => {
        if (local.render === "svg") {
          handlerRender()
        } else {
          setStore("isHidden", true)

          setTimeout(handlerRender, 250)
        }
      },
      {
        defer: true,
      },
    ),
  )

  onMount(() => {
    window.addEventListener("resize", handlerRender)

    onCleanup(() => {
      window.removeEventListener("resize", handlerRender)
    })
  })

  return (
    <div
      class={style.Background}
      classList={{
        [style[`Background--fixed`]]: local.fixed,
        [style[`Background--visible`]]: store.isVisible,

        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <Show keyed when={local.onSize()}>
        {(size) => (
          <Switch>
            <Match when={local.render === "svg"}>
              <div
                class={style.Background__svg}
                ref={refDiv!}
                style={{ color: "red" }}
              />
            </Match>
            <Match when={local.render === "canvas"}>
              <canvas
                ref={ref!}
                data-color={local.color}
                width={size.width}
                height={size.height}
                class={style.Background__item}
              />
            </Match>
          </Switch>
        )}
      </Show>
      <span
        class={style.Background__show}
        classList={{
          [style[`Background__show--hidden`]]: store.isHidden,
        }}
      />
    </div>
  )
}

Background.Preview = Preview
Background.preload = preload
Background.Overlay = Overlay

export default Background
