import { pick } from "@minsize/utils"
import { Background, Flex, Link, SubTitle, Tag, Title } from "components"
import { SearchInteresting, StoreOptions } from "engine/api/module"
import loc from "engine/languages"
import { getDefault, getter, useAtom } from "engine/modules/smart-data"
import {
  SEARCH_OPTIONS_ATOM,
  STORE_OPTIONS_ATOM,
  USER_ATOM,
} from "engine/state"

import {
  type JSX,
  type Component,
  For,
  onMount,
  createEffect,
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
  const [storeOptions] = useAtom(STORE_OPTIONS_ATOM, {
    key: StoreOptions.interest,
  })

  onMount(() => {
    setSearchOptions(getDefault(getter(SEARCH_OPTIONS_ATOM)))
  })

  const handlerChangeInteresting = (key: SearchInteresting) => {
    setSearchOptions(
      produce((search) => {
        const isSelected = !!!search.interests[key]?.isSelected
        if (isSelected) {
          search.interests[key] = { isSelected: isSelected, isHidden: false }
        } else {
          delete search.interests[key]
        }
        return search
      }),
    )
  }

  const PremiumTags = createMemo(() => (
    <For
      each={(
        Object.values(storeOptions) as {
          key: StoreOptions.interest
          value: SearchInteresting
          is_premium: boolean
        }[]
      ).filter((x) => !!x.is_premium)}
    >
      {(option, index) => (
        <Tag
          // style={{ "flex-grow": 1 }}
          onClick={() => handlerChangeInteresting(option.value)}
          data-index={index()}
          selected={searchOptions.interests?.[option.value]?.isSelected}
        >
          <Title>{lang(`searchInterests.${option.value}`)}</Title>
        </Tag>
      )}
    </For>
  ))

  return (
    <>
      <Tag.Group>
        <For
          each={(
            Object.values(storeOptions) as {
              key: StoreOptions.interest
              value: SearchInteresting
              is_premium: boolean
            }[]
          ).filter((x) => !x.is_premium)}
        >
          {(option, index) => (
            <Tag
              onClick={() => handlerChangeInteresting(option.value)}
              data-index={index()}
              selected={searchOptions.interests?.[option.value]?.isSelected}
            >
              <Title>{lang(`searchInterests.${option.value}`)}</Title>
            </Tag>
          )}
        </For>

        <Show when={!user.premium} fallback={PremiumTags()}>
          <span style={{ position: "relative" }}>
            <Tag.Group
              padding={false}
              style={{
                filter: "blur(1px)",
                opacity: 0.1,
              }}
            >
              {PremiumTags()}
            </Tag.Group>

            <Background.Overlay>
              <Flex height={"100%"}>
                <SubTitle align={"center"}>
                  Только по <Link>подписке</Link>
                </SubTitle>
              </Flex>
            </Background.Overlay>
          </span>
        </Show>
      </Tag.Group>
    </>
  )
}

export default Content
