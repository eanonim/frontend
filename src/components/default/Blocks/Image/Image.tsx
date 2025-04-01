import style from "./Image.module.css"
import { ImageBadge, ImageOverlay, Preview } from "./addons"

import {
  type JSX,
  type Component,
  splitProps,
  mergeProps,
  ErrorBoundary,
  Suspense,
  SuspenseList,
} from "solid-js"
import { createStore } from "solid-js/store"

interface Image extends JSX.HTMLAttributes<HTMLDivElement> {
  src?: string
}

type Store = {
  isHidden: boolean
  isLoading: boolean
}

type ComponentImage = Component<Image> & {
  Badge: typeof ImageBadge
  Overlay: typeof ImageOverlay
  Preview: typeof Preview
}

const cache = new Map<string, Store>()

const Image: ComponentImage = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "onError",
    "onLoad",
    "src",
  ])

  const [store, setStore] = createStore<Store>(
    cache.get(local.src || "") || {
      isHidden: true,
      isLoading: true,
    },
  )

  const onLoad: JSX.EventHandlerUnion<HTMLImageElement, Event> = (event) => {
    setStore({
      isLoading: false,
      isHidden: false,
    })
    cache.set(local.src || "", store)
    local.onLoad && (local.onLoad as any)(event)
  }

  const onError: JSX.EventHandlerUnion<HTMLImageElement, Event> = (event) => {
    setStore({
      isLoading: false,
      isHidden: true,
    })
    cache.set(local.src || "", store)
    local.onError && (local.onError as any)(event)
  }

  const onLoadedMetadata: JSX.EventHandlerUnion<HTMLImageElement, Event> = (
    event,
  ) => {
    setStore({
      isHidden: false,
    })
    cache.set(local.src || "", store)
    local.onError && (local.onError as any)(event)
  }

  return (
    <div
      class={style.Image}
      classList={{
        [style[`Image--hidden`]]: store.isHidden,
        [style[`Image--loading`]]: store.isLoading,

        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <img
        loading={"lazy"}
        onError={onError}
        onLoad={onLoad}
        onLoadedMetadata={onLoadedMetadata}
        src={local.src}
      />
      {local.children}
    </div>
  )
}

Image.Badge = ImageBadge
Image.Overlay = ImageOverlay
Image.Preview = Preview

export default Image
