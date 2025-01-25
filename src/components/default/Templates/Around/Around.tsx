import style from "./Around.module.css"

import Flex, { type Flex as TypeFlex } from "@ui/default/Blocks/Flex/Flex"

import {
  type ValidComponent,
  type Component,
  mergeProps,
  splitProps,
} from "solid-js"

interface Around<T extends ValidComponent = "span"> extends TypeFlex<T> {}

const Around: Component<Around> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <Flex
      class={style.Around}
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

export default Around
