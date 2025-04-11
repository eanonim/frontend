import { Panel } from "components"

import { Content, Footer, Header } from "./fragment"

import { type JSX, type Component } from "solid-js"

interface Premium extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Premium: Component<Premium> = (props) => {
  return (
    <Panel {...props}>
      <Header />
      <Content />
      <Footer />
    </Panel>
  )
}

export default Premium
