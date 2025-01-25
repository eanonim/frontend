import style from "./Avatar.module.css"

import combineStyle from "@ui/default/utils/combineStyle"
import Image from "@ui/default/Blocks/Image/Image"

import { type JSX, type Component, splitProps, mergeProps } from "solid-js"

interface Avatar extends JSX.HTMLAttributes<HTMLDivElement> {
  src?: string
  size?: string
}

const Avatar: Component<Avatar> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "size",
    "style",
  ])

  return (
    <Image
      class={style.Avatar}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      style={combineStyle(
        {
          width: local.size,
          height: local.size,
        },
        local.style,
      )}
      {...others}
    />
  )
}
export default Avatar
