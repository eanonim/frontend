import style from "./List.module.css"
import ContextList from "./context"

import { createVisibilityObserver } from "@solid-primitives/intersection-observer"
import {
  type JSX,
  type Component,
  mergeProps,
  splitProps,
  createEffect,
} from "solid-js"
import { createStore } from "solid-js/store"

interface List extends JSX.HTMLAttributes<HTMLDivElement> {}

const List: Component<List> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  const [store, setStore] = createStore({ isVisible: false })

  let ref: HTMLDivElement

  const useVisibilityObserver = createVisibilityObserver({
    initialValue: true,
    threshold: 0.9,
  })

  const visible = useVisibilityObserver(() => ref!)

  createEffect(() => {
    setStore("isVisible", visible())
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
      <ContextList.Provider value={{ getVisible: () => store.isVisible }}>
        {local.children}
      </ContextList.Provider>
    </div>
  )
}

export default List
