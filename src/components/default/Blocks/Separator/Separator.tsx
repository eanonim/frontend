import style from "./Separator.module.css"
import { type JSX, type Component, mergeProps, splitProps } from "solid-js"

interface Separator extends JSX.HTMLAttributes<HTMLSpanElement> {
  /**
   * Цвет разделителя.
   */
  color?: "accent" | "primary" | "secondary"
  /**
   * Размер разделителя.
   *
   * - **full** - разделитель на всю ширину
   * - **indent** - разделитель с отступом (слева и справа)
   */
  size?: "full" | "indent"
}

const Separator: Component<Separator> = (props) => {
  const merged = mergeProps({ color: "secondary", size: "full" }, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "color",
    "size",
  ])

  return (
    <span
      class={style.Separator}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,

        [style[`Separator__color--${local.color}`]]: !!local.color,
        [style[`Separator__size--${local.size}`]]: !!local.size,
      }}
      {...others}
    />
  )
}

export default Separator
