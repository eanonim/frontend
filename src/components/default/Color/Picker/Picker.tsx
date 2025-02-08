import style from "./Picker.module.css"
import { getPercentage, getPosition } from "./libs"

import Touch, { type GestureEvent } from "@ui/default/Templates/Touch/Touch"
import Ratio from "@ui/default/Templates/Ratio/Ratio"

import { type Component, type JSX, createEffect, splitProps } from "solid-js"
import { createStore } from "solid-js/store"

import { clamp, HSVtoRGB } from "@minsize/utils"

interface Picker
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "color"> {
  color: [number, number, number]
  /** от 0 до 1 */
  accent: [number, number]
  onChange: (color: [number, number, number]) => void
}

type StorePosition = {
  x: number
  y: number
}

type StoreColor = {
  accent: [number, number]
  rgb: [number, number, number]
  position: StorePosition
}

const Picker: Component<Picker> = (props) => {
  const [local, others] = splitProps(props, ["color", "accent", "onChange"])

  const [color, setColor] = createStore<StoreColor>({
    accent: [0, 0],
    rgb: local.color,
    position: getPosition(...local.color),
  })

  const [position, setPosition] = createStore<StorePosition>(
    getPosition(...local.color),
  )

  const handlerChange = (x: number, y: number) => {
    setColor("position", { x, y })
    const rgb = HSVtoRGB(local.accent[0], 1 - local.accent[1], 1 - x / 100)
    local.onChange(rgb)
  }

  const Start = (event: GestureEvent) => {
    const container = event.originalEvent.currentTarget as HTMLDivElement
    if (!container) return

    const { width, height, x, y } = container.getBoundingClientRect()

    const currentX = (event.startX || 0) - x
    const currentY = (event.startY || 0) - y

    const { percentageX, percentageY } = getPercentage(
      clamp(currentX, 0, width),
      clamp(currentY, 0, height),
      width,
      height,
    )

    setPosition({ x: percentageX, y: percentageY })
    handlerChange(percentageX, percentageY)
  }

  const Move = (event: GestureEvent) => {
    const container = event.originalEvent.currentTarget as HTMLDivElement
    if (!container) return

    const { percentageX, percentageY } = getPercentage(
      event.shiftX || 0,
      event.shiftY || 0,
      container.clientWidth,
      container.clientHeight,
    )

    const clampedX = clamp(position.x + percentageX, 0, 100)
    const clampedY = clamp(position.y + percentageY, 0, 100)

    handlerChange(clampedX, clampedY)
  }

  createEffect(() => {
    if (
      local.accent[0] !== color.accent[0] ||
      local.accent[1] !== color.accent[1]
    ) {
      handlerChange(color.position.x, color.position.y)
    }
    setColor({
      accent: local.accent,
      rgb: local.color,
      position: getPosition(...local.color),
    })
  })

  const getColor = () => {
    const [r, g, b] = HSVtoRGB(local.accent[0], 1 - local.accent[1], 1)
    return `rgb(${r},${g},${b})`
  }

  return (
    <div class={style.Picker} {...others}>
      <Touch class={style.Picker__inner} onStart={Start} onMove={Move}>
        <div
          class={style.Picker__hue}
          style={{ "background-color": getColor() }}
        />
        <div
          class={style.Picker__toddle}
          style={{
            left: `${color.position.x}%`,
          }}
        >
          <span class={style.Picker__circle} />
        </div>
      </Touch>
    </div>
  )
}

export default Picker
