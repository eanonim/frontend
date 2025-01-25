import { styles } from "./styles"
import { Textarea } from "./addons"

import { type HTMLAttributes } from "@ui/Types"
import useStyle from "@ui/default/utils/useStyle"

import { type JSX, type Component, mergeProps, splitProps } from "solid-js"

interface Field extends HTMLAttributes<HTMLDivElement> {}

type ComponentField = Component<Field> & {
  Textarea: typeof Textarea
}

const Field: ComponentField = (props) => {
  const style = useStyle(styles, props.platform)
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "platform",
    "class",
    "classList",
    "children",
  ])

  return (
    <div
      class={style.Field}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      {local.children}
    </div>
  )
}

Field.Textarea = Textarea

export default Field
