import style from "./Icon.module.css"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"

import { type ValidComponent, type Component, splitProps } from "solid-js"

interface Icon<T extends ValidComponent = "span"> extends TypeFlex<T> {}

const Icon: Component<Icon> = (props) => {
  const [local, others] = splitProps(props, ["class", "classList", "children"])

  return (
    <Flex
      class={style.Icon}
      classList={{
        ...local.classList,
        [`${local.class}`]: !!local.class,
      }}
      width={"100%"}
      height={"100%"}
      {...others}
    >
      {local.children}
    </Flex>
  )
}

export default Icon
