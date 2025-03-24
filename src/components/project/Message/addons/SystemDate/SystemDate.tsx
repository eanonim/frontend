import style from "./SystemDate.module.css"
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

interface SystemDate<T extends ValidComponent = "span"> extends TypeFlex<T> {
  key: number
}

const SystemDate: Component<SystemDate> = (props) => {
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
    isStop: false,
  })

  let timer: NodeJS.Timeout
  let timerHeight: NodeJS.Timeout

  createEffect(
    on(contextList!?.getHeight, (height) => {
      context?.setVisible(local.key, height)

      setStore("isStop", true)

      if (timerHeight) {
        clearTimeout(timerHeight)
      }

      timerHeight = setTimeout(() => {
        setStore("isStop", false)
      }, 400)
    }),
  )

  createEffect(
    on(context!?.getScrollTop, () => {
      if (store.isStop) return
      if (timer) {
        clearTimeout(timer)
      }

      setStore("isHidden", false)
      timer = setTimeout(() => {
        setStore("isHidden", !!!context?.getIsVisible(local.key))
      }, 1000)
    }),
  )

  return (
    <FixedLayout position={"top"} class={style.SystemDate__FixedLayout}>
      <Flex
        class={style.SystemDate}
        classList={{
          [style[`SystemDate--hidden`]]: store.isHidden,

          [`${local.class}`]: !!local.class,
          ...local.classList,
          _SystemDate: true,
        }}
        width={"100%"}
        {...others}
      >
        <span class={style.SystemDate__in}>
          <span class={style.SystemDate__text}>{local.children}</span>
        </span>
      </Flex>
    </FixedLayout>
  )
}

export default SystemDate
