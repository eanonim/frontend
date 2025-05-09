import style from "./Icon.module.css"
import { type JSX, type Component, mergeProps, splitProps } from "solid-js"

interface Icon extends JSX.HTMLAttributes<HTMLSpanElement> {}

const Icon: Component<Icon> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <span
      class={style.Icon}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      {local.children}
    </span>
  )
}

export default Icon
