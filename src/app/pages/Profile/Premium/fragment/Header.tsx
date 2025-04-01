import { Plug, SubTitle, Title } from "components"
import loc from "engine/languages"
import { type JSX, type Component } from "solid-js"
import { IconCarambolaFilled } from "source"

interface Header extends JSX.HTMLAttributes<HTMLDivElement> {}

const Header: Component<Header> = (props) => {
  const [lang] = loc()
  return (
    <Plug>
      <Plug.Container>
        <Plug.Icon>
          <IconCarambolaFilled
            fill={"var(--accent_color)"}
            width={72}
            height={72}
          />
        </Plug.Icon>
        <Title>{lang("premium")}</Title>
        <SubTitle>{lang("premium_subtitle")}</SubTitle>
      </Plug.Container>
    </Plug>
  )
}

export default Header
