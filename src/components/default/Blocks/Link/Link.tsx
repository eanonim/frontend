import { styles } from "./styles"

import { type Platform } from "@ui/Types"
import Events, { type IEvents } from "@ui/default/Templates/Events/Events"
import useStyle from "@ui/default/utils/useStyle"

import { type JSX, mergeProps, splitProps, ValidComponent } from "solid-js"

interface Link<T extends ValidComponent> extends IEvents<T> {
  /**
   * Компонент, который будет использоваться для рендеринга Flexbox.
   * По умолчанию используется `a` при href или `button`.
   */
  component?: T

  platform?: Platform

  color?: "accentColor" | "accent"
}

const Link = <T extends ValidComponent>(props: Link<T>): JSX.Element => {
  const style = useStyle(styles, props.platform)
  const merged = mergeProps(
    { component: props.href ? "a" : "button", color: "accentColor" },
    props,
  ) as Link<T>
  const [local, others] = splitProps(merged, [
    "platform",
    "class",
    "classList",
    "children",
    "color",
  ])

  return (
    <Events
      class={style.Link}
      classList={{
        [style[`Link__color--${local.color}`]]: !!local.color,

        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      {local.children}
    </Events>
  )
}

export default Link
