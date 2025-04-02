import { Panel } from "components"

import { Content } from "./fragment"

import { type JSX, type Component, onMount } from "solid-js"
import { getMaleOfNumber, useHeaderColor } from "engine"
import { SearchInteresting } from "engine/api/module"
import { useAtom } from "engine/modules/smart-data"
import { SEARCH_OPTIONS_ATOM } from "engine/state"
import { chatSearch } from "engine/api"
import { modals, pages, pushModal, pushPage, replacePage } from "router"
import { Chats } from "engine/class/useChat"

interface Start extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Start: Component<Start> = (props) => {
  useHeaderColor({ iOS: "bg_color", android: "section_bg_color" })
  const [searchOptions] = useAtom(SEARCH_OPTIONS_ATOM)

  onMount(() => {
    const start = async () => {
      var interests: SearchInteresting[] = []

      for (const [key, value] of Object.entries(searchOptions.interests)) {
        if (value.isSelected) {
          interests.push(key as SearchInteresting)
        }
      }

      const { response, error } = await chatSearch({
        language: "en",
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

            if (chat?.isFavorites) {
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
    start()
  })

  return (
    <Panel {...props}>
      <Content />
    </Panel>
  )
}

export default Start
