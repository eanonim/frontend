import { createStore, produce } from "solid-js/store"
import style from "./Drag.module.css"
import { Drop, Touch } from "./addons"
import { DropContext, TouchContext } from "./context"

import {
  type JSX,
  type Component,
  mergeProps,
  splitProps,
  createUniqueId,
  useContext,
  createEffect,
  on,
} from "solid-js"

interface Drag extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onClick"> {
  key: string
  position: number
}

type ComponentDrag = Component<Drag> & {
  Drop: typeof Drop
  Touch: typeof Touch
}

type Store = {
  isActive: boolean
  isAnim: boolean
  position: {
    x: number
    y: number
  }
}

const Drag: ComponentDrag = (props) => {
  const context = useContext(DropContext)

  const merged = mergeProps({ key: createUniqueId() }, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "position",
    "key",
  ])

  const [store, setStore] = createStore<Store>({
    isActive: false,
    isAnim: false,
    position: { x: 0, y: 0 },
  })

  let ref: HTMLDivElement

  createEffect(() => {
    context?.initDrag(local.key, local.position, ref!)
  })

  createEffect(() => {
    const drag = context?.getDrag(local.key)

    if (drag) {
      setStore(
        produce((store) => {
          store.isActive = drag.isActive
          store.isAnim = drag.isAnim || false

          if (store.isActive) {
            store.position.x = drag.position.x || 0
            store.position.y = drag.position.y || 0
          } else {
            store.position.x = 0
            store.position.y = drag.transform?.y || 0
          }

          return store
        }),
      )
    }
  })

  return (
    <div
      ref={ref!}
      class={style.Drag}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,

        [style[`Drag--hidden`]]: context?.getActive(local.key),
        [style[`Drag--anim`]]: store.isAnim,
      }}
      {...others}
      style={{
        transform: `translate(${store.position.x}px, ${store.position.y}px)`,
      }}
    >
      <TouchContext.Provider
        value={{
          key: local.key,
          position: local.position,
        }}
      >
        {local.children}
      </TouchContext.Provider>
    </div>
  )
}

Drag.Drop = Drop
Drag.Touch = Touch

export default Drag
