import { Button, FixedLayout, Title } from "components"
import loc from "engine/languages"

import { type JSX, type Component, createSignal, For } from "solid-js"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()
  return (
    <FixedLayout safe background={"section_bg_color"} position={"bottom"}>
      <Button.Group>
        <Button.Group.Container>
          <Button size={"large"} stretched>
            <Button.Container>
              <Title>{lang("pay")}</Title>
            </Button.Container>
          </Button>
        </Button.Group.Container>
      </Button.Group>
    </FixedLayout>
  )
}

export default Footer
