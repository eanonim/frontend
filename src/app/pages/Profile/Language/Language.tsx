import { Panel } from "components"

import { Content } from "./fragment"

import { type JSX, type Component } from "solid-js"

interface Settings extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Settings: Component<Settings> = (props) => {
  return (
    <Panel {...props}>
      <Content />
    </Panel>
  )
}

export default Settings
