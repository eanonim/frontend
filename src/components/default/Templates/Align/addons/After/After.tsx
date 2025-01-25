import style from "./After.module.css"
import Show from "@ui/default/Templates/Show/Show"

import { type JSX, type Component, splitProps } from "solid-js"
import { type DynamicProps } from "solid-js/web"

interface After extends JSX.HTMLAttributes<DynamicProps<"span">> {
  when?: boolean
}

const After: Component<After> = (props) => {
  const [local, others] = splitProps(props, ["class", "classList"])

  return (
    <Show
      component={"span"}
      class={style.After}
      classList={{
        ...local.classList,
        [`${local.class}`]: !!local.class,
      }}
      {...others}
    />
  )
}

export default After
