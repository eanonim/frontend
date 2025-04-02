import { Button, Plug, SubTitle, Title } from "components"
import loc from "engine/languages"

import { type JSX, type Component, Show } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()

  return (
    <Plug>
      <Plug.Container>
        <Title>{lang("leave.title")}</Title>
        <SubTitle>{lang("leave.subtitle")}</SubTitle>
      </Plug.Container>
    </Plug>
  )
}

export default Content
