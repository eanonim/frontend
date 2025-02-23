import { Button, FixedLayout, Separator, Title } from "components"
import { getMaleOfNumber } from "engine"
import { chatSearch } from "engine/api"
import { SearchInteresting } from "engine/api/module"
import loc from "engine/languages"
import { useAtom } from "engine/modules/smart-data"
import { SEARCH_OPTIONS_ATOM } from "engine/state"
import { pages, pushPage } from "router"

import { type JSX, type Component } from "solid-js"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()
  const [searchOptions] = useAtom(SEARCH_OPTIONS_ATOM)

  const handlerSearch = async () => {
    var interests: Partial<Record<SearchInteresting, boolean>> = {}

    for (const [key, value] of Object.entries(searchOptions.interests)) {
      if (value.isSelected) {
        interests[key as SearchInteresting] = value.isSelected
      }
    }

    const { response, error } = await chatSearch({
      language: "en",
      your_start: searchOptions.companion.age.from,
      your_end: searchOptions.companion.age.to,
      your_sex: getMaleOfNumber(searchOptions.companion.male),
      my_age: searchOptions.you.age.from,
      my_sex: getMaleOfNumber(searchOptions.you.male),
      music: true,
      ...interests,
    })

    if (response?.dialog) {
      pushPage({ pageId: pages.CHAT, params: { dialog: response.dialog } })
    }
  }

  return (
    <FixedLayout position={"bottom"} background={"section_bg_color"}>
      <Separator />
      <Button.Group>
        <Button.Group.Container>
          <Button onClick={handlerSearch} stretched size={"large"}>
            <Button.Container>
              <Title>{lang("search_for_an_interlocutor")}</Title>
            </Button.Container>
          </Button>
        </Button.Group.Container>
      </Button.Group>
    </FixedLayout>
  )
}

export default Footer
