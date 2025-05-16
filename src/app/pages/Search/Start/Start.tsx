import { Panel } from "components"

import { Content } from "./fragment"

import { type JSX, type Component, onMount, untrack } from "solid-js"
import { getMaleOfNumber, useHeaderColor } from "engine"
import { SearchInteresting } from "engine/api/module"
import { setter, useAtom } from "engine/modules/smart-data"
import { ADS_ATOM, SEARCH_OPTIONS_ATOM } from "engine/state"
import { chatSearch } from "engine/api"
import {
  modals,
  pages,
  pushModal,
  pushPage,
  replacePage,
  swipeView,
  views,
} from "router"
import { Chats } from "engine/class/useChat"
import { clearView } from "router/src"

interface Start extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Start: Component<Start> = (props) => {
  useHeaderColor({ iOS: "bg_color", android: "section_bg_color" })
  const [searchOptions] = useAtom(SEARCH_OPTIONS_ATOM)
  const [ads] = useAtom(ADS_ATOM)

  onMount(() => {
    const start = async () => {
      var interests: SearchInteresting[] = []

      for (const [key, value] of Object.entries(searchOptions.interests)) {
        if (value.isSelected) {
          interests.push(key as SearchInteresting)
        }
      }

      const { response, error } = await chatSearch({
        language: searchOptions.language || "en",
        your_start: searchOptions.companion.age.from,
        your_end: searchOptions.companion.age.to,
        your_sex: getMaleOfNumber(searchOptions.companion.male),
        my_age: searchOptions.you.age.from,
        my_sex: getMaleOfNumber(searchOptions.you.male),
        interests,
      })

      if (response?.dialog) {
        replacePage({
          is_back: true,
          pageId: pages.CHAT,
          params: { dialog: response.dialog },
          handler: async () => {
            const chat = Chats.getById(response.dialog)

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
                dialog: response.dialog,
              },
            })

            return false
          },
        })
      }
    }

    // untrack(openAds)
    start()
  })

  const openAds = () => {
    setter(ADS_ATOM, (store) => {
      store.interstitial += 1

      return store
    })

    if (ads.interstitial >= 3 - 1) {
      show_9214229?.({
        type: "inApp",
        inAppSettings: {
          frequency: 2,
          capping: 0.1,
          interval: 30,
          timeout: 5,
          everyPage: false,
        },
      })
      setter(ADS_ATOM, (store) => {
        store.interstitial = 0

        return store
      })
    }
  }

  return (
    <Panel {...props}>
      <Content />
    </Panel>
  )
}

export default Start
