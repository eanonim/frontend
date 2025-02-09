import { Background, Panel } from "components"

import { Content } from "./fragment"

import { type JSX, type Component, onMount } from "solid-js"
import { routerStruct, swipeView, views } from "router"
import { storeList } from "engine/api"
import { bridgeSessionStorageGet } from "@apiteam/twa-bridge/solid"

interface Default extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Default: Component<Default> = (props) => {
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

  onMount(() => {
    initStore()
  })

  return (
    <Panel {...props}>
      <Content />
    </Panel>
  )
}

export default Default
