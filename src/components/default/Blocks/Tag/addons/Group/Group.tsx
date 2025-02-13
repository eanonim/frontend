import style from "./Group.module.css"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"

import {
  type Component,
  mergeProps,
  splitProps,
  ValidComponent,
} from "solid-js"

interface Group<V extends ValidComponent = "span"> extends TypeFlex<V> {}

const Group: Component<Group> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <Flex
      class={style.Group}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      justifyContent={"start"}
      wrap
      {...others}
    >
      {local.children}
    </Flex>
  )
}

export default Group
