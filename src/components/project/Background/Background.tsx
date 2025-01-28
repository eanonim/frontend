import { Background1 } from "source"
import style from "./Background.module.css"

import {
  type JSX,
  type Component,
  Switch,
  Match,
  splitProps,
  mergeProps,
} from "solid-js"

interface Background extends JSX.HTMLAttributes<HTMLDivElement> {
  type: "1"
  color?: string
  fixed?: boolean
}

const Background: Component<Background> = (props) => {
  const merged = mergeProps({ color: "var(--secondary_color)" }, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "type",
    "color",
    "fixed",
  ])

  return (
    <div
      class={style.Background}
      classList={{
        [style[`Background--fixed`]]: local.fixed,

        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <Switch>
        <Match when={local.type === "1"}>
          <Background1 class={style.Background__item} color={local.color} />
        </Match>
      </Switch>
    </div>
  )
}

export default Background
