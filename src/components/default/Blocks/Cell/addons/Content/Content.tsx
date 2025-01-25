import style from "./Content.module.css"
import { CellStore } from "../../context"

import Show from "@ui/default/Templates/Show/Show"

import {
  type JSX,
  type Component,
  mergeProps,
  splitProps,
  useContext,
} from "solid-js"
import { type DynamicProps } from "solid-js/web"

interface Content extends JSX.HTMLAttributes<DynamicProps<"div">> {}

const Content: Component<Content> = (props) => {
  const context = useContext(CellStore)

  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <Show
      component={"div"}
      class={context.getStyle().content}
      children={local.children}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    />
  )
}

export default Content
