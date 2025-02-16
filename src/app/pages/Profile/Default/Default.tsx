import { Panel } from "components"

import { Content, Footer, Header } from "./fragment"

import { type JSX, type Component } from "solid-js"

interface Default extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Default: Component<Default> = (props) => {
  return (
    <Panel {...props}>
      <Header />
      <Content />
      <Footer />
    </Panel>
  )
}

export default Default
