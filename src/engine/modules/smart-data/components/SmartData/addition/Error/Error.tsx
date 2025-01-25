import style from "./Error.module.css"
import { type Error, ErrorProps } from "./Error.props"

import { context } from "../../SmartData"

import { Show, useContext } from "solid-js"

const Content: Error = (props) => {
  const [local, others] = ErrorProps(props)
  const values = useContext(context)

  return <Show when={values.error}>{local.children}</Show>
}

export default Content
