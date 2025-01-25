import style from "./SubTitle.module.css"

import { type TextProps } from "@ui/Types"
import Text, { type Text as TypeText } from "@ui/default/Templates/Text/Text"
import TextContext from "@ui/default/Templates/Text/context"

import { type Component, mergeProps, splitProps, useContext } from "solid-js"

interface SubTitle extends TypeText {
  mode?: "default"
}

const modes: Record<"default", TextProps> = {
  default: {
    iOS: {
      color: "secondary",
      size: "small",
      weight: "400",
    },
    android: "iOS",
    macOS: "iOS",
    windows: "iOS",
    others: "iOS",
  },
}

const SubTitle: Component<SubTitle> = (props) => {
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
      class={style.SubTitle}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
      {...(context?.subTitle
        ? (context.subTitle as any)
        : modes[local.mode as NonNullable<SubTitle["mode"]>])}
    >
      {local.children}
    </Text>
  )
}

export default SubTitle
