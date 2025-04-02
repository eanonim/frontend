import { View, Path } from "components"
import { panels, useRouterPanel } from "router"

import { type JSX, type Component } from "solid-js"

import Action from "app/action"

interface Rating extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Rating: Component<Rating> = (props) => {
  const activePanel = useRouterPanel(props.nav)

  return (
    <View {...props} activePanel={activePanel()}>
      <Path nav={panels.RATING} component={Action} />
    </View>
  )
}

export default Rating
