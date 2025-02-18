import style from "./Input.module.css"

import { HTMLAttributes } from "@ui/Types"
import Events from "@ui/default/Templates/Events/Events"
import IconCheck from "@ui/default/Icons/Check.svg"

import {
  type Component,
  splitProps,
  mergeProps,
  onMount,
  onCleanup,
} from "solid-js"
import { setter } from "elum-state/solid"
import { KEYBOARD_ATOM } from "engine/state"

interface Input extends HTMLAttributes<HTMLInputElement> {
  type?: "email" | "number" | "password" | "text"
  /**
   * Указывает, является ли чекбокс отключенным.
   */
  disabled?: boolean
  value?: string
}

const Input: Component<Input> = (props) => {
  const merged = mergeProps({ type: "text" }, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  let ref: HTMLInputElement

  const onStart = () => {
    const bounding = ref!?.getBoundingClientRect()
    if (bounding) {
      setter(KEYBOARD_ATOM, (store) => {
        store.bottom = window.innerHeight - bounding.bottom - 12
        return { ...store }
      })
    }
  }

  onMount(() => {
    if (ref!) {
      ref.addEventListener("touchstart", onStart)

      onCleanup(() => {
        ref.removeEventListener("touchstart", onStart)
      })
    }
  })

  return (
    <input
      ref={ref!}
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
