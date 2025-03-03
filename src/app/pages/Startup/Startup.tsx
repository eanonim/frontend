import { Path, View } from "components"
import { panels, useRouterPanel } from "router"

import { type JSX, type Component, createEffect } from "solid-js"

import Default from "./Default/Default"
import { useHeaderColor } from "engine"

interface Startup extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Startup: Component<Startup> = (props) => {
  const activePanel = useRouterPanel(props.nav)

  useHeaderColor({ iOS: "bg_color", android: "bg_color" })

  return (
    <View {...props} activePanel={activePanel()}>
      <Path nav={panels.STARTUP} component={Default} />
    </View>
  )
}

export default Startup
