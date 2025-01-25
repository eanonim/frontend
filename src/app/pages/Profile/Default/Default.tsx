import { Panel, Plug, Title } from "components"

import { Content, Header } from "./fragment"

import { type JSX, type Component, onMount } from "solid-js"
import { pages, pushPage, swipeView, views } from "router"

interface Default extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Default: Component<Default> = (props) => {
  return (
    <Panel {...props}>
      <Header />
      <Content />
    </Panel>
  )
}

export default Default
