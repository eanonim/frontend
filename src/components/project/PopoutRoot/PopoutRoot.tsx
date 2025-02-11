import { Component, For, Show, children, createEffect, splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import style from "./PopoutRoot.module.css";
import { toArray } from "engine";
import { createStore } from "solid-js/store";

interface PopoutRoot extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> {
  activePopout: string;
  children: JSX.Element;
  onClose?(): void;
  onClick?(): void;
};

const PopoutRoot: Component<PopoutRoot> = (props) => {

  const [local, others] = splitProps(props, [
    "class",
    "activePopout",
    "classList",
    "children",
    "onClose",
    "onClick"
  ])

  const [store, setStore] = createStore({
    active: local.activePopout,
    to: "up",
    show: false,
    anim: false,
    clear: !local.activePopout
  })

  const childs = toArray(children(() => local.children));

  createEffect(() => {
    if (!store.anim) {
      //* Открытие модалки */
      if (!store.active && !!local.activePopout) {
        setStore({
          to: "up",
          active: local.activePopout,
          anim: true,
          clear: false
        })
      }

      //* Закрываем модалку */
      if (!!store.active && !local.activePopout) {
        setStore({
          to: "down",
          anim: true,
          clear: false
        })
      }

      //* Смена модалки */
      if (store.active != local.activePopout) {
        setStore({
          to: "down",
          anim: true,
          clear: false
        })
      }

      if (!!store.active && !!local.activePopout && store.active === local.activePopout) {
        setStore({
          to: "up",
          active: local.activePopout,
          anim: false,
          clear: false
        })
      }

    }
  })

  const handlerSwap = (event: any) => {
    if (store.to === "down") {
      setStore({
        active: local.activePopout,
        anim: false,
        clear: !local.activePopout
      })
    }
    if (store.to === "up") {
      setStore({
        anim: false
      })
    }
  }
  return (
    <Show when={!store.clear}>
      <div
        class={style.PopoutRoot}
        classList={{
          [style["PopoutRoot__mode--popover"]]: store.active.toLowerCase().indexOf("popover") != -1,
          [style["PopoutRoot__mode--snackbar"]]: store.active.toLowerCase().indexOf("snackbar") != -1,

          [style["PopoutRoot--to-up"]]: store.to === "up",
          [style["PopoutRoot--to-down"]]: store.to === "down",
          [style["PopoutRoot--show"]]: store.show,

          [`${local.class}`]: !!local.class,
          ...local.classList
        }}
        {...others}
      >
        <div class={style.PopoutRoot__inner}>
          <For each={childs} children={(element, index) =>
            <Show when={element.nav === store.active}>
              <div
                data-name={element.nav}
                class={style.PopoutRoot__container}
                onAnimationEnd={handlerSwap}
              >{element.component({ nav: element.nav })}</div>
            </Show>
          } />
        </div>
      </div>
    </Show >
  )
}

export default PopoutRoot;