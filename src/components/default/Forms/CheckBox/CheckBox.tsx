import { styles } from "./styles"

import { type HTMLAttributes } from "@ui/Types"
import useStyle from "@component/default/utils/useStyle"
import Events from "@ui/default/Templates/Events/Events"
import IconCheck from "@ui/default/Icons/Check.svg"

import { type JSX, type Component, splitProps, mergeProps } from "solid-js"

interface CheckBox extends HTMLAttributes<HTMLInputElement> {
  /**
   * Указывает, является ли чекбокс отмеченным.
   */
  checked?: boolean
  /**
   * Обработчик изменения состояния чекбокса.
   * Принимает два аргумента:
   * - `prev`: Предыдущее состояние чекбокса (true или false).
   * - `next`: Новое состояние чекбокса (true или false).
   */
  onChecked?: (prev: boolean, next: boolean) => void
  /**
   * Указывает, является ли чекбокс отключенным.
   */
  disabled?: boolean
}

const CheckBox: Component<CheckBox> = (props) => {
  const style = useStyle(styles, props.platform)
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
      class={style.CheckBox}
      onClick={handlerChecked}
      disabled={local.disabled || !local.onChecked}
    >
      <div class={style.CheckBox__in}>
        <input
          type={"checkbox"}
          class={style.CheckBox__input}
          classList={{
            ...local.classList,
            [`${local.class}`]: !!local.class,
          }}
          disabled={local.disabled || !local.onChecked}
          {...others}
        />
        <span class={style.CheckBox__icon}>
          <IconCheck />
        </span>
      </div>
    </Events>
  )
}

export default CheckBox
