import { styles } from "./styles"

import { type HTMLAttributes } from "@ui/Types"
import renameSize from "@ui/default/utils/renameSize"
import useStyle from "@ui/default/utils/useStyle"

import { type Component, splitProps, mergeProps } from "solid-js"

interface Spinner extends HTMLAttributes<HTMLDivElement> {
  size?: "small" | "regular" | "large" | "medium" | "auto"
  color?: "secondary" | "inherit"
}

const Spinner: Component<Spinner> = (props) => {
  const style = useStyle(styles, props.platform)

  const merged = mergeProps(
    { size: "regular", color: "secondary" },
    props,
  ) as Spinner
  const [local, others] = splitProps(merged, [
    "platform",
    "size",
    "color",
    "class",
    "classList",
  ])

  return (
    <div
      class={style.Spinner}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,

        [style[`Spinner__size--${local.size}`]]: !!local.size,
        [style[`Spinner__color--${local.color}`]]: !!local.color,
      }}
      {...others}
    >
      <svg viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke-width="5" />
      </svg>
    </div>
  )
}

export default Spinner
