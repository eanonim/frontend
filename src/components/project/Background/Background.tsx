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
} from "solid-js"
import { clamp } from "@minsize/utils"
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

const preload = async (type: number) => {
  const response = await fetch(
    `/backgrounds/${backgroundFiles.find((x) => x.id === type)?.name}`,
  )
  const svgString = await response.text()

  cache.set(type, svgString)

  return svgString
}

interface Background extends JSX.HTMLAttributes<HTMLDivElement> {
  type: number
  color?: string
  fixed?: boolean
  quality?: number
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
    { color: "#222222", quality: window.devicePixelRatio || 1 },
    props,
  )
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "type",
    "color",
    "fixed",
    "quality",
  ])

  const [store, setStore] = createStore<Store>({
    isVisible: !!cache.has(local.type),
    isHidden: false,
  })

  let ref: HTMLCanvasElement
  const handlerRender = async () => {
    const release = await mutex.wait()
    try {
      if (!ref!) return
      if (!local.type) return

      const context = ref.getContext("2d")
      if (!context) return

      let svgString = cache.get(local.type)

      if (!svgString) {
        svgString = await preload(local.type)
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

      // Создаем изображение
      const img = new Image()
      img.onload = () => {
        context.imageSmoothingEnabled = false

        ref.width = window.innerWidth * local.quality
        ref.height = window.innerHeight * local.quality

        const pattern = context.createPattern(img, "repeat")
        if (pattern) {
          context.fillStyle = pattern

          context.fillRect(
            0,
            0,
            window.innerWidth * local.quality,
            window.innerHeight * local.quality,
          )
        }

        setStore("isVisible", true)
        setStore("isHidden", false)
      }

      img.src = `data:image/svg+xml;utf8,${encodeURIComponent(
        svgString,
      ).replace(/'/g, "%27")}`
    } finally {
      release()
    }
  }

  onMount(() => {
    handlerRender()
  })

  createEffect(
    on(
      [() => local.color, () => local.type],
      () => {
        setStore("isHidden", true)

        setTimeout(handlerRender, 250)
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
      <canvas
        ref={ref!}
        data-color={local.color}
        width={window.innerWidth}
        height={window.innerHeight}
        class={style.Background__item}
      />
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
