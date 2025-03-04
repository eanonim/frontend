import { Badge, Button, FixedLayout, Title } from "components"
import { SearchInteresting } from "engine/api/module"
import loc from "engine/languages"
import { setter, useAtom } from "engine/modules/smart-data"
import { SEARCH_OPTIONS_ATOM, USER_ATOM } from "engine/state"
import { maxInterest } from "root/configs"
import { backPage } from "router"

import { type JSX, type Component, createMemo } from "solid-js"
import { produce } from "solid-js/store"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()

  const [user] = useAtom(USER_ATOM, {}, { key: "edit" })

  const handlerDelete = () => {
    setter(USER_ATOM, "emoji", 0)
    backPage()
  }

  const handlerSave = () => {
    setter(USER_ATOM, "emoji", user.emoji)
    backPage()
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
