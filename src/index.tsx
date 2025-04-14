import App from "app"
import { render } from "solid-js/web"
import { Route, routerStruct, views } from "router"

import "styles/system.css"

/**
 * Блокировка контекстного меню
 */
document.addEventListener("contextmenu", (e) => e.preventDefault())
document.addEventListener("touchstart", (e) => {
  // e.preventDefault()
  e.stopPropagation()
})

// document.addEventListener("touchend", (e) => {
//   window.document.body.scrollIntoView({ behavior: "smooth", block: "start" })
// })

// document.addEventListener("resize", () => {
//   console.log("resize", window.innerHeight, window.outerHeight)
// })

render(
  () => (
    <Route pathname={"/"} startView={views.STARTUP} struct={routerStruct}>
      <App />
    </Route>
  ),
  document.body,
)

import "@ui/index.css"
import "styles/default.css"
