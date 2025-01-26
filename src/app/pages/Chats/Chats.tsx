import { View, Path } from "components"
import { panels, useRouterPanel } from "router"

import { type JSX, type Component, createEffect } from "solid-js"

import Action from "app/action"

interface Chats extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Chats: Component<Chats> = (props) => {
  const activePanel = useRouterPanel(props.nav)

  createEffect(() => {
    console.log({ activePanel: activePanel(), nav: props.nav })
  })

  return (
    <View {...props} activePanel={activePanel()}>
      <Path nav={panels.CHATS} component={Action} />
    </View>
  )
}

export default Chats
