import { Button, FixedLayout, Separator, Title } from "components"
import { chatSearch } from "engine/api"
import loc from "engine/languages"
import { useAtom } from "engine/modules/smart-data"
import { SEARCH_OPTIONS_ATOM } from "engine/state"

import { type JSX, type Component } from "solid-js"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()
  const [searchOptions] = useAtom(SEARCH_OPTIONS_ATOM)

  const handlerSearch = () => {
    console.log("ASG")
    console.log({
      f: {
        language: "en",
        your_start: searchOptions.companion.age.from,
        your_end: searchOptions.companion.age.to,
        your_sex: searchOptions.companion.male === "man" ? 0 : 1,
        my_age: searchOptions.you.age.from,
        my_sex: searchOptions.you.male === "man" ? 0 : 1,
      },
    })
    chatSearch({
      language: "en",
      your_start: searchOptions.companion.age.from,
      your_end: searchOptions.companion.age.to,
      your_sex: searchOptions.companion.male === "man" ? 0 : 1,
      my_age: searchOptions.you.age.from,
      my_sex: searchOptions.you.male === "man" ? 0 : 1,
    })
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
