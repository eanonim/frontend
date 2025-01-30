import style from "./System.module.css"
import ContextGroup from "../Group/context"
import ContextList from "../Group/addons/List/context"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"
import FixedLayout from "@ui/default/Blocks/FixedLayout/FixedLayout"

import {
  type ValidComponent,
  type Component,
  mergeProps,
  splitProps,
  useContext,
  createEffect,
  on,
} from "solid-js"

import { createStore } from "solid-js/store"

interface System<T extends ValidComponent = "span"> extends TypeFlex<T> {
  key: number
}

const System: Component<System> = (props) => {
  const context = useContext(ContextGroup)
  const contextList = useContext(ContextList)

  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "key",
  ])

  const [store, setStore] = createStore({
    isHidden: !context?.getIsVisible(local.key),
  })

  let timer: number

  createEffect(() => {
    context?.setVisible(local.key, !!contextList?.getVisible())
  })

  createEffect(
    on(
      [() => context?.getScrollTop(), () => context?.getIsVisible(local.key)],
      () => {
        if (!!!context?.getIsVisible(local.key)) {
          if (timer) {
            clearTimeout(timer)
          }

          setStore("isHidden", false)
          timer = setTimeout(() => {
            setStore("isHidden", !!!context?.getIsVisible(local.key))
          }, 3000)
        }
      },
    ),
  )

  return (
    <FixedLayout position={"top"} class={style.System__FixedLayout}>
      <Flex
        class={style.System}
        classList={{
          [style[`System--hidden`]]: store.isHidden,

          [`${local.class}`]: !!local.class,
          ...local.classList,
          _system: true,
        }}
        width={"100%"}
        {...others}
      >
        <span class={style.System__in}>
          <span class={style.System__text}>{local.children}</span>
        </span>
      </Flex>
    </FixedLayout>
  )
}

export default System
