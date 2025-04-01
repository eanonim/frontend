import { Button, FixedLayout, Title } from "components"
import loc from "engine/languages"
import { setter, useAtom } from "engine/modules/smart-data"
import { USER_ATOM } from "engine/state"

import { type JSX, type Component } from "solid-js"
interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()

  const [user] = useAtom(USER_ATOM, {}, { key: "edit" })

  const handlerDelete = () => {
    setter(USER_ATOM, "emoji", 0)
    setter([USER_ATOM, "edit"], "emoji", 0)
  }

  const handlerSave = () => {
    setter(USER_ATOM, "emoji", user.emoji)
  }

  return (
    <FixedLayout position={"bottom"}>
      <Button.Group>
        <Button.Group.Container>
          <Button
            onClick={handlerDelete}
            stretched
            size={"large"}
            appearance={"red"}
          >
            <Button.Container>
              <Title>{lang("delete")}</Title>
            </Button.Container>
          </Button>
          <Button onClick={handlerSave} stretched size={"large"}>
            <Button.Container>
              <Title>{lang("apply")}</Title>
            </Button.Container>
          </Button>
        </Button.Group.Container>
      </Button.Group>
    </FixedLayout>
  )
}
export default Footer
