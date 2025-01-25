import style from "./Container.module.css"
import Flex from "@ui/default/Blocks/Flex/Flex"

import { type JSX, type Component, mergeProps, splitProps } from "solid-js"
import { type DynamicProps } from "solid-js/web"

interface Container extends JSX.HTMLAttributes<DynamicProps<"div">> {}

const Container: Component<Container> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <Flex
      class={style.Content}
      direction={"column"}
      alignItems={"center"}
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

export default Container
