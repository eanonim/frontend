import style from "./Group.module.css"
import { List } from "./addons"

import ContextGroup from "./context"
import {
  leadingAndTrailing,
  debounce,
  throttle,
} from "@solid-primitives/scheduled"

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
    throttle,
    (scrollTop: number) => setStore("scrollTop", scrollTop),
    250,
  )

  return (
    <div
      class={style.Group}
      classList={{
        _visibleScroll: true,
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      onScroll={(e) => {
        trigger(e.target.scrollTop)
      }}
      {...others}
    >
      <div class={style.Group__in}>
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
    </div>
  )
}

Group.List = List

export default Group
