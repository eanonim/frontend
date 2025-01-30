import style from "./Group.module.css"
import { List } from "./addons"

import ContextGroup from "./context"
import { leadingAndTrailing, debounce } from "@solid-primitives/scheduled"

import {
  type JSX,
  type Component,
  mergeProps,
  splitProps,
  onMount,
  onCleanup,
  createSignal,
} from "solid-js"
import { createStore } from "solid-js/store"

interface Group extends JSX.HTMLAttributes<HTMLDivElement> {}

type ComponentGroup = Component<Group> & {
  List: typeof List
}

type Store = {
  scrollTop: number
}

const Group: ComponentGroup = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  const [systems, setSystems] = createSignal<{ key: number; value: boolean }[]>(
    [],
  )

  const [store, setStore] = createStore<Store>({
    scrollTop: 0,
  })

  let ref: HTMLDivElement

  const setVisible = (key: number, value: boolean) => {
    setSystems((store) => {
      const elem = store.find((x) => x.key === key)
      if (elem) {
        elem.value = value
      } else {
        store.push({ key, value })
      }
      return store
    })
  }

  const getIsVisible = (key: number) => {
    return !!systems().find((x) => x.key <= key && x.value === true)
  }

  const trigger = leadingAndTrailing(
    debounce,
    (scrollTop: number) => setStore("scrollTop", scrollTop),
    250,
  )

  return (
    <div
      ref={ref!}
      class={style.Group}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      onScroll={(e) => {
        trigger(e.target.scrollTop)
      }}
      {...others}
    >
      <ContextGroup.Provider
        value={{
          getScrollTop: () => store.scrollTop,
          setVisible,
          getIsVisible,
        }}
      >
        {local.children}
      </ContextGroup.Provider>
    </div>
  )
}

Group.List = List

export default Group
