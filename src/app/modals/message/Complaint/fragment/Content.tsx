import { Cell, IconChevron, Title } from "components"
import loc from "engine/languages"
import { useAtom } from "engine/modules/smart-data"
import { USER_ATOM } from "engine/state"
import { MESSAGE_INFO_ATOM } from "engine/state/message_info"
import { backPage, modals, useParams } from "router"
import { routerParams } from "router/routerStruct"

import { type JSX, type Component, For } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const params = useParams<routerParams[modals.MESSAGE_COMPLAINT]>({
    modalId: modals.MESSAGE_COMPLAINT,
  })

  const [messageInfo] = useAtom(MESSAGE_INFO_ATOM, () => ({
    dialog: params().dialog,
  }))

  const [lang] = loc()
  const [user] = useAtom(USER_ATOM)

  return (
    <Cell.List>
      <For
        each={
          Object.entries(lang("complains") as any) as unknown as [
            [number, string],
          ]
        }
      >
        {([key, text], index) => (
          <Cell
            onClick={() => {
              backPage(2)
            }}
            data-index={index()}
            separator={"auto"}
          >
            <Cell.Container>
              <Cell.Content>
                <Title>{text}</Title>
              </Cell.Content>
              <Cell.After>
                <IconChevron
                  type={"right"}
                  size={"20px"}
                  color={"var(--separator_secondary)"}
                />
              </Cell.After>
            </Cell.Container>
          </Cell>
        )}
      </For>
    </Cell.List>
  )
}

export default Content
