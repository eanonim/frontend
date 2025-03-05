import { View, Path } from "components"
import { panels, useRouterPanel } from "router"

import { type JSX, type Component, createEffect } from "solid-js"

import Action from "app/action"
import Settings from "./Settings/Settings"
import FontSize from "./FontSize/FontSize"
import Backgrounds from "./Backgrounds/Backgrounds"
import BackgroundEdit from "./BackgroundEdit/BackgroundEdit"
import Theme from "./Theme/Theme"
import Premium from "./Premium/Premium"

interface Profile extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Profile: Component<Profile> = (props) => {
  const activePanel = useRouterPanel(props.nav)

  return (
    <View {...props} activePanel={activePanel()}>
      <Path nav={panels.PROFILE} component={Action} />
      <Path nav={panels.SETTINGS} component={Settings} />
      <Path nav={panels.FONTSIZE} component={FontSize} />
      <Path nav={panels.BACKGROUNDS} component={Backgrounds} />
      <Path nav={panels.BACKGROUND_EDIT} component={BackgroundEdit} />
      <Path nav={panels.THEME} component={Theme} />
      <Path nav={panels.PREMIUM} component={Premium} />
    </View>
  )
}

export default Profile
