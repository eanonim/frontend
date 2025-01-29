import { Panel } from "components"

import { Content } from "./fragment"

import { type JSX, type Component } from "solid-js"

interface Backgrounds extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Backgrounds: Component<Backgrounds> = (props) => {
  return (
    <Panel {...props}>
      <Content />
    </Panel>
  )
}

export default Backgrounds
