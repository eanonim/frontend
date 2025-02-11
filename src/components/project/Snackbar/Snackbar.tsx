import style from "./Snackbar.module.css"

import {
  type Component,
  type JSX,
  Show,
  mergeProps,
  splitProps,
} from "solid-js"

interface Snackbar extends JSX.HTMLAttributes<HTMLDivElement> {
  before?: JSX.Element
  after?: JSX.Element
  description?: JSX.Element
  onClose?: () => void
}

const Snackbar: Component<Snackbar> = (props) => {
  const merged = mergeProps({}, props)

  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "before",
    "after",
    "description",
    "onClose",
  ])

  return (
    <div
      // onTouchEnd={local.onClose}
      onClick={local.onClose}
      class={style.Snackbar}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <div class={style.Snackbar__children}>{local.children}</div>
    </div>
  )
}

export default Snackbar
