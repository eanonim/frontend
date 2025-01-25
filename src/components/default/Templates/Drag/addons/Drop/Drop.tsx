import style from "./Drop.module.css"
import { DropContext } from "../../context"

import { type Drags } from "@ui/Types"

import { clamp } from "@minsize/utils"

import {
  type JSX,
  type Component,
  mergeProps,
  splitProps,
  createSignal,
  createEffect,
} from "solid-js"
import { createStore, produce } from "solid-js/store"

interface Drop extends JSX.HTMLAttributes<HTMLDivElement> {
  blockX?: boolean
  safe?: boolean

  onEnd: (to: string, from: string) => void
}

const Drop: Component<Drop> = (props) => {
  const merged = mergeProps({ blockX: false, safe: false }, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "onEnd",
    "blockX",
    "safe",
  ])

  let ref: HTMLDivElement

  const [drags, setDrags] = createStore<{
    items: Record<string, Drags>
    keyActive?: string
    keyLastEdit?: string
  }>({ items: {} })
  const [store, setStore] = createStore({
    block: {
      x: local.blockX,
      safe: local.safe,
    },
    bounding: ref!?.getBoundingClientRect(),
  })

  createEffect(() => {
    setStore(
      produce((store) => {
        store.block.x = local.blockX
        store.block.safe = local.safe

        store.bounding = ref!?.getBoundingClientRect()

        return store
      }),
    )
  })

  const initDrag = (key: string, position: number, ref: HTMLElement) => {
    if (ref) {
      const bounding = ref!.getBoundingClientRect()
      setDrags("items", key, {
        key,
        isActive: false,
        position: {
          element: position,
          bounding,
        },
        transform: { y: 0 },
      })
    }
  }

  const editPositionElement = (key: string, x: number, y: number) => {
    let position = { x, y }

    const drag = drags.items[key]

    if (store.block.safe) {
      position.x = 0
      position.y = clamp(
        y,
        store.bounding.top - (drag?.position.bounding.top || 0),
        store.bounding.height -
          (drag?.position.bounding.height || 0) -
          (drag?.position.bounding.top || 0),
      )
    }

    if (store.block.x) {
      position.x = 0
    }

    setDrags(
      produce((drags) => {
        const isOk = x && y
        const drag = drags.items[key]
        drags.keyActive = key

        if (drag) {
          if (x && y) {
            drag.isActive = true
            drag.isAnim = false
            drag.position.x = position.x
            drag.position.y = position.y
          } else {
            drag.isAnim = true
            if (drag.position.x && drag.position.y) {
              x = drag.position.x
              y = drag.position.y
            }
            drag.position.x = 0
            drag.position.y = 0
          }

          const dragActive = drag
          const boundingDragActive = dragActive.position.bounding

          const dragActiveY = boundingDragActive.y
          const dragActiveHeight = boundingDragActive.height / 2

          const indexActive = drag.position.element

          let lastDragKey: string | undefined

          for (const _key in drags.items) {
            const drag = drags.items[_key]
            if (drag.key === key) continue

            drag.isActive = false

            if (isOk) {
              drag.transform = { y: 0 }
              drag.lastEdit = false
            }

            const boundingY = drag.position.bounding.y

            const index = drag.position.element

            const isPosition = index >= indexActive

            const positionY = y + dragActiveY

            const isHoverBottom = positionY + dragActiveHeight >= boundingY

            const isHoverTop = positionY - dragActiveHeight <= boundingY

            if (y >= 0 && isPosition && isHoverBottom) {
              if (isOk) drag.transform = { y: -boundingDragActive.height }
              lastDragKey = drag.key
            } else if (y < 0 && !isPosition && isHoverTop) {
              if (isOk) drag.transform = { y: boundingDragActive.height }
              if (!lastDragKey) lastDragKey = drag.key
            }
          }

          if (lastDragKey) {
            const lastDrag = drags.items[lastDragKey]
            if (lastDrag) {
              drags.keyLastEdit = lastDragKey
              if (!isOk) {
                const bounding = lastDrag.position.bounding
                drag.transform = { y: bounding.y - boundingDragActive.y }

                drag.position.y = drag.transform.y
              }
            }
          }
        }

        return drags
      }),
    )

    return position
  }

  const getActive = (key: string) => {
    return drags.keyActive ? drags.keyActive !== key : false

    return false
    // const isActiveOnly =
    //   drags().find((x) => x.isActive === true && x.key !== key)?.isActive ||
    //   false

    // return isActiveOnly
  }

  const getTransform = (key: string) => drags.items[key]?.transform || { y: 0 }

  const onEnd = (key: string) => {
    const activeDrag = drags.items[key]
    const lastDrag = drags.items[drags.keyLastEdit || ""] // drags().findLast((x) => x.lastEdit === true)

    if (activeDrag && lastDrag) {
      setDrags(
        produce((drags) => {
          drags.keyActive = undefined
          for (const key in drags.items) {
            const drag = drags.items[key]
            drag.isActive = false
            drag.isAnim = false
            drag.transform = { y: 0 }
          }

          return drags
        }),
      )
      local?.onEnd(lastDrag?.key, activeDrag?.key)
    }
  }

  const getDrag = (key: string) => {
    return drags.items[key]
  }

  return (
    <div
      ref={ref!}
      class={style.Drop}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <DropContext.Provider
        value={{
          getDrag,
          initDrag,
          editPositionElement,
          getActive,
          getTransform,
          onEnd,
          getSettings: () => store,
        }}
      >
        {local.children}
      </DropContext.Provider>
    </div>
  )
}

export default Drop
