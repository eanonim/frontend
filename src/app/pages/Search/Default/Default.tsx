import { Panel, Plug, Title } from "components"

import { Content } from "./fragment"

import { type JSX, type Component } from "solid-js"

interface Default extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Default: Component<Default> = (props) => {
  return (
    <Panel {...props}>
      <Plug full>
        <Plug.Container>
          <Title>SEARCH</Title>
        </Plug.Container>
      </Plug>
    </Panel>
  )
}

export default Default
