import { Component, Show, createEffect, mergeProps, splitProps } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"

import style from "./ModalPanel.module.css"
import { createStore } from "solid-js/store"
import { IconClose } from "source"

interface ModalPanel
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onClick"> {
  nav: string
  onClick?: JSX.EventHandlerUnion<any, MouseEvent>
  mode?: "panel" | "card"
  isFull?: boolean
  footer?: JSX.Element
  header?: JSX.Element
  headerCenter?: boolean
}

const ModalPanel: Component<ModalPanel> = (props) => {
  const merged = mergeProps(
    {
      isFull: false,
      headerCenter: false,
    },
    props,
  )

  const [local, others] = splitProps(merged, [
    "nav",
    "onClick",
    "children",
    "mode",
    "isFull",
    "footer",
    "header",
    "headerCenter",
    "class",
    "classList",
  ])

  let refFooter: HTMLDivElement
  let ref: HTMLDivElement

  const [store, setStore] = createStore({
    footerHeight: 0,
    headerHeight: 0,
    full: false,
  })

  createEffect(() => {
    setStore("footerHeight", refFooter!?.offsetHeight)
  })

  const handlerClose: JSX.EventHandlerUnion<HTMLSpanElement, MouseEvent> = (
    e,
  ) => {
    local.onClick && (local.onClick as any)(e)
  }

  createEffect(() => {
    if (ref! && local.mode === "panel") {
      setStore("full", ref.offsetHeight >= window.innerHeight)
    }
  })

  return (
    <div
      class={style.ModalPanel}
      onClick={handlerClose}
      classList={{
        [style.ModalPanel__openFull]: local.isFull,
        [style["ModalPanel__header--center"]]: local.headerCenter,
        [style["ModalPanel--card"]]: local.mode === "card",
        [style["ModalPanel--panel"]]: local.mode === "panel",
        [style["ModalPanel--panel"]]: local.mode === "panel",
        [style[`ModalPanel__footer--enable`]]: !!local.footer,
        [style[`ModalPanel__full--open`]]: store.full,
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <div class={style.ModalPanel__inner}>
        <div ref={ref!} class={style.ModalPanel__children}>
          {/* <Show when={local.onClick}>
            <span
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handlerClose(e)
              }}
              class={style.ModalPanel__close}
            >
              <IconClose width={28} height={28} />
            </span>
          </Show> */}
          <div id={local.nav + "--scroll"} class={style.ModalPanel__scroll}>
            <div
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              class={style.ModalPanel__content}
            >
              <Show when={local.header}>
                <div
                  id={local.nav + "--header"}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  class={style.ModalPanel__header}
                >
                  {local.header}
                  <span />
                </div>
              </Show>
              {local.children}
            </div>
          </div>

          <Show when={local.footer}>
            <div
              id={local.nav + "--footer"}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              class={style.ModalPanel__footer}
            >
              <span />
              {local.footer}
            </div>
          </Show>
        </div>
      </div>
    </div>
  )
}

export default ModalPanel
