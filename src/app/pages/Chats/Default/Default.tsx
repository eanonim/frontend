import { Panel } from "components"

import { Content } from "./fragment"

import { type JSX, type Component } from "solid-js"

interface Default extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Default: Component<Default> = (props) => {
  return (
    <Panel {...props}>
      <Content />
    </Panel>
  )
}

export default Default
