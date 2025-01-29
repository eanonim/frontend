import style from "./Overlay.module.css"
import { type JSX, type Component, mergeProps, splitProps } from "solid-js"

interface Overlay extends JSX.HTMLAttributes<HTMLDivElement> {}

const Overlay: Component<Overlay> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <div
      class={style.Overlay}
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

export default Overlay
