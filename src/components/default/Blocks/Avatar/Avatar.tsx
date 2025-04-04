import style from "./Avatar.module.css"

import combineStyle from "@ui/default/utils/combineStyle"
import Image from "@ui/default/Blocks/Image/Image"

import { type JSX, type Component, splitProps, mergeProps } from "solid-js"

interface Avatar extends JSX.HTMLAttributes<HTMLDivElement> {
  src?: string
  size?: string

  mode?: "default" | "app"
}

const Avatar: Component<Avatar> = (props) => {
  const merged = mergeProps({ mode: "default" }, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "size",
    "style",
    "mode",
  ])

  return (
    <Image
      class={style.Avatar}
      classList={{
        [style[`Avatar__mode--${local.mode}`]]: !!local.mode,
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
