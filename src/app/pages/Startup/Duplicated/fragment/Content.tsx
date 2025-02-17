import { Button, Plug, SubTitle, TextProps, Title } from "components"
import { Logo, LogoElumTeam } from "source"

import { version } from "root/package.json"

import { type JSX, type Component } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const textProps: TextProps = {
  iOS: {
    color: "secondary",
    size: "x-small",
    weight: "400",
  },
  android: "iOS",
  macOS: "iOS",
  windows: "iOS",
  others: "iOS",
}

const Content: Component<Content> = (props) => {
  return (
    <Plug full>
      <Plug.Container>
        <Plug.Icon>
          <Logo />
        </Plug.Icon>
      </Plug.Container>
      <SubTitle {...textProps}>
        {version} ({import.meta.env.APP_VERSION})
      </SubTitle>
      <Plug.Icon>
        <LogoElumTeam />
      </Plug.Icon>
      <Plug.Action>
        <Button.Group>
          <Button.Group.Container>
            <Button>
              <Button.Container>
                <Title>Переподключиться</Title>
              </Button.Container>
            </Button>
          </Button.Group.Container>
        </Button.Group>
      </Plug.Action>
    </Plug>
  )
}

export default Content
