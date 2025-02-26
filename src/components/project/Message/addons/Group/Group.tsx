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

  const [systems, setSystems] = createSignal<
    { key: number; scrollTop: number; height: number }[]
  >([])
  const [scrollTops, setScrollTops] = createStore<Record<number, number>>({})

  const [store, setStore] = createStore<Store>({
    scrollTop: 0,
  })

  const setVisible = (key: number, height: number) => {
    setSystems((store) => {
      const elem = store.find((x) => x.key === key)

      if (elem) {
        elem.height = height
      } else {
        store.push({ key, height, scrollTop: 0 })
      }

      for (const item of store) {
        const heightKey = store.reduce(
          (acb, value) => (value.key <= item.key ? acb + value.height : acb),
          0,
        )
        const elem = store.find((x) => x.key === key)

        if (elem) {
          elem.scrollTop = heightKey
          setScrollTops(item.key, heightKey)
        }
      }

      return store
    })
  }

  const getIsVisible = (key: number) => {
    return store.scrollTop >= scrollTops[key]
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
        const scrollY = Math.abs(e.target.scrollTop) + e.target.clientHeight
        // e.target.scrollHeight - e.target.scrollTop
        trigger(scrollY)
      }}
      {...others}
    >
      {/* <div class={style.Group__in}> */}
      <ContextGroup.Provider
        value={{
          getScrollTop: () => store.scrollTop,
          setVisible,
          getIsVisible,
        }}
      >
        {local.children}
      </ContextGroup.Provider>
      {/* </div> */}
    </div>
  )
}

Group.List = List

export default Group
