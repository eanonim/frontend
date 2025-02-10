import { Panel } from "components"

import { Content } from "./fragment"

import { type JSX, type Component } from "solid-js"

interface Theme extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Theme: Component<Theme> = (props) => {
  return (
    <Panel {...props}>
      <Content />
    </Panel>
  )
}

export default Theme
