import { View, Path } from "components"
import { panels, useRouterPanel } from "router"

import { type JSX, type Component } from "solid-js"

import Action from "app/action"

interface Search extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Search: Component<Search> = (props) => {
  const activePanel = useRouterPanel(props.nav)

  return (
    <View {...props} activePanel={activePanel()}>
      <Path nav={panels.SEARCH} component={Action} />
    </View>
  )
}

export default Search
