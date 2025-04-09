import { Panel } from "components"

import { Content } from "./fragment"

import { type JSX, type Component } from "solid-js"

interface Platform extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Platform: Component<Platform> = (props) => {
  return (
    <Panel {...props}>
      <Content />
    </Panel>
  )
}

export default Platform
