import { KEYBOARD_ATOM } from "engine/state"
import style from "./Panel.module.css"

import { Component, mergeProps, splitProps } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"

interface Panel extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
  fixed?: boolean

  safeContentTop?: boolean

  safeTop?: boolean
  safeBottom?: boolean
  blurSafeTop?: boolean

  header?: JSX.Element
  footer?: JSX.Element

  // elementSwipeTop?: JSXElement;
  // onSwipeTop?: (position: number) => {
  //   status: boolean,
  //   maxHeight: number
  // }
}

const Panel: Component<Panel> = (props) => {
  // const [lastScrollTop, setLastScrollTop] = createSignal(0)
  // const [scrollTop, setScrollTop] = createSignal(0)

  // const [touchStartY, setTouchStartY] = createSignal(0)
  // const [swipeTopPosition, setSwipeTopPosition] = createSignal(0)
  // const [swipeTopElement, setSwipeTopElemet] = createSignal<boolean>(false)
  // let scrollRef: HTMLDivElement;
  // let touchRef: HTMLDivElement;

  const merged = mergeProps(
    {
      safeContentTop: true,
      blurSafeTop: false,
      safeTop: true,
      safeBottom: true,
      fixed: false,
    },
    props,
  )

  const [local, others] = splitProps(merged, [
    "blurSafeTop",
    "class",
    "children",
    "nav",
    "fixed",
    "safeTop",
    "safeBottom",
    "header",
    "footer",
    "classList",
    "safeContentTop",
  ])

  // let ref: HTMLDivElement

  // createEffect(() => {
  //   function ensureDocumentIsScrollable() {
  //     const isScrollable =
  //       document.documentElement.scrollHeight > window.innerHeight
  //     if (!isScrollable) {
  //       document.documentElement.style.setProperty(
  //         "height",
  //         "calc(100vh + 1px)",
  //         "important",
  //       )
  //     }
  //   }
  //   function preventCollapse() {
  //     if (window.scrollY === 0) {
  //       window.scrollTo(0, 1)
  //     }
  //   }

  //   ref?.addEventListener("touchstart", preventCollapse)

  //   window.addEventListener("load", ensureDocumentIsScrollable)

  //   return () => {
  //     ref?.removeEventListener("touchstart", preventCollapse)
  //     window.removeEventListener("load", ensureDocumentIsScrollable)
  //   }
  // })

  return (
    <div
      data-nav={props.nav}
      class={style.Panel}
      classList={{
        [`${local.class}`]: !!local.class,
        [style.Panel__safeContentTop]: !!local.safeContentTop,
        [style.Panel__safeTop]: !!local.safeTop,
        [style.Panel__blurSafeTop]: !!local.blurSafeTop,
        [style.Panel__before]: !!local.safeTop,
        [style.Panel__after]: !!local.safeBottom,
        [style.Panel__overflow]: !local.fixed,

        ...local.classList,
      }}
      {...others}
    >
      <div class={style.Panel__header}>{local.header}</div>
      <div class={style.Panel__outer}>
        <div class={style.Panel__inner}>{local.children}</div>
      </div>
      <div class={style.Panel__footer}>{local.footer}</div>
    </div>
  )
}

/*

<Show when={swipeTopElement()}>
        <div class={style["Panel__swipe--top"]}>
          {props.elementSwipeTop}
        </div>
      </Show>

      <div class={style.Panel__header}>{local.header}</div>
      <div
        ref={touchRef!}
        classList={{
          [style["Panel__outer--transition"]]: swipeTopPosition() === 0,
          [style["Panel__outer--events"]]: swipeTopPosition() !== 0
        }}
        style={{
          transform: `translateY(${swipeTopPosition()}px)`
        }} class={style.Panel__outer}>
        <div
          ref={scrollRef!}
          class={style.Panel__inner}
        >{local.children}</div>
      </div>*/

export default Panel
