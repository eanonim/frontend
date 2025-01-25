import { styles } from "./styles"

import { type HTMLAttributes } from "@ui/Types"
import Flex from "@ui/default/Blocks/Flex/Flex"
import useStyle from "@ui/default/utils/useStyle"

import {
  type Component,
  type ValidComponent,
  mergeProps,
  splitProps,
} from "solid-js"
import { type DynamicProps } from "solid-js/web"

interface Size<T extends ValidComponent = "span">
  extends HTMLAttributes<DynamicProps<T>> {
  size?: "small" | "medium" | "large"
}

const Size: Component<Size> = (props) => {
  const style = useStyle(styles, props.platform)
  const merged = mergeProps({ size: "medium" }, props)
  const [local, others] = splitProps(merged, [
    "platform",
    "class",
    "classList",
    "children",
    "size",
  ])

  return (
    <Flex
      class={style.Size}
      classList={{
        [style[`Size__size--${local.size}`]]: !!local.size,
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      {local.children}
    </Flex>
  )
}

export default Size
