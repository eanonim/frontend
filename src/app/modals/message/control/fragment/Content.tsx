import { copyText } from "@minsize/utils"
import { Cell, Title } from "components"
import { Chats } from "engine/class/useChat"
import loc from "engine/languages"
import { backPage, modals, pushModal, useParams } from "router"
import { routerParams } from "router/routerStruct"

import { type JSX, type Component, Show } from "solid-js"
import { DynamicProps } from "solid-js/web"
import { IconAlert, IconCopy, IconEdit, IconShare3, IconTrash } from "source"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const params = useParams<routerParams[modals.MESSAGE_CONTROL]>({
    modalId: modals.MESSAGE_CONTROL,
  })

  const chat = Chats.getById(params().dialog)
  const message = chat?.getMessageById(params().message_id)

  const handlerCopy: JSX.EventHandler<DynamicProps<"article">, MouseEvent> = (
    event,
  ) => {
    event.preventDefault()
    if (message) {
      copyText(message.text)
      backPage()
    }
  }

  const handlerDelete: JSX.EventHandler<DynamicProps<"article">, MouseEvent> = (
    event,
  ) => {
    event.preventDefault()
    message?.setter("isDeleted", true)
    // messageDelete({ dialog: params().dialog, message_id: params().message_id })
    backPage()
  }

  const handlerReply: JSX.EventHandler<DynamicProps<"article">, MouseEvent> = (
    event,
  ) => {
    event.preventDefault()

    chat?.setMessage("replyId", params().message_id)
    chat?.setMessage("editId", undefined)
    backPage()
  }
  const handlerEdit: JSX.EventHandler<DynamicProps<"article">, MouseEvent> = (
    event,
  ) => {
    event.preventDefault()

    chat?.setMessage("replyId", undefined)
    chat?.setMessage("editId", params().message_id)
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
      <Show when={!!message}>
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
      <Show when={message?.target === "my"}>
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
      <Show when={message?.target !== "my"}>
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
