import style from "./FixedLayout.module.css"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"

import { type ValidComponent, type Component, splitProps } from "solid-js"

interface FixedLayout<T extends ValidComponent = "div"> extends TypeFlex<T> {
  position: "top" | "bottom"
  background?: "none" | "section_bg_color"
  safe?: boolean
}

const FixedLayout: Component<FixedLayout> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "classList",
    "children",
    "position",
    "background",
    "safe",
  ])

  return (
    <Flex
      class={style.FixedLayout}
      classList={{
        [style[`FixedLayout__background--${local.background}`]]:
          !!local.background,
        [style[`FixedLayout__position--${local.position}`]]: !!local.position,
        [style[`FixedLayout--safe`]]: local.safe,

        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      direction={"column"}
      {...others}
    >
      {local.children}
    </Flex>
  )
}

export default FixedLayout
