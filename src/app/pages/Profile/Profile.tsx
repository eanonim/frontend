import { View, Path } from "components"
import { panels, useRouterPanel } from "router"

import { type JSX, type Component } from "solid-js"

import Action from "app/action"
import Settings from "./Settings/Settings"

interface Profile extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Profile: Component<Profile> = (props) => {
  const activePanel = useRouterPanel(props.nav)

  return (
    <View {...props} activePanel={activePanel()}>
      <Path nav={panels.PROFILE} component={Action} />
      <Path nav={panels.SETTINGS} component={Settings} />
    </View>
  )
}

export default Profile
