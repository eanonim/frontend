import { globalSignal, setter } from "elum-state/solid"
import {
  type JSX,
  type Component,
  createContext,
  onMount,
  createEffect,
  onCleanup,
} from "solid-js"
import {
  HISTORY_ATOM,
  PARAMS_ATOM,
  SETTINGS_ATOM,
  STRUCT_ATOM,
  VIEW_ATOM,
} from "../atom"
import {
  bridgeSessionStorageGet,
  bridgeSetupBackButton,
  listener,
} from "@apiteam/twa-bridge/solid"
import { swipeView } from "../actions/swipeView"
import { backPage } from "../actions/backPage"
import { debounce } from "@solid-primitives/scheduled"

export const RouteContext = createContext({
  pathname: "",
})

interface Route {
  pathname?: string
  children: JSX.Element
  struct: {
    viewId: string
    default: string
    panels: Record<string, string>
  }[]
  startView: string
}

const setButton = debounce((is_visible: boolean) => {
  bridgeSetupBackButton({ is_visible })
}, 120)

const Route: Component<Route> = (props) => {
  const [history] = globalSignal(HISTORY_ATOM)
  const [activeView] = globalSignal(VIEW_ATOM)

  createEffect(() => {
    // const is_visible = history().history.slice(-1)[0]?.is_back || false
    // bridgeSetupBackButton({ is_visible })

    const is_visible =
      history().view[activeView()]?.array?.slice(-1)[0]?.is_back || false
    setButton(is_visible)
  })

  const value = {
    pathname: props.pathname || "",
  }

  onMount(() => {
    setter(SETTINGS_ATOM, value)
    setter(STRUCT_ATOM, props.struct)

    const storage = bridgeSessionStorageGet({ key: "router_history" })
    const storage2 = bridgeSessionStorageGet({ key: "router_params" })
    swipeView({ viewId: props.startView, is_back: false, history: false })
    if (import.meta.env.MODE !== "development") {
      if (storage2.status && storage2.is_json && storage2.value) {
        setter(PARAMS_ATOM, storage2.value)
      }
      if (storage.status && storage.is_json && storage.value) {
        setter(HISTORY_ATOM, storage.value)
      }
    }
    const handleEvent = () => {
      backPage(1)
    }
    listener.on("back_button_pressed", handleEvent)
    /* Если подписаться и отправить go(-2) то сюда тоже придёт событие */
    // window.addEventListener("popstate", handleEvent)
    onCleanup(() => {
      listener.off("back_button_pressed", handleEvent)
      // window.removeEventListener("popstate", handleEvent)
    })
  })

  return (
    <RouteContext.Provider value={value}>
      {props.children}
    </RouteContext.Provider>
  )
}

export default Route
