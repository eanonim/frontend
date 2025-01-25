import style from "./Container.module.css"

import Flex, { type Flex as TypeFlex } from "@ui/default/Blocks/Flex/Flex"

import {
  type Component,
  type ValidComponent,
  mergeProps,
  splitProps,
} from "solid-js"

interface Container<T extends ValidComponent = "span"> extends TypeFlex<T> {}

const Container: Component<Container> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <Flex
      direction={"column"}
      class={style.Container}
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
