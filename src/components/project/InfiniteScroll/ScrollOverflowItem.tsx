import {
  Component,
  Show,
  createEffect,
  on,
  onMount,
  splitProps,
} from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import { createStore } from "solid-js/store"

import style from "./ScrollOverflowItem.module.css"
import { createVisibilityObserver } from "@solid-primitives/intersection-observer"

interface ScrollOverflowItem extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element
  lastClassList: JSX.CustomAttributes<HTMLDivElement>["classList"]
  notLast: boolean
  contentRef: HTMLDivElement
}

const ScrollOverflowItem: Component<ScrollOverflowItem> = (props) => {
  let ref: HTMLDivElement
  let refBottom: HTMLDivElement

  const [local, others] = splitProps(props, [
    "children",
    "lastClassList",
    "notLast",
    "contentRef",
  ])

  const [store, setStore] = createStore({
    height: (ref! && ref.offsetHeight) ?? 0,
    when: true,
  })

  const useVisibilityObserver = createVisibilityObserver({
    initialValue: true,
    root: local.contentRef!,
  })
  const visibleBottom = useVisibilityObserver(() => refBottom!)

  createEffect(() => {
    if (store.when) {
      setStore("height", ref!?.offsetHeight ?? 0)
    }
  })
  createEffect(
    on(visibleBottom, (visible) => {
      setStore("when", visible)
    }),
  )

  return (
    <div
      class={style.ScrollOverflowItem}
      style={{
        height: !store.when
          ? store.height > 0
            ? store.height + "px"
            : ""
          : "",
      }}
      classList={{
        [`${others.class}`]: !!others.class,
        ...others.classList,
      }}
      {...others}
    >
      <div
        class={style.ScrollOverflowItem__root}
        classList={local.lastClassList}
        ref={ref!}
      >
        <Show when={store.when}>{local.children}</Show>
        <Show when={local.notLast}>
          <span />
        </Show>
      </div>
      <div ref={refBottom!} class={style.ScrollOverflowItem__bottom} />
    </div>
  )
}

export default ScrollOverflowItem
