import { Panel, Plug, Title } from "components"

import { Content, Footer } from "./fragment"

import { type JSX, type Component } from "solid-js"

interface Settings extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Settings: Component<Settings> = (props) => {
  return (
    <Panel {...props}>
      <Content />
      <Footer />
    </Panel>
  )
}

export default Settings
