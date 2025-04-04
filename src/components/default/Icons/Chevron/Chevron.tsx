import style from "./Chevron.module.css"
import { type JSX, type Component, mergeProps, splitProps } from "solid-js"

import { type Property } from "csstype"

interface Chevron extends JSX.HTMLAttributes<SVGSVGElement> {
  type?: "up" | "down" | "left" | "right"
  size?: Property.Width<(string & {}) | 0>
}

const Chevron: Component<Chevron> = (props) => {
  const merged = mergeProps({ type: "up", size: "24px" }, props)
  const [local, others] = splitProps(merged, [
    "type",
    "class",
    "classList",
    "size",
  ])
  return (
    <svg
      classList={{
        [style[`Chevron__type--${local.type}`]]: !!local.type,

        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      xmlns="http://www.w3.org/2000/svg"
      width={local.size}
      height={local.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...others}
    >
      <path d="M6 15l6 -6l6 6" />
    </svg>
  )
}

export default Chevron
