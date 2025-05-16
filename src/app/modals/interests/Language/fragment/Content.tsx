import { Background, Flex, Link, SubTitle, Tag, Title } from "components"
import { isPremium } from "engine"
import { SearchInteresting } from "engine/api/module"
import loc, { Locale } from "engine/languages"
import { getDefault, getter, useAtom } from "engine/modules/smart-data"
import {
  SEARCH_OPTIONS_ATOM,
  STORE_INTEREST_ATOM,
  USER_ATOM,
} from "engine/state"

import {
  type JSX,
  type Component,
  For,
  onMount,
  createMemo,
  Show,
} from "solid-js"
import { produce } from "solid-js/store"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const [user] = useAtom(USER_ATOM)
  const [searchOptions, setSearchOptions] = useAtom(
    SEARCH_OPTIONS_ATOM,
    {},
    { key: "edit" },
  )

  onMount(() => {
    setSearchOptions(getDefault(getter(SEARCH_OPTIONS_ATOM)))
  })

  const handlerChangeLanguage = (key: Locale) => {
    setSearchOptions(
      produce((search) => {
        search.language = key
        return search
      }),
    )
  }

  return (
    <>
      <Tag.Group>
        <For
          each={
            Object.entries(
              lang(`languages`) as Record<Locale, string>,
            ) as unknown as [Locale, string][]
          }
        >
          {([key, locale], index) => (
            <Tag
              mode={"square"}
              onClick={() => handlerChangeLanguage(key)}
              data-index={index()}
              selected={searchOptions.language === key}
            >
              <Title>{locale}</Title>
            </Tag>
          )}
        </For>
      </Tag.Group>
    </>
  )
}

export default Content
