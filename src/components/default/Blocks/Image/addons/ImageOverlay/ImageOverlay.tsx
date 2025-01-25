import style from "./ImageOverlay.module.css"

import Events, { type IEvents } from "@ui/default/Templates/Events/Events"

import { type Component, splitProps, mergeProps } from "solid-js"

interface ImageOverlay extends IEvents<"button"> {
  visibility?: "always" | "hover"
  theme?: "dark" | "light"
}

const isTouchSupport = window && "ontouchstart" in window

const ImageOverlay: Component<ImageOverlay> = (props) => {
  const merged = mergeProps(
    {
      visibility: isTouchSupport ? "always" : "hover",
      theme: "light",
    },
    props,
  )
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "visibility",
    "theme",
  ])

  return (
    <Events
      component={"button"}
      class={style.ImageOverlay}
      classList={{
        [style[`ImageOverlay__visibility--${local.visibility}`]]:
          !!local.visibility,
        [style[`ImageOverlay__theme--${local.theme}`]]: !!local.theme,

        ...local.classList,
        [`${local.class}`]: !!local.class,
      }}
      {...others}
    >
      <div class={style.ImageOverlay__content}>{local.children}</div>
    </Events>
  )
}

export default ImageOverlay
