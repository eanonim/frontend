import style from "./Hue.module.css"

import Touch, { type GestureEvent } from "@ui/default/Templates/Touch/Touch"

import { type JSX, type Component, createEffect } from "solid-js"

import { createStore } from "solid-js/store"
import { clamp, HSVtoRGB } from "@minsize/utils"

interface Hue
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "color" | "onChange"> {
  color: number
  onChange: (color: number) => void
}

const Hue: Component<Hue> = (props) => {
  const [color, setColor] = createStore({
    start: 0,
    x: 0,
  })

  const Start = (event: GestureEvent) => {
    const container = event.originalEvent.currentTarget as HTMLDivElement
    if (!container) {
      return
    }

    const rect = container.getBoundingClientRect()
    const width = rect.width

    const currentX = (event.startX || 0) - rect.x

    const x = clamp(currentX, 0, width)

    const positionX = (x * 100) / width

    setColor({ start: positionX })

    props.onChange(positionX / 100)
  }

  const Move = (event: GestureEvent) => {
    const container = event.originalEvent.currentTarget as HTMLDivElement
    if (!container) {
      return
    }

    const currentX = event.shiftX || 0

    const xPercentage = (currentX * 100) / container.clientWidth

    const clampedX = clamp(color.start + xPercentage, 0, 100)

    props.onChange(clampedX / 100)
  }

  createEffect(() => {
    setColor({ x: props.color * 100 })
  })

  const rgb = (color: number) => {
    const [r, g, b] = HSVtoRGB(color, 1, 1)
    return `rgb(${r},${g},${b})`
  }

  return (
    <div class={style.Hue}>
      <Touch class={style.Hue__inner} onStart={Start} onMove={Move}>
        <div class={style.Hue__background} />
        <div class={style.Hue__toodle} style={{ left: `${color.x}%` }}>
          <span style={{ background: rgb(props.color) }} />
        </div>
      </Touch>
    </div>
  )
}

export default Hue
