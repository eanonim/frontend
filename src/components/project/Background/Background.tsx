import { createStore } from "solid-js/store"
import style from "./Background.module.css"

import {
  type JSX,
  type Component,
  splitProps,
  mergeProps,
  lazy,
  createEffect,
  on,
  onMount,
  onCleanup,
} from "solid-js"

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

interface Background extends JSX.HTMLAttributes<HTMLDivElement> {
  type: number
  color?: string
  fixed?: boolean
}

type Store = {
  isVisible: boolean
}

const Background: Component<Background> = (props) => {
  const merged = mergeProps({ color: "#222222" }, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "type",
    "color",
    "fixed",
  ])

  const [store, setStore] = createStore<Store>({
    isVisible: !!cache.has(local.type),
  })

  let ref: HTMLCanvasElement
  const handlerRender = async () => {
    if (!ref!) return
    if (!local.type) return
    const context = ref.getContext("2d")
    if (!context) return

    let svgString = cache.get(local.type)

    if (!svgString) {
      // Загружаем SVG
      const response = await fetch(
        `/backgrounds/${
          backgroundFiles.find((x) => x.id === local.type)?.name
        }`,
      )
      svgString = await response.text()

      cache.set(local.type, svgString)
    }
    svgString = svgString.replaceAll(`"currentColor"`, `"${local.color}"`)

    // Создаем изображение
    const img = new Image()
    img.onload = () => {
      const dpr = window.devicePixelRatio || 1
      ref.width = window.innerWidth * dpr
      ref.height = window.innerHeight * dpr
      context.scale(dpr, dpr)

      // Создаем паттерн
      const pattern = context.createPattern(img, "repeat")
      if (pattern) {
        context.fillStyle = pattern
        context.fillRect(0, 0, window.innerWidth, window.innerHeight)
      }

      setStore("isVisible", true)
    }

    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString).replace(
      /'/g,
      "%27",
    )}`
  }

  createEffect(on([() => local.color, () => local.type], handlerRender))

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
        width={window.innerWidth}
        height={window.innerHeight}
        class={style.Background__item}
      />
      {/* <Suspense>
        <Switch>
          <Match when={local.type === "1"}>
            <Background1 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "2"}>
            <Background2 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "3"}>
            <Background3 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "4"}>
            <Background4 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "5"}>
            <Background5 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "6"}>
            <Background6 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "7"}>
            <Background7 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "8"}>
            <Background8 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "9"}>
            <Background9 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "10"}>
            <Background10 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "11"}>
            <Background11 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "12"}>
            <Background12 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "13"}>
            <Background13 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "14"}>
            <Background14 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "15"}>
            <Background15 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "16"}>
            <Background16 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "17"}>
            <Background17 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "18"}>
            <Background18 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "19"}>
            <Background19 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "20"}>
            <Background20 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "21"}>
            <Background21 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "22"}>
            <Background22 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "23"}>
            <Background23 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "24"}>
            <Background24 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "25"}>
            <Background25 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "26"}>
            <Background26 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "27"}>
            <Background27 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "28"}>
            <Background28 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "29"}>
            <Background29 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "30"}>
            <Background30 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "31"}>
            <Background31 class={style.Background__item} color={local.color} />
          </Match>
          <Match when={local.type === "32"}>
            <Background32 class={style.Background__item} color={local.color} />
          </Match>
        </Switch>
      </Suspense> */}
    </div>
  )
}

export default Background
