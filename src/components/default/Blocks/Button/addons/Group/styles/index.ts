import { type TextProps } from "@ui/Types"
import createStyle from "@ui/default/utils/createStyle"

import styleDefault from "../Group.module.css"
import iOS from "./iOS.module.css"
import android from "./android.module.css"
// import macOS from "./macOS.module.css"
// import windows from "./windows.module.css"
// import others from "./others.module.css"

export const styles = createStyle(styleDefault, {
  iOS,
  android,
  // macOS,
  // windows,
  // others,
})

type TypographyType = "title" | "subTitle"

export const generateTypography = (
  props: Record<TypographyType, TextProps>,
): Record<TypographyType, TextProps> => ({
  title: {
    iOS: {
      size: "medium",
      weight: "500",
      color: "inherit",
    },
    android: "iOS",
    macOS: "iOS",
    windows: "iOS",
    others: "iOS",
    ...props.title,
  },
  subTitle: {
    iOS: {
      size: "small",
      weight: "400",
      color: "inherit",
    },
    android: "iOS",
    macOS: "iOS",
    windows: "iOS",
    others: "iOS",
    ...props.subTitle,
  },
})
