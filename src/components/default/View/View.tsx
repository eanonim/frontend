import { styles } from "./styles"

import { type HTMLAttributes } from "@ui/Types"
import useStyle from "@ui/default/utils/useStyle"
import LayoutManager from "@ui/default/Templates/LayoutManager/LayoutManager"

import { type Component, splitProps } from "solid-js"

interface View extends HTMLAttributes<HTMLDivElement> {
  nav: string
  activePanel: string
}

const View: Component<View> = (props) => {
  const style = useStyle(styles, props.platform)
  const [local, others] = splitProps(props, [
    "class",
    "classList",
    "platform",
    "children",
    "nav",
    "activePanel",
  ])

  return (
    <LayoutManager
      class={style.View}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      active={local.activePanel}
      elements={local.children}
      styles={{
        firstIndex: style[`View--index-1`],
        lastIndex: style[`View--index-2`],
        firstElement: style[`View--first`],
        lastElement: style[`View--last`],
        next: style[`View--to-next`],
        back: style[`View--to-back`],
      }}
      {...others}
    >
      <LayoutManager.Last class={style.View__Container} />
      <LayoutManager.First class={style.View__Container} />
    </LayoutManager>
  )
}

export default View
