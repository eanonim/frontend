import { styles, generateTypography } from "./styles"
import {
  After,
  Before,
  CellList,
  Container,
  Content,
  Separator,
} from "./addons"

/* UI */
import { type HTMLAttributes } from "@ui/Types"

import { Events, Align, usePlatform, useStyle, TextContext } from "@ui/index"

// import Events from "@ui/default/Templates/Events/Events"
// import Align from "@ui/default/Templates/Align/Align"

// import usePlatform from "@ui/default/utils/usePlatform"
// import useStyle from "@ui/default/utils/useStyle"
// import TextContext from "@ui/default/Templates/Text/context"
/* UI */

import { type JSX, type Component, splitProps, mergeProps } from "solid-js"
import { type DynamicProps } from "solid-js/web"
import { CellStore } from "./context"

interface Cell extends HTMLAttributes<DynamicProps<"article">> {
  /**
   * Заголовок ячейки.
   * Рекомендуем использовать компонент: `Title`
   */
  children?: JSX.Element
  /**
   * Дополнительный текст (подзаголовок), который будет отображаться под основным текстом ячейки.
   *
   * Рекомендуем использовать компонент: `SubTitle`
   *
   * @deprecated
   */
  subtitle?: JSX.Element
  /**
   * Указывает, должен ли быть отображен разделитель под ячейкой.
   */
  separator?: boolean
  /**
   * Указывает, является ли ячейка неактивной.
   */
  disabled?: boolean
  /**
   * Указывает, должна ли ячейка быть выделена (активна).
   */
  selected?: boolean
  /**
   * !НЕ ГОТОВ
   * Управляет видимостью иконки шеврона `›`
   *
   * - `auto` - добавляет шеврон справа только для платформы `ios`;
   * - `always` - всегда показывает шеврон.
   */
  expandable?: "auto" | "always"

  size?: "default" | "small"
}

type ComponentCell = Component<Cell> & {
  List: typeof CellList
  Container: typeof Container
  Content: typeof Content
  Before: typeof Before
  After: typeof After
}

const Cell: ComponentCell = (props) => {
  const style = useStyle(styles, props.platform)
  const platform = usePlatform(props.platform)

  const merged = mergeProps({ separator: false, size: "default" }, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "subtitle",
    "separator",
    "selected",
    "platform",
    "size",
  ])

  return (
    <TextContext.Provider
      value={generateTypography({
        title: {
          class: style["Cell__title"],
        },
        subTitle: {
          class: style["Cell__subtitle"],
        },
      })}
    >
      <CellStore.Provider
        value={{
          getPlatform: platform,
          isSeparator: () => local.separator,
          getStyle: () => ({
            container: style.Cell__container,
            content: style.Cell__content,
            separator: style.Cell__separator,
            before: style.Cell__before,
            after: style.Cell__after,
          }),
        }}
      >
        <Events
          class={style.Cell}
          classList={{
            ...local.classList,
            [`${local.class}`]: !!local.class,

            [style[`Cell__size--${local.size}`]]: !!local.size,
            [style[`Cell--selected`]]: local.selected,
          }}
          {...others}
        >
          <Align
            alignItems={"normal"}
            component={"article"}
            class={style.Cell__in}
          >
            {local.children}
          </Align>
          <Separator
            when={
              ["android", "windows", "others"].indexOf(platform()) !== -1 &&
              local.separator
            }
          />
          <span class={style.Cell__background} />
        </Events>
      </CellStore.Provider>
    </TextContext.Provider>
  )
}

Cell.Before = Before
Cell.List = CellList
Cell.Container = Container
Cell.Content = Content
Cell.After = After

export default Cell
