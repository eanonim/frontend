import { Background, Panel } from "components"

import { Content } from "./fragment"

import { type JSX, type Component, onMount } from "solid-js"
import {
  modals,
  pages,
  pushModal,
  pushPage,
  routerStruct,
  swipeView,
  views,
} from "router"
import { authTwa, chatLast, storeList } from "engine/api"
import {
  bridgeGetInitData,
  bridgeSessionStorageGet,
  bridgeSetupFullScreen,
  getPlatform,
} from "@apiteam/twa-bridge/solid"
import { setter } from "elum-state/solid"
import { AUTH_TOKEN_ATOM } from "engine/state"
import { updateSocketToken } from "engine/api/module"
import { Chats } from "engine/class/useChat"
import { parseStartApp } from "engine"
import { clearView } from "router/src"

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

  const initLastChat = async () => {
    const { response, error } = await chatLast({})

    openApp()
    if (response) {
      pushPage({
        pageId: pages.CHAT,
        params: { dialog: response.uuid },
        handler: async () => {
          const chat = Chats.getById(response.uuid)

          if (!!chat?.isOpenGallery) {
            chat.isOpenGallery()
            return false
          }

          if (chat?.isDeleted) {
            swipeView({ viewId: views.SEARCH, clear: true })
            clearView({ viewId: views.CHATS })
          }

          if (chat?.isFavorites || chat?.isDeleted) {
            return true
          }

          pushModal({
            modalId: modals.MODAL_LEAVE,
            params: {
              dialog: response.uuid,
            },
          })

          return false
        },
      })
    }
  }

  const initStore = async () => {
    const { response, error } = await storeList({})
    if (!error) {
      if (response.backgroundId) {
        Background.preload(response.backgroundId)
      }
      initLastChat()
    }
  }

  const initAuth = async () => {
    const start_app = parseStartApp()
    if (import.meta.env.MODE !== "development") {
      const platform = getPlatform()

      if (platform !== "phone") {
        pushPage({ pageId: pages.PLATFORM, is_back: false })
        return
      }
      bridgeSetupFullScreen({ is_full: true })
    }

    const { response, error } = await authTwa({ referrer: start_app.ref })
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
