import style from "./Button.module.css"
import SegmentedControlContext from "../../context"

import ElButton, { type TypeButton } from "@ui/default/Blocks/Button/Button"

import {
  type Component,
  createEffect,
  mergeProps,
  on,
  onMount,
  splitProps,
  useContext,
} from "solid-js"

interface Button extends TypeButton {
  key: string
}

type ComponentButton = Component<Button> & {
  Container: typeof ElButton.Container
  Icon: typeof ElButton.Icon
  Group: typeof ElButton.Group
}

const Button: ComponentButton = (props) => {
  const context = useContext(SegmentedControlContext)

  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "key",
  ])

  const handlerClick = () => {
    context?.setSelected(local.key, true)
  }

  return (
    <ElButton
      data-key={local.key}
      class={style.Button}
      classList={{
        [style[`Button--selected`]]: context?.getSelected(local.key),

        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      mode={"transparent"}
      appearance={"secondary"}
      stretched
      onClick={handlerClick}
      {...others}
    >
      {local.children}
    </ElButton>
  )
}

Button.Container = ElButton.Container
Button.Icon = ElButton.Icon
Button.Group = ElButton.Group

export default Button
