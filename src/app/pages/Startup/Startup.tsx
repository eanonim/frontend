import { Path, View } from "components"
import { panels, useRouterPanel } from "router"

import { type JSX, type Component } from "solid-js"

import Default from "./Default/Default"

interface Startup extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Startup: Component<Startup> = (props) => {
  const activePanel = useRouterPanel(props.nav)

  return (
    <View {...props} activePanel={activePanel()}>
      <Path nav={panels.STARTUP} component={Default} />
    </View>
  )
}

export default Default
