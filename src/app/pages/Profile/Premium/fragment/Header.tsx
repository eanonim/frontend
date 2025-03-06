import { Plug, SubTitle, Title } from "components"
import { type JSX, type Component } from "solid-js"
import { IconCarambolaFilled } from "source"

interface Header extends JSX.HTMLAttributes<HTMLDivElement> {}

const Header: Component<Header> = (props) => {
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
        <Title>Premium</Title>
        <SubTitle>
          Больше свободы и десятки эксклюзивных функций с подпиской.
        </SubTitle>
      </Plug.Container>
    </Plug>
  )
}

export default Header
