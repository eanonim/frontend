import { Cell, Title } from "components"
import loc from "engine/languages"
import { setter, useAtom } from "engine/modules/smart-data"
import { USER_ATOM } from "engine/state"
import { MESSAGE_INFO_ATOM } from "engine/state/message_info"
import { backPage, modals, useParams } from "router"
import { routerParams } from "router/routerStruct"

import { type JSX, type Component, Show } from "solid-js"
import { IconCopy, IconEdit, IconShare3, IconTrash } from "source"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const params = useParams<routerParams[modals.MESSAGE_CONTROL]>({
    modalId: modals.MESSAGE_CONTROL,
  })

  const [messageInfo] = useAtom(MESSAGE_INFO_ATOM, () => ({
    dialog: params().dialog,
  }))

  const [lang] = loc()
  const [user] = useAtom(USER_ATOM)

  const handlerReply = () => {
    setter([MESSAGE_INFO_ATOM, params().dialog], "message", (message) => {
      message.reply_id = params().message_id
      message.edit_id = undefined

      return message
    })
    backPage()
  }
  const handlerEdit = () => {
    setter([MESSAGE_INFO_ATOM, params().dialog], "message", (message) => {
      message.reply_id = undefined
      message.edit_id = params().message_id

      return message
    })
    backPage()
  }

  return (
    <Cell.List>
      <Cell separator={"auto"} onClick={handlerReply}>
        <Cell.Before>
          <IconShare3
            width={24}
            height={24}
            style={{
              transform: "scaleX(-1)",
              "-webkit-transform": "scaleX(-1)",
            }}
          />
        </Cell.Before>
        <Cell.Container>
          <Cell.Content>
            <Title>Ответить</Title>
          </Cell.Content>
        </Cell.Container>
      </Cell>
      <Cell separator={"auto"}>
        <Cell.Before>
          <IconCopy width={24} height={24} />
        </Cell.Before>
        <Cell.Container>
          <Cell.Content>
            <Title>Скопировать</Title>
          </Cell.Content>
        </Cell.Container>
      </Cell>
      <Show when={messageInfo.history.find((x) => x.author === user.id)}>
        <Cell onClick={handlerEdit} separator={"auto"}>
          <Cell.Before>
            <IconEdit width={24} height={24} />
          </Cell.Before>
          <Cell.Container>
            <Cell.Content>
              <Title>Изменить</Title>
            </Cell.Content>
          </Cell.Container>
        </Cell>
        <Cell separator={"auto"}>
          <Cell.Before>
            <IconTrash width={24} height={24} color={"var(--red_color)"} />
          </Cell.Before>
          <Cell.Container>
            <Cell.Content>
              <Title color={"red"}>Удалить</Title>
            </Cell.Content>
          </Cell.Container>
        </Cell>
      </Show>
    </Cell.List>
  )
}

export default Content
