import style from "./Flex.module.css"

import combineStyle from "@ui/default/utils/combineStyle"

import { type JSX, type ValidComponent, mergeProps, splitProps } from "solid-js"
import { type DynamicProps, Dynamic } from "solid-js/web"
import { type Property } from "csstype"

export interface Flex<T extends ValidComponent>
  extends JSX.HTMLAttributes<DynamicProps<T>> {
  /**
   * Компонент, который будет использоваться для рендеринга Flexbox.
   * По умолчанию используется `span`.
   */
  component?: T
  /**
   * Выравнивание элементов по вертикальной оси.
   */
  alignItems?: "start" | "center" | "end" | "baseline" | "stretch"
  /**
   * Выравнивание элементов по горизонтальной оси.
   */
  justifyContent?:
    | "start"
    | "center"
    | "end"
    | "space-around"
    | "space-between"
    | "space-evenly"
  /**
   * Направление Flexbox (по горизонтали или вертикали).
   */
  direction?: "row" | "column"
  /**
   * Определяет, должен ли порядок элементов быть обратный.
   */
  reverse?: boolean

  /**
   * Устанавливает высоту flex-контейнера.
   *
   * Может принимать значение в виде строки, представляющей CSS значение,
   * например, `"100px"`, `"50vh"`, `"auto"`, или `"100%"`.
   */
  height?: Property.BlockSize<(string & {}) | 0>

  /**
   * Устанавливает ширину flex-контейнера.
   *
   * Может принимать значение в виде строки, представляющей CSS значение,
   * например, `"100px"`, `"50vw"`, `"auto"`, или `"100%"`.
   */
  width?: Property.BlockSize<(string & {}) | 0>
}

const Flex = <T extends ValidComponent>(props: Flex<T>) => {
  const merged = mergeProps(
    {
      component: "span",
      alignItems: "center",
      justifyContent: "center",
      direction: "row",
      reverse: false,
    },
    props,
  )
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "alignItems",
    "justifyContent",
    "direction",
    "reverse",
    "height",
    "width",
    "style",
  ])

  return (
    <Dynamic
      class={style.Flex}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,

        [style[`Flex__alignItems--${local.alignItems}`]]: !!local.alignItems,
        [style[`Flex__justifyContent--${local.justifyContent}`]]:
          !!local.justifyContent,
        [style[`Flex__direction--${local.direction}`]]: !!local.direction,
        [style[`Flex--reverse`]]: local.reverse,
      }}
      style={combineStyle(
        {
          width: local.width,
          height: local.height,
        },
        local.style,
      )}
      {...others}
    />
  )
}

export default Flex
