import { Plug } from "components"
import { Logo, LogoElumTeam } from "source"

import { type JSX, type Component } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  return (
    <Plug full>
      <Plug.Container>
        <Plug.Icon>
          <Logo />
        </Plug.Icon>
      </Plug.Container>
      <Plug.Icon>
        <LogoElumTeam />
      </Plug.Icon>
    </Plug>
  )
}

export default Content
