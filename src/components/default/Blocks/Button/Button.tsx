import { styles, generateTypography } from "./styles"
import { Icon, Container, Group } from "./addons"

/* UI */
import { type HTMLAttributes } from "@ui/Types"
import Spinner from "@ui/default/Blocks/Spinner/Spinner"

import Flex from "@ui/default/Blocks/Flex/Flex"
import Show from "@ui/default/Templates/Show/Show"

import Events from "@ui/default/Templates/Events/Events"
import TextContext from "@ui/default/Templates/Text/context"

import useStyle from "@ui/default/utils/useStyle"
/* UI */

import { type Component, mergeProps, splitProps } from "solid-js"
import { type DynamicProps } from "solid-js/web"

export interface TypeButton extends HTMLAttributes<DynamicProps<"button">> {
  /**
   * Цвет кнопки.
   */
  appearance?: "accent" | "primary" | "secondary" | "red" | "green"

  /**
   * Размер кнопки.
   */
  size?: "small" | "medium" | "large"

  /**
   * Режим отображения кнопки.
   *
   * - **filled**: Кнопка заполнена цветом, без границ.
   * - **merges**: Кнопка сливается с фоном, создавая эффект "заливки".
   * - **outline**: Кнопка отображается с контуром (обводкой), без заливки.
   * - **transparent**: Кнопка будет прозрачной
   */
  mode?: "filled" | "outline" | "merges" | "transparent"

  /**
   * Отключает кнопку.
   */
  disabled?: boolean

  /**
   * Растягивает кнопку на всю ширину контейнера.
   */
  stretched?: boolean

  loading?: boolean

  type?: "default" | "icon"

  /**
   * Нужна ли анимации transition
   */
  anim?: boolean
}

type ComponentButton = Component<TypeButton> & {
  Group: typeof Group
  Container: typeof Container
  Icon: typeof Icon
}

const Button: ComponentButton = (props) => {
  const style = useStyle(styles, props.platform)
  const merged = mergeProps(
    {
      appearance: "accent",
      mode: "fill",
      size: "medium",
      type: "default",
      anim: true,
    },
    props,
  )
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "appearance",
    "size",
    "mode",
    "stretched",
    "platform",
    "loading",
    "type",
    "anim",
  ])

  return (
    <Events
      class={style.Button}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,

        [style[`Button__appearance--${local.appearance}`]]: !!local.appearance,
        [style[`Button__type--${local.type}`]]: !!local.type,
        [style[`Button__size--${local.size}`]]: !!local.size,
        [style[`Button__mode--${local.mode}`]]: !!local.mode,
        [style[`Button--stretched`]]: local.stretched,
        [style[`Button--loading`]]: local.loading,
        [style[`Button--anim`]]: local.anim,
      }}
      {...others}
    >
      <TextContext.Provider
        value={generateTypography({
          title: {
            class: style[`Button__title`],
          },
          subTitle: {
            class: style[`Button__subtitle`],
          },
        })}
      >
        <Flex component={"div"} class={style.Button__in}>
          {local.children}
        </Flex>
        <Show when={local.loading} native>
          <Spinner
            class={style.Button__spinner}
            size={"auto"}
            color={"inherit"}
          />
        </Show>
        <span class={style.Button__background} />
      </TextContext.Provider>
    </Events>
  )
}

Button.Group = Group
Button.Container = Container
Button.Icon = Icon

export default Button
