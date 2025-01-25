import style from "./Container.module.css"
import Flex from "@ui/default/Blocks/Flex/Flex"

import { type JSX, type Component, mergeProps, splitProps } from "solid-js"
import { type DynamicProps } from "solid-js/web"

interface Container extends JSX.HTMLAttributes<DynamicProps<"div">> {
  align?: "start" | "center" | "end"
}

const Container: Component<Container> = (props) => {
  const merged = mergeProps({ align: "center" }, props) as Container
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "align",
  ])

  return (
    <Flex
      component={"div"}
      class={style.Container}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      alignItems={local.align}
      direction={"column"}
      {...others}
    >
      {local.children}
    </Flex>
  )
}

export default Container
