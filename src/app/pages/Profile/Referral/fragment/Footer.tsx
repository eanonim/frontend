import { Button, FixedLayout, Title } from "components"
import loc from "engine/languages"
import { copyText } from "@minsize/utils"

import { type JSX, type Component } from "solid-js"
import { URL_APP } from "root/configs"
import { useAtom } from "engine/modules/smart-data"
import { USER_ATOM } from "engine/state"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()
  const [user] = useAtom(USER_ATOM)

  const handlerCopy = () => {
    copyText(`${URL_APP}?startapp=ref_${user?.id}`)
  }

  return (
    <FixedLayout safe background={"section_bg_color"} position={"bottom"}>
      <Button.Group>
        <Button.Group.Container>
          <Button onClick={handlerCopy} size={"large"} stretched>
            <Button.Container>
              <Title>{lang("copy")}</Title>
            </Button.Container>
          </Button>
        </Button.Group.Container>
      </Button.Group>
    </FixedLayout>
  )
}

export default Footer
