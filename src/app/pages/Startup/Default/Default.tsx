import { Background, Panel } from "components"

import { Content } from "./fragment"

import { type JSX, type Component, onMount } from "solid-js"
import { routerStruct, swipeView, views } from "router"
import { authTwa, storeList } from "engine/api"
import { bridgeSessionStorageGet } from "@apiteam/twa-bridge/solid"
import { setter } from "elum-state/solid"
import { AUTH_TOKEN_ATOM } from "engine/state"
import { updateSocketToken } from "engine/api/module"

interface Default extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Default: Component<Default> = (props) => {
  console.log("STARTUP")

  const openApp = () => {
    let viewId = views.SEARCH
    if (import.meta.env.MODE !== "development") {
      const storage = bridgeSessionStorageGet({
        key: "router_last_view",
      })

      if (storage.status && storage.is_json && storage.value) {
        const struct = routerStruct.find((x) => x.viewId === storage.value)
        if (!!struct && struct.viewId !== views.STARTUP) {
          viewId = storage.value
        }
      }
    }
    swipeView({ viewId })
  }

  const initStore = async () => {
    const { response, error } = await storeList({})
    if (!error) {
      if (response.backgroundId) {
        Background.preload(response.backgroundId)
      }
      openApp()
    }
  }

  const initAuth = async () => {
    const { response, error } = await authTwa({})
    if (error) {
      return
    }

    setter(AUTH_TOKEN_ATOM, response.token)

    updateSocketToken(response.token)

    initStore()
  }

  onMount(() => {
    initAuth()
  })

  return (
    <Panel {...props}>
      <Content />
    </Panel>
  )
}

export default Default
