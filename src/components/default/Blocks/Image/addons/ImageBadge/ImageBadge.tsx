import style from "./ImageBadge.module.css"

import { type JSX, type Component, splitProps } from "solid-js"

interface ImageBadge extends JSX.HTMLAttributes<HTMLElement> {}

const ImageBadge: Component<ImageBadge> = (props) => {
  const [local, others] = splitProps(props, ["class", "classList", "children"])
  return (
    <span
      class={style.ImageBadge}
      classList={{
        ...local.classList,
        [`${local.class}`]: !!local.class,
      }}
      {...others}
    >
      {local.children}
    </span>
  )
}

export default ImageBadge
