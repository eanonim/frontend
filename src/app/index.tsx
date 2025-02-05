import { createEffect, onCleanup, onMount, type Component } from "solid-js"

import { Path, Root } from "components"
import { pages, useRouter, views } from "router"
import { getLastPage } from "router/src/utils"

import Startup from "./pages/Startup/Startup"
import Search from "./pages/Search/Search"
import Profile from "./pages/Profile/Profile"
import Chats from "./pages/Chats/Chats"
import {
  bridgeRequestSafeAreaInset,
  EventSafeAreaChanged,
  EventsData,
  listener,
  bridgeSetupFullScreen,
  EventContentSafeAreaChanged,
  bridgeRequestContentSafeAreaInset,
  EventViewportChanged,
  bridgeRequestViewport,
  bridgeSetupSwipeBehavior,
  bridgeGetInitData,
  getAppData,
} from "@apiteam/twa-bridge/solid"
import { setHeaderColor } from "engine"
import { KEYBOARD_ATOM } from "engine/state"
import { getter, globalSignal, setter } from "elum-state/solid"
import { createStore } from "solid-js/store"

const App: Component = () => {
  const [keyboard] = globalSignal(KEYBOARD_ATOM)
  const activeView = useRouter("view")

  const [store, setStore] = createStore({ bottom: 0 })

  createEffect(() => {
    if (!keyboard().open) {
      window.document.body.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }

    const data = getAppData()
    console.log({ data }, "ASF")
  })

  onMount(() => {
    bridgeSetupFullScreen({ is_full: false })

    bridgeSetupSwipeBehavior({
      allow_vertical_swipe: false,
    })

    setHeaderColor({ type: "bg_color" })

    const onEventContentSafeAreaChanged = (
      data: EventsData[typeof EventSafeAreaChanged],
    ) => {
      document.body.style.setProperty(
        "--content-safe-area-inset-top",
        `${data.top}px`,
      )
    }

    const onEventSafeAreaChanged = (
      data: EventsData[typeof EventSafeAreaChanged],
    ) => {
      if (data.bottom) {
        document.body.style.setProperty(
          "--safe-area-inset-bottom",
          `${data.bottom}px`,
        )
        setStore("bottom", data.bottom)
      }

      document.body.style.setProperty("--safe-area-inset-top", `${data.top}px`)
    }

    const onEventViewportChanged = (
      data: EventsData[typeof EventViewportChanged],
    ) => {
      // document.body.style.setProperty(
      //   "--safe-area-inset-bottom",
      //   `${data.bottom}px`,
      // )
      // document.body.style.setProperty("--safe-area-inset-top", `${data.top}px`)
      document.body.style.setProperty("--app-height", `${data.height}px`)

      if (data.height < window.innerHeight) {
        /** Открытие клавиатуры */
        document.body.style.setProperty(
          "--safe-area-inset-bottom",
          `${store.bottom + store.bottom ? 10 : 0}px`,
        )
        document.body.style.setProperty(
          "--keyboard-safe-area-inset-bottom",
          `${window.outerHeight - data.height - store.bottom}px`,
        )

        setter(KEYBOARD_ATOM, (store) => {
          store.open = true
          store.touch = false
          return { ...store }
        })
        console.log("open", data)
      } else {
        console.log("close", data)
        setter(KEYBOARD_ATOM, (store) => {
          store.open = false
          store.touch = false
          return { ...store }
        })
        document.body.style.setProperty(
          "--keyboard-safe-area-inset-bottom",
          `0px`,
        )
      }
    }

    listener.on(EventContentSafeAreaChanged, onEventContentSafeAreaChanged)
    bridgeRequestContentSafeAreaInset()

    listener.on(EventSafeAreaChanged, onEventSafeAreaChanged)
    bridgeRequestSafeAreaInset()

    listener.on(EventViewportChanged, onEventViewportChanged)
    bridgeRequestViewport()

    const onTouchStart = () => {
      if (getter(KEYBOARD_ATOM).open) {
        setter(KEYBOARD_ATOM, (store) => {
          store.touch = true
          return { ...store }
        })
        document.body.style.setProperty(
          "--safe-area-inset-bottom",
          `${store.bottom}px`,
        )
      }

      window.document.body.scrollIntoView({
        behavior: "instant",
        block: "start",
      })
    }

    const onTouchEnd = () => {
      if (keyboard().open && keyboard().touch) {
        window.document.body.scrollIntoView({
          behavior: "instant",
          block: "start",
        })
      }
    }

    document.addEventListener("touchstart", onTouchStart)
    document.addEventListener("touchend", onTouchEnd)

    onCleanup(() => {
      listener.off(EventContentSafeAreaChanged, onEventContentSafeAreaChanged)
      listener.off(EventSafeAreaChanged, onEventSafeAreaChanged)
      listener.off(EventViewportChanged, onEventViewportChanged)

      document.removeEventListener("touchstart", onTouchStart)
      document.removeEventListener("touchend", onTouchEnd)
    })
  })

  return (
    <Root activeView={activeView()}>
      <Path
        tabbar={[`${pages.CHATS}`].includes(getLastPage(views.CHATS) || "")}
        nav={views.CHATS}
        component={Chats}
      />
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
