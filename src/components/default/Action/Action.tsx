import style from "./Action.module.css"

import { toArray } from "engine"

import {
  type JSX,
  type Component,
  splitProps,
  children,
  createMemo,
  For,
  Show,
} from "solid-js"

interface Action extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
  activePanel: string
  bar: JSX.Element
}

const Action: Component<Action> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "classList",
    "children",
    "nav",
    "activePanel",
    "bar",
  ])

  const childs = children(() => local.children)

  const current = createMemo(() => (
    <For
      each={toArray(childs)}
      children={(element) => (
        <Show
          when={element.nav === local.activePanel}
          children={element.component}
        />
      )}
    />
  ))

  return (
    <div
      class={style.Action}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
    >
      <div class={style.Action__before}></div>
      <div class={style.Action__content}>{current()}</div>
      <div class={style.Action__bar}>{local.bar}</div>
      <div class={style.Action__after}></div>
    </div>
  )
}

export default Action
