import { Tag, Title } from "components"
import { SearchInteresting } from "engine/api/module"
import loc from "engine/languages"
import { getDefault, getter, useAtom } from "engine/modules/smart-data"
import { SEARCH_OPTIONS_ATOM } from "engine/state"

import { type JSX, type Component, For, onMount } from "solid-js"
import { produce } from "solid-js/store"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const [searchOptions, setSearchOptions] = useAtom(
    SEARCH_OPTIONS_ATOM,
    {},
    { key: "edit" },
  )

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

  return (
    <Tag.Group>
      <For
        each={
          Object.entries(lang("searchInterests") as any) as unknown as [
            SearchInteresting,
            string,
          ][]
        }
      >
        {([key, locale], index) => (
          <Tag
            // style={{ "flex-grow": 1 }}
            onClick={() => handlerChangeInteresting(key)}
            data-index={index()}
            selected={searchOptions.interests?.[key]?.isSelected}
          >
            <Title>{locale}</Title>
          </Tag>
        )}
      </For>
    </Tag.Group>
  )
}
export default Content
