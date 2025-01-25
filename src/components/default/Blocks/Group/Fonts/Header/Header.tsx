import style from "./Header.module.css"

import Text from "@ui/default/Templates/Text/Text"

import { type JSX, type Component, mergeProps, splitProps } from "solid-js"

interface Header extends JSX.HTMLAttributes<HTMLSpanElement> {
  mode?: "accent" | "primary"
}

const Header: Component<Header> = (props) => {
  const merged = mergeProps({ mode: "accent" }, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "mode",
  ])

  return (
    <Text
      class={style.Header}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      iOS={{
        color: local.mode === "accent" ? "primary" : "secondary",
        weight: "500",
        size: "medium",
      }}
      android={{
        color: local.mode === "accent" ? "accent" : "primary",
        weight: "500",
        size: "medium",
      }}
      macOS={"iOS"}
      windows={"iOS"}
      others={"iOS"}
      {...others}
    >
      {local.children}
    </Text>
  )
}

export default Header
