import style from "./AccordionContent.module.css"
import { AccordionStore } from "../../context"

import {
  type JSX,
  type Component,
  splitProps,
  useContext,
  createEffect,
  on,
} from "solid-js"
import { createStore, produce } from "solid-js/store"

interface AccordionContent extends JSX.HTMLAttributes<HTMLDivElement> {}

type Store = {
  height: number
  contentHeight: number
  anim: boolean
}

const AccordionContent: Component<AccordionContent> = (props) => {
  const [local, others] = splitProps(props, ["class", "classList", "children"])

  const context = useContext(AccordionStore)

  let ref: HTMLDivElement
  const [store, setStore] = createStore<Store>({
    height: 0,
    contentHeight: 0,
    anim: false,
  })

  createEffect(() => {
    setStore("height", ref!?.clientHeight || 0)
  })

  createEffect(
    on(context?.status!, (status) => {
      setStore(
        produce((store) => {
          store.anim = true

          if (!status) {
            store.contentHeight = store.height
          }

          return store
        }),
      )

      setTimeout(() => setStore("contentHeight", 0), 0)
    }),
  )

  const onTransitionEnd = () => {
    setStore("anim", false)
  }

  return (
    <div
      class={style.AccordionContent}
      classList={{
        [style[`AccordionContent--anim`]]: store.anim,
        [style[`AccordionContent__height--inherit`]]:
          context?.status?.() && !store.anim,

        ...local.classList,
        [`${local.class}`]: !!local.class,
      }}
      style={{
        height: context?.status?.()
          ? store.anim
            ? `${store.height}px`
            : ""
          : `${store.contentHeight}px`,
      }}
      onTransitionEnd={onTransitionEnd}
      {...others}
    >
      <span ref={ref!} class={style.AccordionContent__content}>
        {local.children}
      </span>
    </div>
  )
}

export default AccordionContent
