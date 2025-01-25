import style from "./Select.module.css"
import { type JSX, type Component, mergeProps, splitProps } from "solid-js"

interface Select extends JSX.HTMLAttributes<HTMLDivElement> {}

const Select: Component<Select> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <div
      class={style.Select}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      {local.children}
    </div>
  )
}

export default Select
