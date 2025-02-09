import { Background, Panel } from "components"

import { Content } from "./fragment"

import { type JSX, type Component, onMount } from "solid-js"
import { swipeView, views } from "router"
import { storeList } from "engine/api"

interface Default extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Default: Component<Default> = (props) => {
  const initStore = async () => {
    const { response, error } = await storeList({})

    if (!error) {
      if (response.backgroundId) {
        Background.preload(response.backgroundId)
      }
      swipeView({ viewId: views.PROFILE })
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
