import style from "./AccordionSummary.module.css"
import { AccordionStore } from "../../context"
import { Arrow } from "./addons"

import { type HTMLAttributes } from "@ui/Types"
import Cell from "@ui/default/Blocks/Cell/Cell"

import {
  type JSX,
  type Component,
  splitProps,
  useContext,
  mergeProps,
} from "solid-js"
import { type DynamicProps } from "solid-js/web"

interface AccordionSummary extends HTMLAttributes<DynamicProps<"article">> {
  /**
   * Заголовок ячейки.
   * Рекомендуем использовать компонент: `Accordion.Summary.Title`
   */
  children?: JSX.Element
  /**
   * Дополнительный текст (подзаголовок), который будет отображаться под основным текстом ячейки.
   *
   * Рекомендуем использовать компонент: `Accordion.Summary.SubTitle`
   *
   * @deprecated
   */
  subtitle?: JSX.Element
  /**
   * Указывает, является ли ячейка неактивной.
   */
  disabled?: boolean
  /**
   * Указывает, должен ли быть отображен разделитель под ячейкой.
   */
  separator?: boolean
}

type ComponentAccordionSummary = Component<AccordionSummary> & {
  Arrow: typeof Arrow
  Container: typeof Cell.Container
  Content: typeof Cell.Content
  Before: typeof Cell.Before
  After: typeof Cell.After
}

const AccordionSummary: ComponentAccordionSummary = (props) => {
  const merged = mergeProps({ separator: false }, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "disabled",
  ])

  const context = useContext(AccordionStore)

  const handlerClick = () => {
    context.onChange && context.onChange()
  }

  return (
    <Cell
      class={style.AccordionSummary}
      onClick={handlerClick}
      selected={context.status?.()}
      {...others}
    >
      {local.children}
    </Cell>
  )
}

AccordionSummary.Arrow = Arrow
AccordionSummary.Container = Cell.Container
AccordionSummary.Content = Cell.Content
AccordionSummary.Before = Cell.Before
AccordionSummary.After = Cell.After

export default AccordionSummary
