import style from "./Container.module.css"
import { type JSX, type Component, mergeProps, splitProps } from "solid-js"

interface Container extends JSX.HTMLAttributes<HTMLDivElement> {}

const Container: Component<Container> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <div
      class={style.Container}
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

export default Container
