import style from "./Group.module.css"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"

import {
  type Component,
  mergeProps,
  splitProps,
  ValidComponent,
} from "solid-js"

interface Group<V extends ValidComponent = "span"> extends TypeFlex<V> {
  padding?: boolean
}

const Group: Component<Group> = (props) => {
  const merged = mergeProps({ padding: true }, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "padding",
  ])

  return (
    <Flex
      class={style.Group}
      classList={{
        [style[`Group--padding`]]: local.padding,

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
