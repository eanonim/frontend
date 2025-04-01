import style from "./Swipe.module.css"

import Align from "@ui/default/Templates/Align/Align"
import Touch from "@ui/default/Templates/Touch/Touch"
import useClickOutside from "@ui/default/utils/useClickOutside"

import {
  type Component,
  createEffect,
  type JSX,
  mergeProps,
  splitProps,
} from "solid-js"
import { createStore, produce } from "solid-js/store"
import { type GestureEvent } from "../Touch/Touch"
import { clamp } from "@minsize/utils"

export interface Swipe extends JSX.HTMLAttributes<HTMLDivElement> {
  before?: JSX.Element
  after?: JSX.Element

  /*
  Сколько px от края будет активация ивента
  */
  activated?: number

  /*
  Сколько px от сдвинутого блок будет закрываться ивент
  */
  closed?: number

  /*
  Сколько px от края будет фиксироваться ивента
  */
  fixed?: number
}

type Store = {
  anim: boolean
  swipeX: number
  fixedX: number

  maxBefore: number
  maxAfter: number
}

const Swipe: Component<Swipe> = (props) => {
  const merged = mergeProps({ activated: 100, fixed: 50, closed: 30 }, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "before",
    "children",
    "after",
    "activated",
    "fixed",
    "closed",
    "onClick",
  ])

  let ref: HTMLDivElement | undefined
  let refBefore: HTMLSpanElement
  let refAfter: HTMLSpanElement

  const [store, setStore] = createStore<Store>({
    anim: false,
    swipeX: 0,
    fixedX: 0,

    maxBefore: 0,
    maxAfter: 0,
  })

  createEffect(() => {
    setStore("maxBefore", refBefore!?.clientWidth)
    setStore("maxAfter", refAfter!?.clientWidth)
  })

  const onMoveX = (event: GestureEvent) => {
    const elem = event.originalEvent.target as HTMLDivElement
    const startX = event.startX || 0

    if (
      store.swipeX === 0 &&
      startX >= local.activated &&
      !(startX >= elem.clientWidth - local.activated)
    )
      return

    const shiftX = (event.shiftX || 0) + store.fixedX
    const position = shiftX > 0 ? "left" : "right"

    setStore(
      produce((store) => {
        store.anim = false
        store.swipeX =
          position === "left"
            ? clamp(shiftX, 0, store.maxBefore)
            : clamp(shiftX, -store.maxAfter, 0)
        return store
      }),
    )
  }
  const onEndX = () => {
    setStore(
      produce((store) => {
        store.anim = true

        const swipeXAbs = Math.abs(store.swipeX)

        const position = store.swipeX > 0 ? "left" : "right"
        const isFixed = swipeXAbs >= local.fixed
        const isClosed =
          store.fixedX !== 0 &&
          (position === "left"
            ? Math.abs(store.maxBefore) - local.closed >= swipeXAbs
            : Math.abs(store.maxAfter) - local.closed >= swipeXAbs)

        store.swipeX =
          !isClosed && isFixed
            ? position === "left"
              ? store.maxBefore
              : -store.maxAfter
            : 0
        store.fixedX = store.swipeX
        return store
      }),
    )
  }

  const handlerClose = () => {
    setStore(
      produce((store) => {
        store.anim = true
        store.swipeX = 0
        store.fixedX = store.swipeX
        return store
      }),
    )
  }

  useClickOutside(() => ref, handlerClose)

  const Click: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (event) => {
    console.log("CLICK")
    if (store.fixedX !== 0) {
      handlerClose()
      return
    }
    local.onClick && (local.onClick as any)(event as any)
  }

  return (
    <Touch
      ref={ref!}
      class={style.Swipe}
      classList={{
        [style[`Swipe--anim`]]: store.anim,
      }}
      onMoveX={onMoveX}
      onEndX={onEndX}
      onClick={Click as any}
      {...others}
    >
      <Align
        class={style.Swipe__in}
        style={{
          transform: `translateX(${store.swipeX}px)`,
        }}
      >
        <Align.Before ref={refBefore! as any} class={style.Swipe__before}>
          {local.before}
        </Align.Before>

        <Align.Children class={style.Swipe__children}>
          {local.children}
        </Align.Children>

        <Align.After
          onClick={(event) => {
            console.log("ASG")
            event.stopPropagation()
            event.preventDefault()
          }}
          ref={refAfter! as any}
          class={style.Swipe__after}
        >
          {local.after}
        </Align.After>
      </Align>
    </Touch>
  )
}

export default Swipe
