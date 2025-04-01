import { type JSX, type Component, splitProps } from "solid-js"

interface Gesture {
  startX?: number
  startY?: number
  startT?: Date
  isPressed?: boolean
  isY?: boolean
  isX?: boolean
  isSlideX?: boolean
  isSlideY?: boolean
  isSlide?: boolean
  shiftX?: number
  shiftY?: number
  shiftXAbs?: number
  shiftYAbs?: number
  cancel?: boolean
}

type CustomEvent = (MouseEvent | TouchEvent) & {
  currentTarget: HTMLDivElement
  target: Element
}

export interface GestureEvent extends Gesture {
  originalEvent: MouseEvent | TouchEvent
}

const coordX = (e: any): number =>
  e?.clientX || e?.changedTouches?.[0]?.clientX || 0
const coordY = (e: any): number =>
  e?.clientY || e?.changedTouches?.[0]?.clientY || 0

interface Touch extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onClick"> {
  onClick?(event: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent>): void

  onStart?(event: GestureEvent): void
  onStartX?(event: GestureEvent): void
  onStartY?(event: GestureEvent): void

  onMove?(event: GestureEvent): void
  onMoveX?(event: GestureEvent): void
  onMoveY?(event: GestureEvent): void

  onEnd?(event: GestureEvent): void
  onEndX?(event: GestureEvent): void
  onEndY?(event: GestureEvent): void
}

const Touch: Component<Touch> = (props) => {
  const gesture: Gesture = {}

  const [local, others] = splitProps(props, [
    "children",

    "onClick",

    "onStart",
    "onStartX",
    "onStartY",

    "onMove",
    "onMoveX",
    "onMoveY",

    "onEnd",
    "onEndX",
    "onEndY",
  ])

  const Start = (event: CustomEvent) => {
    event.preventDefault()

    gesture.startX = coordX(event)
    gesture.startY = coordY(event)
    gesture.startT = new Date()
    gesture.isPressed = true

    const startEvent = Object.assign(
      {
        originalEvent: event,
      },
      gesture,
    ) as GestureEvent

    local.onStart && local.onStart(startEvent)
    local.onStartX && local.onStartX(startEvent)
    local.onStartY && local.onStartY(startEvent)
  }

  const Move = (event: CustomEvent) => {
    event.preventDefault()

    if (!gesture.isPressed) {
      return
    }

    if (
      event instanceof TouchEvent &&
      event.touches &&
      event.touches.length > 1
    ) {
      return End(event)
    }

    const shiftX = coordX(event) - (gesture.startX || 0)
    const shiftY = coordY(event) - (gesture.startY || 0)
    const shiftXAbs = Math.abs(shiftX)
    const shiftYAbs = Math.abs(shiftY)

    if (!gesture.isX && !gesture.isY) {
      const willBeX = shiftXAbs >= 5 && shiftXAbs > shiftYAbs
      const willBeY = shiftYAbs >= 5 && shiftYAbs > shiftXAbs

      const willBeSlidedX = willBeX && (!!local.onMoveX || !!local.onMove)
      const willBeSlidedY = willBeY && (!!local.onMoveY || !!local.onMove)

      gesture.isX = willBeX
      gesture.isY = willBeY
      gesture.isSlideX = willBeSlidedX
      gesture.isSlideY = willBeSlidedY
      gesture.isSlide = willBeSlidedX || willBeSlidedY
    }

    if (gesture.isSlide) {
      gesture.shiftX = shiftX
      gesture.shiftY = shiftY
      gesture.shiftXAbs = shiftXAbs
      gesture.shiftYAbs = shiftYAbs

      const startEvent = Object.assign(
        {
          originalEvent: event,
        },
        gesture,
      ) as GestureEvent

      local.onMove && local.onMove(startEvent)
      gesture.isSlideX && local.onMoveX && local.onMoveX(startEvent)
      gesture.isSlideY && local.onMoveY && local.onMoveY(startEvent)
    }
  }

  const End = (event: CustomEvent) => {
    if (!gesture.isX && !gesture.isY) return
    event.preventDefault()

    if (!gesture.isPressed) {
      return
    }

    gesture.cancel = gesture.isSlide

    delete gesture.startX
    delete gesture.startY
    delete gesture.startT

    delete gesture.isPressed
    delete gesture.isY
    delete gesture.isX

    delete gesture.isSlideX
    delete gesture.isSlideY
    delete gesture.isSlide
    delete gesture.shiftX
    delete gesture.shiftY
    delete gesture.shiftXAbs
    delete gesture.shiftYAbs

    const endEvent = Object.assign(
      {
        originalEvent: event,
      },
      gesture,
    ) as GestureEvent

    local.onEnd && local.onEnd(endEvent)
    local.onEndX && local.onEndX(endEvent)
    local.onEndY && local.onEndY(endEvent)
  }

  const Click: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (event) => {
    if (!gesture.cancel) {
      local.onClick && local.onClick(event as any)
      // event.preventDefault();
    }
    // local.onClick && local.onClick(event as any);

    gesture.cancel = false
  }

  const Drag = () => {
    console.log("drag")
  }

  const mouseEvent = {
    onMouseDown: Start,
    onMouseMove: Move,
    onMouseUp: End,
    onMouseLeave: End,
  }

  return (
    <div
      {...others}
      onClick={Click}
      onDragStart={Drag}
      onTouchStart={Start}
      onTouchMove={Move}
      onTouchEnd={End}
      onTouchCancel={End}
      {...mouseEvent}
    >
      {local.children}
    </div>
  )
}

export default Touch
