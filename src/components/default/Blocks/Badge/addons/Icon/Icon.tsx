import style from "./Icon.module.css"

import Around from "@ui/default/Templates/Around/Around"

import {
  type JSX,
  type Component,
  type ValidComponent,
  mergeProps,
  splitProps,
} from "solid-js"
import { type DynamicProps } from "solid-js/web"

interface Icon<T extends ValidComponent = "span">
  extends JSX.HTMLAttributes<DynamicProps<T>> {}

const Icon: Component<Icon> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <Around
      class={style.Icon}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      {local.children}
    </Around>
  )
}

export default Icon
