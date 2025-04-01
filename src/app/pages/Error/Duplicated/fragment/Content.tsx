import { Button, Plug, SubTitle, TextProps, Title } from "components"
import { Logo, LogoElumTeam } from "source"

import { version } from "root/package.json"

import { type JSX, type Component } from "solid-js"
import { pages, replacePage } from "router"
import loc from "engine/languages"

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
  const [lang] = loc()
  const handlerReconnect = () => {
    replacePage({ pageId: pages.STARTUP })
  }

  return (
    <Plug full>
      <Plug.Container>
        <Plug.Icon>
          <Logo />
        </Plug.Icon>
      </Plug.Container>
      <Plug.Action style={{ width: "100%" }}>
        <Button.Group>
          <Button.Group.Container>
            <Button onClick={handlerReconnect} stretched size={"large"}>
              <Button.Container>
                <Title>{lang("reconnect")}</Title>
              </Button.Container>
            </Button>
          </Button.Group.Container>
        </Button.Group>
      </Plug.Action>
      <Plug.Icon>
        <LogoElumTeam />
      </Plug.Icon>
      <SubTitle {...textProps}>
        {version} ({import.meta.env.APP_VERSION})
      </SubTitle>
    </Plug>
  )
}

export default Content
