import style from "./Image.module.css"
import { ImageBadge, ImageOverlay } from "./addons"

import { type JSX, type Component, splitProps, mergeProps } from "solid-js"
import { createStore } from "solid-js/store"

interface Image extends JSX.HTMLAttributes<HTMLDivElement> {
  src?: string
}

type Store = {
  isHidden: boolean
}

type ComponentImage = Component<Image> & {
  Badge: typeof ImageBadge
  Overlay: typeof ImageOverlay
}

const Image: ComponentImage = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "onError",
    "src",
  ])

  const [store, setStore] = createStore<Store>({ isHidden: false })

  const onError: JSX.EventHandlerUnion<HTMLImageElement, Event> = (event) => {
    setStore("isHidden", true)
    local.onError && (local.onError as any)(event)
  }

  return (
    <div
      class={style.Image}
      classList={{
        [style[`Image--hidden`]]: store.isHidden,

        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <img onError={onError} src={local.src} />
      {local.children}
    </div>
  )
}

Image.Badge = ImageBadge
Image.Overlay = ImageOverlay

export default Image
