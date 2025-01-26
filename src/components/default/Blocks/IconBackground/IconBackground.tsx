import style from "./IconBackground.module.css"

import combineStyle from "@ui/default/utils/combineStyle"

import { type JSX, type Component, splitProps } from "solid-js"
import { type Property } from "csstype"

interface IconBackground extends JSX.HTMLAttributes<HTMLDivElement> {
  padding?: Property.Padding<(string & {}) | 0>
  color: Property.BackgroundColor
  "border-radius": Property.BorderRadius
}

const IconBackground: Component<IconBackground> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "classList",
    "children",
    "style",
    "padding",
    "color",
    "border-radius",
  ])

  return (
    <div
      class={style.IconBackground}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      style={combineStyle(
        {
          padding: local.padding,
          "background-color": local.color,
          "border-radius": local["border-radius"],
        },
        props.style,
      )}
      {...others}
    >
      {local.children}
    </div>
  )
}

export default IconBackground
