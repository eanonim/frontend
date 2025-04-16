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

  // onMount(() => {
  //   var div1 = document.getElementById("telegram-notification-content")
  //   var container2 = document.getElementById("ad-banner")

  //   // Перемещаем div1 в container2
  //   if (div1) {
  //     container2?.appendChild(div1)
  //     div1.style.bottom = "0px"
  //     div1.style.left = "0px"
  //     div1.style.right = "0px"
  //     div1.style.display = "block"
  //     div1.style.position = "relative"
  //   }

  //   onCleanup(() => {
  //     if (div1) {
  //       var container = document.body
  //       container?.appendChild(div1)
  //       div1.style.display = "none"
  //     }
  //   })
  // })

  return (
    <Plug full>
      <Plug.Container>
        <Plug.Icon>
          <Spinner size={"medium"} />
        </Plug.Icon>
      </Plug.Container>
      <Plug.Action stretched>
        <div
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            position: "relative",
            "--telegram-notification-content": "block !important",
            "box-sizing": "border-box",
          }}
          id={"ad-banner"}
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
