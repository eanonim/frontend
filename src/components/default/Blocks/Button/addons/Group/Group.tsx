import { styles } from "./styles"
import { Container } from "./addons"

import { type Platform } from "@ui/Types"
import useStyle from "@ui/default/utils/useStyle"
import Flex, { type Flex as TypeFlex } from "@ui/default/Blocks/Flex/Flex"

import {
  type ValidComponent,
  type Component,
  mergeProps,
  splitProps,
} from "solid-js"

interface Group<T extends ValidComponent = "span"> extends TypeFlex<T> {
  platform?: Platform
}

type ComponentGroup = Component<Group> & {
  Container: typeof Container
}

const Group: ComponentGroup = (props) => {
  const style = useStyle(styles, props.platform)
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "platform",
    "class",
    "classList",
    "children",
  ])

  return (
    <Flex
      alignItems={"start"}
      direction={"column"}
      class={style.Group}
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

Group.Container = Container

export default Group
