import style from "./List.module.css"
import ContextList from "./context"

import {
  type JSX,
  type Component,
  mergeProps,
  splitProps,
  onMount,
  onCleanup,
} from "solid-js"
import { createStore } from "solid-js/store"

interface List extends JSX.HTMLAttributes<HTMLDivElement> {}

const List: Component<List> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  const [store, setStore] = createStore({ height: 0 })

  let ref: HTMLDivElement

  onMount(() => {
    if (ref!) {
      const observer = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          setStore("height", entry.contentRect.height)
        })
      })

      observer.observe(ref)

      onCleanup(() => {
        observer.disconnect()
      })
    }
  })

  return (
    <div
      ref={ref!}
      class={style.List}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <ContextList.Provider value={{ getHeight: () => store.height }}>
        {local.children}
      </ContextList.Provider>
    </div>
  )
}

export default List
