import { Button, Plug, Spinner, Title } from "components"
import { chatSearchEnd } from "engine/api"
import loc from "engine/languages"
import { backPage } from "router"

import { type JSX, type Component } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()

  const handlerEnd = async () => {
    chatSearchEnd({})
    backPage()
  }

  return (
    <Plug full>
      <Plug.Container>
        <Plug.Icon>
          <Spinner size={"medium"} />
        </Plug.Icon>
      </Plug.Container>
      <Plug.Action stretched>
        <Button
          onClick={handlerEnd}
          stretched
          size={"large"}
          appearance={"red"}
        >
          <Button.Container>
            <Title>{lang("cancel_search")}</Title>
          </Button.Container>
        </Button>
      </Plug.Action>
    </Plug>
  )
}

export default Content
