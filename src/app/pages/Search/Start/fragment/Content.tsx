import { Button, Plug, Spinner, Title } from "components"
import { chatSearchEnd } from "engine/api"
import loc from "engine/languages"
import { backPage } from "router"

import { type JSX, type Component, onMount, onCleanup } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()

  const handlerEnd = async () => {
    chatSearchEnd({})
    backPage()
  }

  onMount(() => {
    const p = () => {}
    ;(p_adextra as any)(p, p)
  })

  return (
    <Plug full>
      <Plug.Container>
        <Plug.Icon>
          <Spinner size={"medium"} />
        </Plug.Icon>
      </Plug.Container>
      <Plug.Action stretched>
        <div
          id={"5fb020d610f5694a11e59430772c9eb2612cd7c9"}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            position: "relative",
            "box-sizing": "border-box",
            // "background-color": "var(--section_bg_color)",
            // "border-radius": "13px",
          }}
        />
      </Plug.Action>
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
