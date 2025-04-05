import { createEffect, onCleanup, onMount, type Component } from "solid-js"

import { Path, Reconnection, Root } from "components"
import { pages, replacePage, useRouter, views } from "router"
import { getLastPage } from "router/src/utils"

import Startup from "./pages/Startup/Startup"
import Error from "./pages/Error/Error"
import Search from "./pages/Search/Search"
import Profile from "./pages/Profile/Profile"
import Chats from "./pages/Chats/Chats"
import Rating from "./pages/Rating/Rating"
import Task from "./pages/Task/Task"

import Popup from "./popups"
import Modals from "./modals"

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
  getAppData,
  bridgeRequestTheme,
  EventThemeChanged,
} from "@apiteam/twa-bridge/solid"
import { isColorDark, setHeaderColor } from "engine"
import { KEYBOARD_ATOM, SETTINGS_ATOM } from "engine/state"
import { getter, globalSignal, setter } from "elum-state/solid"
import { getter as SmartGetter } from "engine/modules/smart-data"
import { createStore } from "solid-js/store"
import { setTheme } from "engine/state/settings"
import { clamp, unlink } from "@minsize/utils"

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
  })

  onMount(() => {
    const data = getAppData()

    bridgeSetupFullScreen({ is_full: true })

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

      if (data.height + store.bottom < window.innerHeight) {
        /** Открытие клавиатуры */
        document.body.style.setProperty(
          "--safe-area-inset-bottom",
          `${store.bottom + (store.bottom ? 10 : 0)}px`,
        )
        document.body.style.setProperty(
          "--keyboard-safe-area-inset-bottom",
          `${clamp(
            window.outerHeight -
              data.height -
              (getter(KEYBOARD_ATOM)?.bottom || 0) -
              (!(getter(KEYBOARD_ATOM)?.bottom || 0) ? store.bottom : 0),
            0,
            window.innerHeight,
          )}px`,
        )

        setter(KEYBOARD_ATOM, (store) => {
          store.open = true
          store.touch = false
          store.bottom = 0
          return { ...store }
        })
      } else {
        setter(KEYBOARD_ATOM, (store) => {
          store.open = false
          store.touch = false
          store.bottom = 0
          return { ...store }
        })
        document.body.style.setProperty(
          "--keyboard-safe-area-inset-bottom",
          `0px`,
        )
      }
    }

    const onEventThemeChanged = (
      data: EventsData[typeof EventThemeChanged],
    ) => {
      if (data.theme_params["bg_color"]) {
        if (
          !SmartGetter(SETTINGS_ATOM) ||
          SmartGetter(SETTINGS_ATOM).theme === "system"
        ) {
          setTheme(
            isColorDark(data.theme_params["bg_color"]) ? "dark" : "light",
            false,
          )
        } else {
          setTheme(SmartGetter(SETTINGS_ATOM).theme ?? "dark", false)
        }
      }
    }

    listener.on(EventThemeChanged, onEventThemeChanged)
    bridgeRequestTheme()

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
      } else if (getter(KEYBOARD_ATOM).bottom !== 0) {
        setter(KEYBOARD_ATOM, (store) => {
          store.bottom = 0
          return { ...store }
        })

        document.body.style.setProperty(
          "--keyboard-safe-area-inset-bottom",
          `0px`,
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
      listener.off(EventThemeChanged, onEventThemeChanged)
      listener.off(EventContentSafeAreaChanged, onEventContentSafeAreaChanged)
      listener.off(EventSafeAreaChanged, onEventSafeAreaChanged)
      listener.off(EventViewportChanged, onEventViewportChanged)

      document.removeEventListener("touchstart", onTouchStart)
      document.removeEventListener("touchend", onTouchEnd)
    })
  })

  return (
    <Root
      activeView={activeView()}
      popup={<Popup />}
      modal={<Modals />}
      header={
        <Reconnection
          handlerReconnect={() => {
            replacePage({ pageId: pages.STARTUP })
          }}
        />
      }
    >
      <Path
        tabbar={[`${pages.RATING}`].includes(getLastPage(views.RATING) || "")}
        nav={views.RATING}
        component={Rating}
      />
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

      <Path
        tabbar={[`${pages.TASK}`].includes(getLastPage(views.TASK) || "")}
        nav={views.TASK}
        component={Task}
      />

      <Path nav={views.STARTUP} component={Startup} />
      <Path nav={views.ERROR} component={Error} />
    </Root>
  )
}

export default App
