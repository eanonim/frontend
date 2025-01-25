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
  accent: number
  onChange: (color: [number, number, number]) => void
}

type StorePosition = {
  x: number
  y: number
}

type StoreColor = {
  accent: number
  rgb: [number, number, number]
  position: StorePosition
}

const Picker: Component<Picker> = (props) => {
  const [local, others] = splitProps(props, ["color", "accent", "onChange"])

  const [color, setColor] = createStore<StoreColor>({
    accent: 0,
    rgb: local.color,
    position: getPosition(...local.color),
  })

  const [position, setPosition] = createStore<StorePosition>(
    getPosition(...local.color),
  )

  const handlerChange = (x: number, y: number) => {
    setColor("position", { x, y })
    const rgb = HSVtoRGB(local.accent, x / 100, 1 - y / 100)
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
    if (local.accent !== color.accent) {
      handlerChange(color.position.x, color.position.y)
    }

    setColor({
      accent: local.accent,
      rgb: local.color,
      position: getPosition(...local.color),
    })
  })

  const getColor = (type: "circle" | "background") => {
    const s = type === "circle" ? color.position.x / 100 : 1
    const v = type === "circle" ? 1 - color.position.y / 100 : 1

    const [r, g, b] = HSVtoRGB(local.accent, s, v)

    return `rgb(${r},${g},${b})`
  }

  return (
    <div class={style.Picker} {...others}>
      <Ratio width={3} height={2}>
        <Touch class={style.Picker__inner} onStart={Start} onMove={Move}>
          <div
            class={style.Picker__hue}
            style={{ "background-color": getColor("background") }}
          />
          <div
            class={style.Picker__toddle}
            style={{
              left: `${color.position.x}%`,
              top: `${color.position.y}%`,
            }}
          >
            <span
              class={style.Picker__circle}
              style={{ background: getColor("circle") }}
            />
          </div>
        </Touch>
      </Ratio>
    </div>
  )
}

export default Picker
