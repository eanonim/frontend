import { copyText } from "@minsize/utils"
import { Cell, Title } from "components"
import { messageDelete } from "engine/api"
import loc from "engine/languages"
import { setter, useAtom } from "engine/modules/smart-data"
import { USER_ATOM } from "engine/state"
import { MESSAGE_INFO_ATOM } from "engine/state/message_info"
import { backPage, modals, pushModal, useParams } from "router"
import { routerParams } from "router/routerStruct"

import { type JSX, type Component, Show } from "solid-js"
import { produce } from "solid-js/store"
import { DynamicProps } from "solid-js/web"
import { IconAlert, IconCopy, IconEdit, IconShare3, IconTrash } from "source"

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

  const handlerCopy: JSX.EventHandler<DynamicProps<"article">, MouseEvent> = (
    event,
  ) => {
    event.preventDefault()
    const message = messageInfo.history.get(params().message_id)
    if (message) {
      copyText(message.message)
      backPage()
    }
  }

  const handlerDelete: JSX.EventHandler<DynamicProps<"article">, MouseEvent> = (
    event,
  ) => {
    event.preventDefault()
    messageDelete({ dialog: params().dialog, message_id: params().message_id })
    backPage()
  }

  const handlerReply: JSX.EventHandler<DynamicProps<"article">, MouseEvent> = (
    event,
  ) => {
    event.preventDefault()
    setter(
      [MESSAGE_INFO_ATOM, params().dialog],
      "message",
      produce((message) => {
        message.reply_id = params().message_id
        message.edit_id = undefined

        return message
      }),
    )
    backPage()
  }
  const handlerEdit: JSX.EventHandler<DynamicProps<"article">, MouseEvent> = (
    event,
  ) => {
    event.preventDefault()
    setter(
      [MESSAGE_INFO_ATOM, params().dialog],
      "message",
      produce((message) => {
        message.reply_id = undefined
        message.edit_id = params().message_id

        return message
      }),
    )
    backPage()
  }
  const handlerComplain: JSX.EventHandler<
    DynamicProps<"article">,
    MouseEvent
  > = (event) => {
    event.preventDefault()

    pushModal({
      modalId: modals.MESSAGE_COMPLAINT,
      params: { dialog: params().dialog, message_id: params().message_id },
    })
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
            <Title>{lang("answer")}</Title>
          </Cell.Content>
        </Cell.Container>
      </Cell>
      <Show when={!!messageInfo.history.get(params().message_id)}>
        <Cell onClick={handlerCopy} separator={"auto"}>
          <Cell.Before>
            <IconCopy width={24} height={24} />
          </Cell.Before>
          <Cell.Container>
            <Cell.Content>
              <Title>{lang("copy")}</Title>
            </Cell.Content>
          </Cell.Container>
        </Cell>
      </Show>
      <Show
        when={messageInfo.history.get(params().message_id)?.target === "my"}
      >
        <Cell onClick={handlerEdit} separator={"auto"}>
          <Cell.Before>
            <IconEdit width={24} height={24} />
          </Cell.Before>
          <Cell.Container>
            <Cell.Content>
              <Title>{lang("edit")}</Title>
            </Cell.Content>
          </Cell.Container>
        </Cell>
        <Cell onClick={handlerDelete} separator={"auto"}>
          <Cell.Before>
            <IconTrash width={24} height={24} color={"var(--red_color)"} />
          </Cell.Before>
          <Cell.Container>
            <Cell.Content>
              <Title color={"red"}>{lang("delete")}</Title>
            </Cell.Content>
          </Cell.Container>
        </Cell>
      </Show>
      <Show
        when={messageInfo.history.get(params().message_id)?.target !== "my"}
      >
        <Cell onClick={handlerComplain} separator={"auto"}>
          <Cell.Before>
            <IconAlert width={24} height={24} />
          </Cell.Before>
          <Cell.Container>
            <Cell.Content>
              <Title>{lang("complain")}</Title>
            </Cell.Content>
          </Cell.Container>
        </Cell>
      </Show>
    </Cell.List>
  )
}

export default Content
