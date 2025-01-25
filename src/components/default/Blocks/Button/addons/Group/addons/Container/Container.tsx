import { styles } from "./styles"

import { type Platform } from "@ui/Types"
import useStyle from "@ui/default/utils/useStyle"
import Flex, { type Flex as TypeFlex } from "@ui/default/Blocks/Flex/Flex"

import {
  type Component,
  type ValidComponent,
  mergeProps,
  splitProps,
} from "solid-js"

interface Container<T extends ValidComponent = "span"> extends TypeFlex<T> {
  platform?: Platform
}

const Container: Component<Container> = (props) => {
  const style = useStyle(styles, props.platform)
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <Flex
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
