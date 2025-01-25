import App from "app"
import { render } from "solid-js/web"
import { Route, routerStruct, views } from "router"

import "styles/system.css"

/**
 * Блокировка контекстного меню
 */
document.addEventListener("contextmenu", (e) => e.preventDefault())
document.addEventListener("touchstart", (e) => {
  e.preventDefault()
  e.stopPropagation()
})

render(
  () => (
    <Route pathname={""} startView={views.STARTUP} struct={routerStruct}>
      <App />
    </Route>
  ),
  document.body,
)

import "@ui/index.css"
import "styles/default.css"
