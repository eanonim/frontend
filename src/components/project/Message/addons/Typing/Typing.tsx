import style from "./Typing.module.css"
import { type JSX, type Component, splitProps, mergeProps } from "solid-js"

interface Typing extends JSX.HTMLAttributes<HTMLElement> {
  text: string
}

const Typing: Component<Typing> = (props) => {
  const merged = mergeProps(
    { color: "var(--accent_color)", size: 16, text: "prints" },
    props,
  )
  const [local, others] = splitProps(merged, ["color", "size", "text"])

  return (
    <span {...others} class={style.Typing}>
      <span class={style.Typing__badge}></span>
      <span class={style.Typing__badge}></span>
      <span class={style.Typing__badge}></span>
      <span class={style.Typing__text}>{local.text}</span>
    </span>
  )
}

export default Typing
