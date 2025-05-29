import style from "./System.module.css"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"
import FixedLayout from "@ui/default/Blocks/FixedLayout/FixedLayout"

import {
  type ValidComponent,
  type Component,
  mergeProps,
  splitProps,
} from "solid-js"

interface System<T extends ValidComponent = "span"> extends TypeFlex<T> {}

const System: Component<System> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "style",
  ])

  return (
    <FixedLayout
      position={"top"}
      class={style.System__FixedLayout}
      style={local.style}
    >
      <Flex
        class={style.System}
        classList={{
          // [style[`System--hidden`]]: store.isHidden,

          [`${local.class}`]: !!local.class,
          ...local.classList,
          _system: true,
        }}
        width={"100%"}
        {...others}
      >
        <span class={style.System__in}>
          <span class={style.System__element}>{local.children}</span>
        </span>
      </Flex>
    </FixedLayout>
  )
}

export default System
