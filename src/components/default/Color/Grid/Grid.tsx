import style from "./Grid.module.css"
import { generateColor } from "./libs"

import Ratio from "@ui/default/Templates/Ratio/Ratio"

import { type Component, For, type JSX, splitProps } from "solid-js"

interface Grid
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "color"> {
  color: [number, number, number]
  onChange: (color: [number, number, number]) => void
}

const Grid: Component<Grid> = (props) => {
  const [local, others] = splitProps(props, ["onChange", "color"])

  const isSelected = (color: [number, number, number]) => {
    return (
      local.color?.[0] === color[0] &&
      local.color?.[1] === color[1] &&
      local.color?.[2] === color[2]
    )
  }

  return (
    <Ratio width={12} height={10}>
      <div class={style.Grid} {...others}>
        <For each={Array.from({ length: 120 })}>
          {(_, index) => {
            const [r, g, b] = generateColor(index())

            return (
              <span
                onClick={() => local.onChange([r, g, b])}
                data-index={index()}
                class={style.Grid__item}
                classList={{
                  [style[`Grid--selected`]]: isSelected([r, g, b]),
                }}
                style={{
                  "background-color": `rgb(${r},${g},${b})`,
                }}
              />
            )
          }}
        </For>
      </div>
    </Ratio>
  )
}

export default Grid
