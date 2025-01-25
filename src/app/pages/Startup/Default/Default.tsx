import { Panel } from "components"

import { Content } from "./fragment"

import { type JSX, type Component, onMount } from "solid-js"
import { swipeView, views } from "router"

interface Default extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Default: Component<Default> = (props) => {
  onMount(() => {
    setTimeout(() => {
      swipeView({ viewId: views.PROFILE })
    }, 1000)
  })

  return (
    <Panel {...props}>
      <Content />
    </Panel>
  )
}

export default Default
