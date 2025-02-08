import { context } from "../../SmartData"

import {
  type Component,
  type JSX,
  Show,
  mergeProps,
  splitProps,
  useContext,
} from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const merged = mergeProps({}, props)

  const [local, others] = splitProps(merged, ["class", "classList", "children"])
  const values = useContext(context)

  // return Show({ when: values.content, children: local.children })

  return <Show when={values.content}>{local.children}</Show>
}

export default Content
