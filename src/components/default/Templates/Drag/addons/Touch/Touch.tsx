import style from "./Touch.module.css"
import { DropContext, TouchContext } from "../../context"

import ElTouch, { type GestureEvent } from "@ui/default/Templates/Touch/Touch"

import {
  type JSX,
  type Component,
  mergeProps,
  splitProps,
  useContext,
  createEffect,
} from "solid-js"
import { createStore, produce } from "solid-js/store"

interface Touch extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onClick"> {}

type Store = {
  isActive: boolean
  isAnim: boolean
  position: {
    x: number
    y: number
  }
  settings?: {
    block: {
      x: boolean
      safe: boolean
    }
    bounding: DOMRect
  }
}

const Touch: Component<Touch> = (props) => {
  const contextTouch = useContext(TouchContext)
  if (!contextTouch) {
    throw new Error("TouchContext undefined")
  }

  const context = useContext(DropContext)

  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  let ref: HTMLDivElement

  const onStart = (event: GestureEvent) => {
    const x = event.shiftX
    const y = event.shiftY
    if (x && y) {
      context?.editPositionElement(contextTouch.key, x, y)
    }
  }
  const onMove = (event: GestureEvent) => {
    const x = event.shiftX
    const y = event.shiftY
    if (x && y) {
      context?.editPositionElement(contextTouch.key, x, y)
    }
  }

  const onEnd = (event: GestureEvent) => {
    context?.editPositionElement(contextTouch.key, 0, 0)
    setTimeout(onTransitionEnd, 300)
  }

  const onTransitionEnd = () => {
    const drag = context?.getDrag(contextTouch.key)
    if (drag?.isAnim) {
      context?.onEnd(contextTouch.key)
    }
  }

  return (
    <ElTouch
      ref={ref!}
      class={style.Touch}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
      onStart={onStart}
      onMove={onMove}
      onEnd={onEnd}
      onTransitionEnd={onTransitionEnd}
    >
      {local.children}
    </ElTouch>
  )
}

export default Touch
