import { Panel } from "components"

import { Content, Footer, Header } from "./fragment"

import { type JSX, type Component, onMount } from "solid-js"
import { setHeaderColor } from "engine"

interface Default extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Default: Component<Default> = (props) => {
  onMount(() => {
    setHeaderColor({ type: "bg_color" })
  })

  return (
    <Panel {...props}>
      <Header />
      <Content />
      <Footer />
    </Panel>
  )
}

export default Default
