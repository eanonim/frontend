import { styles } from "./styles"
import { Group } from "./addons"

import { type Platform } from "@ui/Types"
import Events, { type IEvents } from "@ui/default/Templates/Events/Events"
import useStyle from "@ui/default/utils/useStyle"

import {
  type Component,
  type ValidComponent,
  mergeProps,
  splitProps,
} from "solid-js"
import { IconCheck } from "source"

interface Tag<T extends ValidComponent = "span"> extends IEvents<T> {
  /**
   * Компонент, который будет использоваться для рендеринга Flexbox.
   * По умолчанию используется `a` при href или `button`.
   */
  component?: T

  platform?: Platform

  selected?: boolean
}

type ComponentTag = Component<Tag> & {
  Group: typeof Group
}

const Tag: ComponentTag = (props) => {
  const style = useStyle(styles, props.platform)
  const merged = mergeProps(
    { component: props.href ? "a" : "button", selected: false },
    props,
  ) as Tag
  const [local, others] = splitProps(merged, [
    "platform",
    "class",
    "classList",
    "children",
    "selected",
  ])

  return (
    <Events
      class={style.Tag}
      classList={{
        [style[`Tag--selected`]]: local.selected,

        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <span class={style.Tag__circle}>
        <IconCheck />
      </span>
      {local.children}
    </Events>
  )
}

Tag.Group = Group

export default Tag
