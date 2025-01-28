import { View, Path } from "components"
import { panels, useRouterPanel } from "router"

import { type JSX, type Component } from "solid-js"

import Action from "app/action"
import Chat from "./Chat/Chat"

interface Chats extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Chats: Component<Chats> = (props) => {
  const activePanel = useRouterPanel(props.nav)

  return (
    <View {...props} activePanel={activePanel()}>
      <Path nav={panels.CHATS} component={Action} />
      <Path nav={panels.CHAT} component={Chat} />
    </View>
  )
}

export default Chats
