import {
  Component,
  For,
  Show,
  children,
  createEffect,
  splitProps,
} from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import style from "./ModalRoot.module.css"
import { toArray } from "engine"
import { createStore } from "solid-js/store"

interface ModalRoot
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> {
  activeModal: string
  children: JSX.Element
  onClose?(): void
  onClick?(): void
}

const ModalRoot: Component<ModalRoot> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "activeModal",
    "classList",
    "children",
    "onClose",
    "onClick",
  ])

  const [store, setStore] = createStore({
    active: local.activeModal,
    to: "up",
    show: false,
    anim: false,
    clear: !local.activeModal,
  })

  const childs = toArray(children(() => local.children))

  createEffect(() => {
    if (!store.anim) {
      //* Открытие модалки */
      if (!store.active && !!local.activeModal) {
        setStore({
          to: "up",
          active: local.activeModal,
          anim: true,
          clear: false,
        })
      }

      //* Закрываем модалку */
      if (!!store.active && !local.activeModal) {
        setStore({
          to: "down",
          anim: true,
          clear: false,
        })
      }

      //* Смена модалки */
      if (store.active != local.activeModal) {
        setStore({
          to: "down",
          anim: true,
          clear: false,
        })
      }

      if (
        !!store.active &&
        !!local.activeModal &&
        store.active === local.activeModal
      ) {
        setStore({
          to: "up",
          active: local.activeModal,
          anim: false,
          clear: false,
        })
      }
    }
  })

  const handlerSwap = (event: any) => {
    if (store.to === "down") {
      setStore({
        active: local.activeModal,
        anim: false,
        clear: !local.activeModal,
      })
    }
    if (store.to === "up") {
      setStore({
        anim: false,
      })
    }
  }

  return (
    <Show when={!store.clear}>
      <div
        class={style.ModalRoot}
        classList={{
          [style["ModalRoot--to-up"]]: store.to === "up",
          [style["ModalRoot--to-down"]]: store.to === "down",
          [style["ModalRoot--show"]]: store.show,

          [`${local.class}`]: !!local.class,
          ...local.classList,
        }}
        {...others}
      >
        <div class={style.ModalRoot__inner}>
          <For
            each={childs}
            children={(element, index) => (
              <Show when={element.nav === store.active}>
                <div
                  data-name={element.nav}
                  class={style.ModalRoot__container}
                  onAnimationEnd={handlerSwap}
                >
                  {element.component({ nav: element.nav })}
                </div>
              </Show>
            )}
          />
        </div>
      </div>
    </Show>
  )
}

export default ModalRoot
