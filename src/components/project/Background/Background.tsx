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
} from "solid-js"
import { Mutex } from "@minsize/mutex"

const backgroundFiles = [
  {
    id: 1,
    name: "Cartoon Space.svg",
  },
  {
    id: 2,
    name: "Cats.svg",
  },
  {
    id: 3,
    name: "Characters.svg",
  },
  {
    id: 4,
    name: "Christmas.svg",
  },
  {
    id: 5,
    name: "Food.svg",
  },
  {
    id: 6,
    name: "Free Time.svg",
  },
  {
    id: 7,
    name: "Fun space.svg",
  },
  {
    id: 8,
    name: "Games 2.svg",
  },
  {
    id: 9,
    name: "Games.svg",
  },
  {
    id: 10,
    name: "HALOWEEN.svg",
  },
  {
    id: 11,
    name: "Love.svg",
  },
  {
    id: 12,
    name: "Magic 2.svg",
  },
  {
    id: 13,
    name: "Magic potion.svg",
  },
  {
    id: 14,
    name: "Magic.svg",
  },
  {
    id: 15,
    name: "Richness.svg",
  },
  {
    id: 16,
    name: "Sea World.svg",
  },
  {
    id: 17,
    name: "Sightseeing.svg",
  },
  {
    id: 18,
    name: "Snowflakes.svg",
  },
  {
    id: 19,
    name: "Space Cat.svg",
  },
  {
    id: 20,
    name: "Space.svg",
  },
  {
    id: 21,
    name: "Sport.svg",
  },
  {
    id: 22,
    name: "Star Wars 2.svg",
  },
  {
    id: 23,
    name: "Star Wars.svg",
  },
  {
    id: 24,
    name: "Sweet Love.svg",
  },
  {
    id: 25,
    name: "Sweets.svg",
  },
  {
    id: 26,
    name: "T-City.svg",
  },
  {
    id: 27,
    name: "Unicorn.svg",
  },
  {
    id: 28,
    name: "Witch.svg",
  },
  {
    id: 29,
    name: "Wizard world.svg",
  },
  {
    id: 30,
    name: "Woodland.svg",
  },
  {
    id: 31,
    name: "Zoo.svg",
  },
  {
    id: 32,
    name: "renovation.svg",
  },
]

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
      `${
        import.meta.env.MODE === "development" ? "" : "/frontend"
      }/backgrounds/${backgroundFiles.find((x) => x.id === type)?.name}`,
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
  cleanup: boolean
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

  const [store, setStore] = createStore<Store>({
    isVisible: !!cache.has(local.type),
    isHidden: false,
    cleanup: false,
  })

  let refDiv: HTMLDivElement
  let ref: HTMLCanvasElement

  const controller = new AbortController()

  onCleanup(() => {
    console.log("AS")
    controller?.abort?.()
  })

  const handlerRenderSvg = async () => {
    const release = await mutex.wait()
    onCleanup(() => {
      release?.()
      setStore("cleanup", true)
    })

    try {
      if (store.cleanup) return

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
    const release = await mutex.wait()

    onCleanup(() => {
      release?.()
      setStore("cleanup", true)
    })

    try {
      if (store.cleanup) return

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
    switch (local.render) {
      case "canvas": {
        handlerRenderCanvas()
      }
      case "svg": {
        handlerRenderSvg()
      }
    }
  }

  createEffect(
    on([() => ref!, () => refDiv!], () => {
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
