import { Control, FixedLayout, Plug, Separator, Title } from "components"
import { Logo, LogoElumTeam } from "source"

import { type JSX, type Component } from "solid-js"
import { backPage } from "router"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const handlerCancel = () => {}

  const handlerAccept = () => {
    backPage()
  }

  return (
    <FixedLayout position={"bottom"} background={"section_bg_color"}>
      <Separator />
      <span style={{ height: "48px" }} />
      <Separator />
      <Control safeBottom>
        <Control.Button onClick={handlerCancel}>
          <Title>Отмена</Title>
        </Control.Button>
        <Separator type={"vertical"} />
        <Control.Button onClick={handlerAccept}>
          <Title>Применить</Title>
        </Control.Button>
      </Control>
    </FixedLayout>
  )
}

export default Footer
