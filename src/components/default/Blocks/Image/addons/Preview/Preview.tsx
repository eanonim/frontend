import style from "./Preview.module.css"

import Flex from "@component/default/Blocks/Flex/Flex"
import { type TypeFlex } from "@component/index"

import { type Component, splitProps, ValidComponent } from "solid-js"

interface Preview<T extends ValidComponent = "span"> extends TypeFlex<T> {}

const Preview: Component<Preview> = (props) => {
  const [local, others] = splitProps(props, ["class", "classList", "children"])
  return (
    <Flex
      class={style.Preview}
      classList={{
        ...local.classList,
        [`${local.class}`]: !!local.class,
      }}
      {...others}
    >
      {local.children}
    </Flex>
  )
}

export default Preview
