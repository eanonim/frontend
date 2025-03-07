import { Button, FixedLayout, Title } from "components"

import { type JSX, type Component } from "solid-js"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  return (
    <FixedLayout safe background={"section_bg_color"} position={"bottom"}>
      <Button.Group>
        <Button.Group.Container>
          <Button size={"large"} stretched>
            <Button.Container>
              <Title>Выбрать способ оплаты</Title>
            </Button.Container>
          </Button>
        </Button.Group.Container>
      </Button.Group>
    </FixedLayout>
  )
}

export default Footer
