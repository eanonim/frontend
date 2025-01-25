import style from "./Content.module.css"
import { type Content, ContentProps } from "./Content.props"

import { context } from "../../SmartData"

import { Show, createEffect, useContext } from "solid-js"

const Content: Content = (props) => {
  const [local, others] = ContentProps(props)
  const values = useContext(context)

  return <Show when={values.content}>{local.children}</Show>
}

export default Content
