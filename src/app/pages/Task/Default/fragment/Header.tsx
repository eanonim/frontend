import { Group, Plug, SubTitle, Title } from "components"

import { type JSX, type Component } from "solid-js"
import loc from "engine/languages"
import { IconStack2Filled } from "source"

interface Header extends JSX.HTMLAttributes<HTMLDivElement> {}

const Header: Component<Header> = (props) => {
  const [lang] = loc()

  return (
    <Group>
      <Group.Container>
        <Plug>
          <Plug.Icon>
            <IconStack2Filled
              width={72}
              height={72}
              color={"var(--accent_color)"}
            />
          </Plug.Icon>
          <Plug.Container>
            <Title>Daily Dose of Coins!</Title>
            <SubTitle>
              Complete simple tasks from our partners every day and get coins!
              New tasks appear every day, so come back often!
            </SubTitle>
          </Plug.Container>
        </Plug>
      </Group.Container>
    </Group>
  )
}

export default Header
