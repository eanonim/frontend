import { clamp } from "@minsize/utils"
import style from "./Input.module.css"

import Flex from "@ui/default/Blocks/Flex/Flex"
import Touch from "@ui/default/Templates/Touch/Touch"

import { type JSX, type Component, mergeProps, splitProps, For } from "solid-js"

interface Input extends JSX.HTMLAttributes<HTMLDivElement> {
  min?: number
  max?: number
  step?: number
  value: number
  onRange?: (value: number) => void
}

const Input: Component<Input> = (props) => {
  const merged = mergeProps(
    {
      min: 0,
      max: 100,
      step: 1,
      value: 0,
    },
    props,
  )
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "max",
    "min",
    "step",
    "value",
    "onRange",
  ])

  let ref: HTMLDivElement

  const separators = (local.max - local.min) / local.step

  return (
    <div
      ref={ref!}
      class={style.Input}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <For each={Array.from(Array(separators <= 8 ? separators * 2 + 1 : 1))}>
        {(_, index) => (
          <span
            data-index={index()}
            class={style.Input__separator}
            classList={{
              [style[`Input__separator--circle`]]: !!((index() + 1) % 2),
              [style[`Input__separator--selected`]]:
                index() / 2 <= local.value - local.min,
            }}
          />
        )}
      </For>

      <input
        type={"range"}
        class={style.Input__element}
        onInput={(e) => {
          local.onRange?.(Number(e.target.value) || local.min)
        }}
        min={local.min}
        max={local.max}
        step={local.step}
        value={local.value}
      />
    </div>
  )
}

export default Input
