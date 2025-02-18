import style from "./Events.module.css"

import { type JSX, type ValidComponent, mergeProps, splitProps } from "solid-js"
import { createStore } from "solid-js/store"
import { type DynamicProps, Dynamic } from "solid-js/web"
import {
  debounce,
  leadingAndTrailing,
  throttle,
} from "@solid-primitives/scheduled"

export interface IEvents<T extends ValidComponent>
  extends JSX.HTMLAttributes<DynamicProps<T>> {
  component?: T | ((props: JSX.HTMLAttributes<HTMLElement>) => JSX.Element)
  disabled?: boolean
  href?: string
  target?: "_blank" | "_self" | "_parent" | "_top"
  minHover?: number
  minActive?: number
  platform?: string
}

const isTouchSupport = window && "ontouchstart" in window

const Events = <T extends ValidComponent>(props: IEvents<T>): JSX.Element => {
  const merged = mergeProps(
    { component: "div", minHover: 0, minActive: 300 },
    props,
  )
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "disabled",
    "component",
    "onClick",
    "href",
    "minActive",
    "minHover",
  ])
  const [store, setStore] = createStore({ hover: false, active: false })

  const getClickable = () => {
    const type = local.href ? "a" : local.component || "div"
    if (type === "a" && local.href !== undefined) return true
    if (type !== "a" && local.onClick !== undefined) return true
    return false
  }

  const setActive =
    local.minActive === 0
      ? (status: boolean) => setStore("active", status)
      : leadingAndTrailing(
          debounce,
          (status: boolean) => setStore("active", status),
          local.minActive,
        )
  const setHover =
    local.minHover === 0
      ? (status: boolean) => setStore("hover", status)
      : leadingAndTrailing(
          debounce,
          (status: boolean) => setStore("hover", status),
          local.minActive,
        )

  const onStart = () =>
    !local.disabled && getClickable() && !store.active && setActive(true)

  const onMouseMove = () =>
    !local.disabled &&
    getClickable() &&
    !isTouchSupport &&
    !store.hover &&
    setHover(true)

  const onEnd = () => {
    setHover(
      !!(
        !local.disabled &&
        getClickable() &&
        !isTouchSupport &&
        store.hover &&
        store.active
      ),
    )
    setActive(false)
  }

  const onMouseLeave = () => {
    if (!local.disabled && getClickable() && store.hover) {
      setHover(false)
      setActive(false)
    }
  }

  const handleClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (
    event,
  ) => {
    if (typeof local.onClick === "function" && !local.disabled) {
      event.stopPropagation()
      local.onClick(event as any)
    }
  }

  // const mouseEvent = {
  //   onMouseDown: onStart,
  //   onMouseMove: onMouseMove,
  //   onMouseUp: onEnd,
  //   onMouseLeave: onMouseLeave,
  // }

  // const touchEvent = {
  //   onTouchStart: onStart,
  //   onTouchEnd: onEnd,
  //   onTouchMove: onMouseMove,
  // }

  return (
    <Dynamic
      component={local.href ? "a" : local.component || "div"}
      class={local.class}
      classList={{
        [style.notallocate]: true,
        [style[`Events--pointer`]]: !!local.onClick || !!local.href,
        _disabled: local.disabled,
        _hover: store.hover,
        _active: store.active,
        ...local.classList,
      }}
      // {...(isTouchSupport ? touchEvent : mouseEvent)}
      // {...(!isTouchSupport ? touchEvent : mouseEvent)}
      onTouchStart={onStart}
      onTouchEnd={onEnd}
      onTouchMove={onMouseMove}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseDown={onStart}
      onMouseUp={onEnd}
      onClick={handleClick}
      {...({ href: local.href } as any)}
      {...others}
    />
  )
}

export default Events
