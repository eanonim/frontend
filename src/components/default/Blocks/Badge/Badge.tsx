import { styles, generateTypography } from "./styles"
import { Container, Icon } from "./addons"

/* UI */
import { type HTMLAttributes } from "@ui/Types"
import useStyle from "@ui/default/utils/useStyle"
import Flex from "@ui/default/Blocks/Flex/Flex"
import Align from "@ui/default/Templates/Align/Align"
import TextContext from "@ui/default/Templates/Text/context"
/* UI */

import { type JSX, type Component, splitProps, mergeProps } from "solid-js"
import { type DynamicProps } from "solid-js/web"

interface Badge extends HTMLAttributes<DynamicProps<"span">> {
  /**
   * Определяет внешний вид значка.
   */
  appearance?: "accent" | "green" | "red" | "accentReverse"
  /**
   * Определяет стиль отображения значка.
   *
   * - **filled**: Значок заполнен цветом, без границ.
   * - **merges**: Значок сливается с фоном, создавая эффект "заливки".
   * - **outline**: Значок отображается с контуром (обводкой), без заливки.
   */
  mode?: "filled" | "merges" | "outline"
  /**
   * Определяет размер значка.
   */
  size?: "small" | "medium" | "large"
  /**
   * Определяет тип содержимого значка.
   */
  type?: "text" | "icon"
}

const getSizeSubTitle = (type: NonNullable<Badge["size"]>) =>
  ({
    small: "small",
    medium: "small",
    large: "medium",
  }[type] as "small" | "medium" | "large")

const getSizeTitle = (type: NonNullable<Badge["size"]>) =>
  ({
    small: "small",
    medium: "medium",
    large: "large",
  }[type] as "small" | "medium" | "large")

type ComponentBadge = Component<Badge> & {
  Icon: typeof Icon
  Container: typeof Container
}

const Badge: ComponentBadge = (props) => {
  const style = useStyle(styles, props.platform)
  const merged = mergeProps(
    { appearance: "accent", mode: "filled", size: "medium", type: "text" },
    props,
  )
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "appearance",
    "mode",
    "size",
    "type",
    "platform",
  ])

  return (
    <TextContext.Provider
      value={generateTypography({
        title: {
          class: style[`Badge__title`],
          iOS: {
            size: getSizeTitle(local.size as NonNullable<Badge["size"]>),
            weight: "500",
            color: "inherit",
          },
        },
        subTitle: {
          class: style[`Badge__subtitle`],
          iOS: {
            size: getSizeSubTitle(local.size as NonNullable<Badge["size"]>),
            weight: "400",
            color: "inherit",
          },
        },
      })}
    >
      <Flex
        class={style.Badge}
        classList={{
          [style[`Badge__appearance--${local.appearance}`]]: !!local.appearance,
          [style[`Badge__mode--${local.mode}`]]: !!local.mode,
          [style[`Badge__size--${local.size}`]]: !!local.size,
          [style[`Badge__type--${local.type}`]]: !!local.type,

          [`${local.class}`]: !!local.class,
          ...local.classList,
        }}
        {...others}
      >
        {local.children}
        <span class={style.Badge__background} />
      </Flex>
    </TextContext.Provider>
  )
}

Badge.Container = Container
Badge.Icon = Icon

export default Badge
