import style from "./Icon.module.css"
import Flex from "@ui/default/Blocks/Flex/Flex"

import { type JSX, type Component, mergeProps, splitProps } from "solid-js"
import { type DynamicProps } from "solid-js/web"

interface Icon extends JSX.HTMLAttributes<DynamicProps<"span">> {}

const Icon: Component<Icon> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <Flex
      component={"span"}
      class={style.Icon}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      {local.children}
    </Flex>
  )
}

export default Icon
