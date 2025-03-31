import { styles } from "./styles"
import SegmentedControlContext from "./context"
import { Button } from "./addons"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"
import Separator from "@ui/default/Blocks/Separator/Separator"
import useStyle from "@ui/default/utils/useStyle"

import {
  type Accessor,
  type JSX,
  type Component,
  children,
  For,
  mergeProps,
  onMount,
  Show,
  splitProps,
  ValidComponent,
} from "solid-js"
import { createStore } from "solid-js/store"

interface SegmentedControl<T extends ValidComponent = "span">
  extends TypeFlex<T> {
  onSelected: (key: string) => void
  selected?: string
}

type ComponentSegmentedControl = Component<SegmentedControl> & {
  Button: typeof Button
}

type Store = {
  buttons: { [key in string]: boolean }
  selected?: string
  anim?: boolean
}

const SegmentedControl: ComponentSegmentedControl = (props) => {
  const style = useStyle(styles)
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "onSelected",
    "selected",
  ])

  const [store, setStore] = createStore<Store>({ buttons: {}, anim: false })

  const getChild = (elem: JSX.Element) =>
    children(
      elem as unknown as Accessor<Element>,
    ) as unknown as () => HTMLButtonElement[]

  const getIndexSelected = () =>
    getChild(local.children)().findIndex(
      (x) => x.dataset["key"] === store.selected,
    )

  const getSelected = (key: string) => {
    return !!store.buttons[key]
  }

  const setSelected = (key: string, status: boolean, anim = true) => {
    for (const _key in store.buttons) {
      setStore("buttons", _key, false)
    }
    setStore("buttons", key, status)
    setStore("anim", anim)
    if (status) {
      setStore("selected", key)
      local.onSelected?.(key)
    }
  }

  onMount(() => {
    if (local.selected) {
      setSelected(local.selected, true, false)
    }
  })

  return (
    <SegmentedControlContext.Provider
      value={{
        getSelected: getSelected,
        setSelected: setSelected,
        getAnimation: () => !!store.anim,
      }}
    >
      <span class={style.SegmentedControl}>
        <Flex
          class={style.SegmentedControl__in}
          classList={{
            [style[`SegmentedControl--anim`]]: store.anim,
            [`${local.class}`]: !!local.class,
            ...local.classList,
          }}
          width={"100%"}
          height={"100%"}
          {...others}
        >
          <For each={getChild(local.children)()}>
            {(elem, index) => (
              <>
                {elem}
                <Show when={index() + 1 < getChild(local.children)().length}>
                  <Separator
                    class={style.SegmentedControl__separator}
                    type={"vertical"}
                  />
                </Show>
              </>
            )}
          </For>
          <span
            class={style.SegmentedControl__hover}
            style={{
              width: `calc(100% / ${getChild(local.children)().length})`,
              transform: `translateX(calc(100% * ${getIndexSelected()}))`,
            }}
          ></span>
        </Flex>
      </span>
    </SegmentedControlContext.Provider>
  )
}

SegmentedControl.Button = Button

export default SegmentedControl
