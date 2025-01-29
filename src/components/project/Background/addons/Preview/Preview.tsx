import style from "./Preview.module.css"

import IconBackground from "@ui/default/Blocks/IconBackground/IconBackground"

import { type JSX, type Component, mergeProps, splitProps } from "solid-js"

interface Preview extends JSX.HTMLAttributes<HTMLDivElement> {
  selected?: boolean
}

const Preview: Component<Preview> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "selected",
  ])

  return (
    <IconBackground
      class={style.Preview}
      classList={{
        [style[`Preview--selected`]]: local.selected,

        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      border-radius={"8px"}
      color={"var(--bg_color)"}
      {...others}
    >
      {local.children}
    </IconBackground>
  )
}

export default Preview
