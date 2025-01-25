import style from "./Input.module.css"

import { HTMLAttributes } from "@ui/Types"
import Events from "@ui/default/Templates/Events/Events"
import IconCheck from "@ui/default/Icons/Check.svg"

import { type Component, splitProps, mergeProps } from "solid-js"

interface Input extends HTMLAttributes<HTMLInputElement> {
  type?: "email" | "number" | "password" | "text"
  /**
   * Указывает, является ли чекбокс отключенным.
   */
  disabled?: boolean
}

const Input: Component<Input> = (props) => {
  const merged = mergeProps({ type: "text" }, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <input
      class={style.Input}
      classList={{
        ...local.classList,
        [`${local.class}`]: !!local.class,
      }}
      {...others}
    />
  )
}

export default Input
