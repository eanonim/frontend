import { type Component } from "solid-js"

import { Path, Root } from "components"
import { pages, useRouter, views } from "router"
import { getLastPage } from "router/src/utils"

import Startup from "./pages/Startup/Startup"
import Search from "./pages/Search/Search"
import Profile from "./pages/Profile/Profile"

const App: Component = () => {
  const activeView = useRouter("view")

  return (
    <Root activeView={activeView()}>
      <Path
        tabbar={[`${pages.SEARCH}`].includes(getLastPage(views.SEARCH) || "")}
        nav={views.SEARCH}
        component={Search}
      />
      <Path
        tabbar={[`${pages.PROFILE}`].includes(getLastPage(views.PROFILE) || "")}
        nav={views.PROFILE}
        component={Profile}
      />

      <Path nav={views.STARTUP} component={Startup} />
    </Root>
  )
}

export default App
