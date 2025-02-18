import { Panel } from "components"

import { Content } from "./fragment"

import { type JSX, type Component } from "solid-js"

interface Duplicated extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Duplicated: Component<Duplicated> = (props) => {
  return (
    <Panel {...props}>
      <Content />
    </Panel>
  )
}

export default Duplicated
