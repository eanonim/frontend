import style from "./Gap.module.css"
import GapContext from "./context"

import Flex, { type Flex as TypeFlex } from "@ui/default/Blocks/Flex/Flex"

import {
  type ValidComponent,
  type Component,
  mergeProps,
  splitProps,
  useContext,
} from "solid-js"
import { type Property } from "csstype"

interface Gap<T extends ValidComponent = "span"> extends TypeFlex<T> {
  count?: Property.Gap<(string & {}) | 0>
}

const Gap: Component<Gap> = (props) => {
  const context = useContext(GapContext)

  const merged = mergeProps({ count: context?.count }, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "count",
  ])

  return (
    <Flex
      class={style.Gap}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      style={{
        gap: local.count,
      }}
      {...others}
    >
      {local.children}
    </Flex>
  )
}

export default Gap
