import style from "./Title.module.css"

import { type TextProps } from "@ui/Types"
import Text, { type Text as TypeText } from "@ui/default/Templates/Text/Text"
import TextContext from "@ui/default/Templates/Text/context"

import { type Component, mergeProps, splitProps, useContext } from "solid-js"

interface Title extends TypeText {
  mode?: "default"
}

const modes: Record<"default", TextProps> = {
  default: {
    iOS: {
      color: "primary",
      size: "medium",
      weight: "500",
    },
    android: "iOS",
    macOS: "iOS",
    windows: "iOS",
    others: "iOS",
  },
}

const Title: Component<Title> = (props) => {
  const context = useContext(TextContext)

  const merged = mergeProps({ mode: "default" }, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "mode",
  ])

  return (
    <Text
      class={style.Title}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...(context?.title
        ? (context.title as any)
        : modes[local.mode as NonNullable<Title["mode"]>])}
      {...others}
    >
      {local.children}
    </Text>
  )
}

export default Title
