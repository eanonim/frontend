import { Cell, IconChevron, Title } from "components"
import { messageComplaint } from "engine/api"
import loc from "engine/languages"
import { backPage, modals, useParams } from "router"
import { routerParams } from "router/routerStruct"

import { type JSX, type Component, For } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const params = useParams<routerParams[modals.MESSAGE_COMPLAINT]>({
    modalId: modals.MESSAGE_COMPLAINT,
  })

  const [lang] = loc()

  const handlerComplaint = (type: number) => {
    messageComplaint({
      dialog: params().dialog,
      message_id: params().message_id,
      type,
    })
  }

  return (
    <Cell.List>
      <For
        each={
          Object.entries(lang("complains") as any) as unknown as [
            [string, string],
          ]
        }
      >
        {([key, text], index) => (
          <Cell
            onClick={() => {
              handlerComplaint(Number(key))
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
