import style from "./Action.module.css"
import { type JSX, type Component, mergeProps, splitProps } from "solid-js"

interface Action extends JSX.HTMLAttributes<HTMLDivElement> {}

const Action: Component<Action> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <div
      class={style.Action}
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

export default Action
