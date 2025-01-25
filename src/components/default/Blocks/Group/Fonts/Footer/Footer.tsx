import style from "./Footer.module.css"

import Text from "@ui/default/Templates/Text/Text"

import { type JSX, type Component, mergeProps, splitProps } from "solid-js"

interface Footer extends JSX.HTMLAttributes<HTMLSpanElement> {}

const Footer: Component<Footer> = (props) => {
  const merged = mergeProps({ mode: "accent" }, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "mode",
  ])

  return (
    <Text
      class={style.Footer}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      iOS={{
        color: "secondary",
        weight: "400",
        size: "small",
      }}
      android={"iOS"}
      macOS={"iOS"}
      windows={"iOS"}
      others={"iOS"}
      {...others}
    >
      {local.children}
    </Text>
  )
}

export default Footer
