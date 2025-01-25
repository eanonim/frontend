import { styles } from "./styles"

import { type HTMLAttributes } from "@ui/Types"
import useStyle from "@ui/default/utils/useStyle"
import usePlatform from "@ui/default/utils/usePlatform"
import LayoutManager from "@ui/default/Templates/LayoutManager/LayoutManager"

import { type JSX, type Component, splitProps, createEffect } from "solid-js"

interface Root extends HTMLAttributes<HTMLDivElement> {
  activeView: string
  children: JSX.Element

  modal?: JSX.Element
  popup?: JSX.Element

  tabbar?: JSX.Element
}

const Root: Component<Root> = (props) => {
  const style = useStyle(styles, props.platform)
  const [local, others] = splitProps(props, [
    "class",
    "classList",
    "platform",
    "activeView",
    "children",
    "modal",
    "popup",
    "tabbar",
  ])

  const platform = usePlatform(props.platform)

  createEffect(() => {
    document.documentElement.setAttribute("platform", platform())
  })

  return (
    <LayoutManager
      class={style.Root}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      active={local.activeView}
      elements={local.children}
      styles={{
        firstIndex: style[`Root--index-1`],
        lastIndex: style[`Root--index-2`],
        firstElement: style[`Root--first`],
        lastElement: style[`Root--last`],
        next: style[`Root--to-next`],
        back: style[`Root--to-back`],
      }}
    >
      <LayoutManager.Last class={style.Root__Container} />
      <LayoutManager.First class={style.Root__Container} />

      {/* <Show when={!!local.popup} children={local.popup} /> */}
      {local.popup}
      {local.modal}
      {local.tabbar}
    </LayoutManager>
  )
}

export default Root
