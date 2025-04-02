import { Button, Title } from "components"
import { chatClose } from "engine/api"
import loc from "engine/languages"
import { backPage, useParams } from "router"
import { modals, routerParams } from "router/routerStruct"

import { type JSX, type Component } from "solid-js"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()

  const params = useParams<routerParams[modals.MODAL_LEAVE]>({
    modalId: modals.MODAL_LEAVE,
  })
  const handlerYes = () => {
    chatClose({ dialog: params().dialog })
    backPage(2)
  }
  const handlerNo = () => {
    backPage(1)
  }

  return (
    <Button.Group>
      <Button.Group.Container>
        <Button stretched appearance={"red"} onClick={handlerYes}>
          <Button.Container>
            <Title>{lang("yes")}</Title>
          </Button.Container>
        </Button>
        <Button stretched onClick={handlerNo}>
          <Button.Container>
            <Title>{lang("no")}</Title>
          </Button.Container>
        </Button>
      </Button.Group.Container>
    </Button.Group>
  )
}

export default Footer
