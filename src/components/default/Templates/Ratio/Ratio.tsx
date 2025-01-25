import style from "./Ratio.module.css"
import { type Component, type JSX } from "solid-js"

interface Ratio extends JSX.HTMLAttributes<HTMLDivElement> {
  width: number
  height: number
}

const Ratio: Component<Ratio> = (props) => {
  return (
    <div class={style.Ratio}>
      <span
        style={{ "padding-top": `${(props.height / props.width) * 100}%` }}
      />
      <div class={style.Ratio__inner}>{props.children}</div>
    </div>
  )
}

export default Ratio
