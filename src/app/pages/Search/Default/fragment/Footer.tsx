import { Button, FixedLayout, Separator, Title } from "components"
import loc from "engine/languages"
import { pages, pushPage } from "router"

import { type JSX, type Component } from "solid-js"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()
  const handlerSearch = async () => {
    pushPage({ pageId: pages.SEARCH_START })
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
