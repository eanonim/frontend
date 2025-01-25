import style from "./Arrow.module.css"

import IconChevron from "@ui/default/Icons/Chevron/Chevron"
import { AccordionStore } from "../../../../context"

import {
  type JSX,
  type Component,
  mergeProps,
  splitProps,
  useContext,
} from "solid-js"

interface Arrow extends JSX.HTMLAttributes<HTMLSpanElement> {
  disabled?: boolean

  open?: "up" | "down" | "left" | "right"
  close?: "up" | "down" | "left" | "right"
}

const Arrow: Component<Arrow> = (props) => {
  const merged = mergeProps(
    {
      open: "down",
      close: "right",
    },
    props,
  ) as Arrow
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "disabled",
    "open",
    "close",
  ])

  const context = useContext(AccordionStore)

  return (
    <span {...others}>
      {local.disabled ? (
        "lock"
      ) : (
        <IconChevron
          class={style.Arrow__icon}
          type={context.status?.() ? local.open : local.close}
        />
      )}
    </span>
  )
}

export default Arrow
