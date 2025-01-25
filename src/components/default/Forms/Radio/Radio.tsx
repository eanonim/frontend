import style from "./Radio.module.css"

import Events from "@ui/default/Templates/Events/Events"

import { type JSX, type Component, splitProps, mergeProps } from "solid-js"

interface Radio extends JSX.HTMLAttributes<HTMLInputElement> {
  /**
   * Указывает, является ли радиокнопка выбранной.
   */
  checked?: boolean
  /**
   * Обработчик изменения состояния радиокнопки.
   * Принимает два аргумента:
   * - `prev`: Предыдущее состояние радиокнопки (true или false).
   * - `next`: Новое состояние радиокнопки (true или false).
   */
  onChecked?: (prev: boolean, next: boolean) => void
  /**
   * Указывает, является ли радиокнопка отключенной.
   */
  disabled?: boolean
}

const Radio: Component<Radio> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "onChecked",
    "disabled",
  ])

  const handlerChecked = () => {
    !local.disabled &&
      local.onChecked &&
      local.onChecked(!!others.checked, !others.checked)
  }

  return (
    <Events
      class={style.Radio}
      onClick={handlerChecked}
      disabled={local.disabled || !local.onChecked}
    >
      <div class={style.Radio__in}>
        <input
          type={"radio"}
          class={style.Radio__input}
          classList={{
            ...local.classList,
            [`${local.class}`]: !!local.class,
          }}
          disabled={local.disabled || !local.onChecked}
          {...others}
        />
        <span class={style.Radio__circle} />
      </div>
    </Events>
  )
}

export default Radio
