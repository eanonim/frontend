import style from "./Textarea.module.css"

import { type HTMLAttributes } from "@ui/Types"
import useComputedBlockStyles from "@ui/default/utils/useComputedBlockStyles"

import {
  type JSX,
  type Component,
  mergeProps,
  splitProps,
  onMount,
} from "solid-js"

export interface ITextarea
  extends Omit<HTMLAttributes<HTMLTextAreaElement>, "onInput"> {
  /**
   * Автоматическое растягивание textarea
   */
  grow?: boolean
  /**
   * Максимальная высота поля
   */
  maxHeight?: string
  /**
   *
   */
  resize?: boolean
  /**
   *
   */
  onResize?: (el: HTMLTextAreaElement) => void
  /**
   *
   */
  onInput?: JSX.InputEventHandler<HTMLTextAreaElement, InputEvent>

  placeholder?: string

  value: string
}

const Textarea: Component<ITextarea> = (props) => {
  const merged = mergeProps(
    { grow: true, resize: false, maxHeight: "150px" },
    props,
  )
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "grow",
    "maxHeight",
    "onResize",
    "onInput",
    "resize",
  ])

  let ref: HTMLTextAreaElement
  const styles = useComputedBlockStyles({
    ref: () => ref,
    platform: props.platform,
    onUpdate: () => ref,
  })

  const onResize = () => {
    if (local.grow) {
      if (ref && ref.offsetParent) {
        ref.style.height = "0px"
        ref.style.height = ref.scrollHeight + "px"

        const lineHeight = Number(styles.lineHeight?.replace("px", ""))

        if (ref.scrollTop + ref.clientHeight + lineHeight >= ref.scrollHeight) {
          ref.scrollTop = ref.scrollHeight
        }

        local.onResize && local.onResize(ref)
      }
    }
  }

  onMount(onResize)

  const onInput: JSX.InputEventHandlerUnion<HTMLTextAreaElement, InputEvent> = (
    event,
  ) => {
    onResize()
    local.onInput && local.onInput(event)
  }

  return (
    <textarea
      ref={ref!}
      class={style.Textarea}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,

        [style[`Textarea--resize`]]: local.resize,
      }}
      onInput={onInput}
      style={{
        "max-height": local.maxHeight,
      }}
      {...others}
    />
  )
}

export default Textarea
