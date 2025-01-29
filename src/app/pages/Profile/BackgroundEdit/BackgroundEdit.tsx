import { Panel } from "components"

import { Content, Footer } from "./fragment"

import { type JSX, type Component } from "solid-js"

interface Backgrounds extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Backgrounds: Component<Backgrounds> = (props) => {
  return (
    <Panel {...props}>
      <Content />
      <Footer />
    </Panel>
  )
}

export default Backgrounds
