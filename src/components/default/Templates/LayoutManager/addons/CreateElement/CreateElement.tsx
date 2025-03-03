import style from "./CreateElement.module.css"
import { LayoutManagerStore } from "../../context"

import {
  type JSX,
  type Component,
  mergeProps,
  splitProps,
  useContext,
  Show,
  createEffect,
  on,
} from "solid-js"
interface CreateElement extends JSX.HTMLAttributes<HTMLDivElement> {
  type: "first" | "last"
}

const CreateElement: Component<CreateElement> = (props) => {
  const context = useContext(LayoutManagerStore)

  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "type",
  ])

  let ref: HTMLDivElement

  const onAnimationEnd = () => {
    context?.onAnimationEnd?.(local.type)
  }

  createEffect(
    on(
      () => context?.getAnim?.(),
      (anim) => {
        if (anim && ref!) {
          const styles = window.getComputedStyle(ref)

          if (styles && (styles.animation || "none").includes("none")) {
            onAnimationEnd()
          }
        }
      },
    ),
  )

  return (
    <Show keyed when={context?.getChild?.(local.type)}>
      {(child) => {
        return (
          <div
            ref={ref!}
            classList={{
              [`${local.class}`]: !!local.class,
              ...local.classList,

              ...context?.styleIndex?.(local.type),
            }}
            {...others}
            onAnimationEnd={onAnimationEnd}
          >
            {child.component({ nav: child.nav })}
          </div>
        )
      }}
    </Show>
  )
}

export default CreateElement
