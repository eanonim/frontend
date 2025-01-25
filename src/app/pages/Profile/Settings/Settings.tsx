import { Panel, Plug, Title } from "components"

import { Content } from "./fragment"

import { type JSX, type Component, onMount } from "solid-js"
import { swipeView, views } from "router"

interface Settings extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Settings: Component<Settings> = (props) => {
  onMount(() => {
    setTimeout(() => {
      swipeView({ viewId: views.SEARCH })
    }, 5000)
  })

  return (
    <Panel {...props}>
      <Plug full>
        <Plug.Container>
          <Title>PROFILE{"->"}Settings</Title>
        </Plug.Container>
      </Plug>
      {/* <Content /> */}
    </Panel>
  )
}

export default Settings
