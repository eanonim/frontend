import { Path, View } from "components"
import { panels, useRouterPanel } from "router"

import { type JSX, type Component, createEffect } from "solid-js"

import Duplicated from "./Duplicated/Duplicated"

interface Error extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Error: Component<Error> = (props) => {
  const activePanel = useRouterPanel(props.nav)

  return (
    <View {...props} activePanel={activePanel()}>
      <Path nav={panels.DUPLICATED} component={Duplicated} />
    </View>
  )
}

export default Error
