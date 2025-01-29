import { styles } from "./styles"

import { type HTMLAttributes, type Platform, type TextObject } from "@ui/Types"
import usePlatform from "@ui/default/utils/usePlatform"
import useStyle from "@ui/default/utils/useStyle"

import { type Component, mergeProps, splitProps } from "solid-js"

export interface Text extends HTMLAttributes<HTMLSpanElement> {
  iOS?: TextObject | Omit<Platform, "iOS">
  android?: TextObject | Omit<Platform, "android">
  macOS?: TextObject | Omit<Platform, "macOS">
  windows?: TextObject | Omit<Platform, "windows">
  others?: TextObject | Omit<Platform, "others">

  nowrap?: boolean
  overflow?: boolean
  align?: TextObject["align"]
}

const Text: Component<Text> = (props) => {
  const platform = usePlatform(props.platform)
  const style = useStyle(styles, props.platform)

  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "iOS",
    "android",
    "macOS",
    "windows",
    "others",
    "platform",
    "nowrap",
    "overflow",
    "align",
  ])

  const getStyles = () => {
    const key =
      typeof local[platform()] === "string"
        ? (local[platform()] as Platform)
        : platform()

    const { color, size, weight, align } = local[key] as TextObject

    return {
      [style[`Text__color--${color}`]]: !!color,
      [style[`Text__size--${size}`]]: !!size,
      [style[`Text__weight--${weight}`]]: !!weight,
      [style[`Text__align--${local.align || align}`]]: !!local.align || !!align,
    }
  }

  return (
    <span
      class={style.Text}
      classList={{
        ...getStyles(),

        [`${local.class}`]: !!local.class,
        ...local.classList,

        [style[`Text__whiteSpace--nowrap`]]: local.nowrap,
        [style[`Text--overflow`]]: local.overflow,
      }}
      {...others}
    >
      {local.children}
    </span>
  )
}

export default Text
