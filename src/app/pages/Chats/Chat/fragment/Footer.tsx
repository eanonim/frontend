import {
  Cell,
  FixedLayout,
  Message,
  SubTitle,
  Title,
  WriteBar,
} from "components"
import { IconClose, IconPaperclip, IconSend, IconTrash, IconX } from "source"

import {
  type JSX,
  type Component,
  createSignal,
  Show,
  createEffect,
  on,
} from "solid-js"
import { pages, useParams } from "router"
import { messageSend, messageTyping } from "engine/api"
import { leading, throttle } from "@solid-primitives/scheduled"
import { setter, useAtom } from "engine/modules/smart-data"
import { MESSAGE_INFO_ATOM } from "engine/state/message_info"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const params = useParams<{ dialog: string }>({ pageId: pages.CHAT })
  const [messageInfo] = useAtom(MESSAGE_INFO_ATOM, () => ({
    dialog: params().dialog,
  }))

  const [message, setMessage] = createSignal("")

  createEffect(
    on(
      () => messageInfo.message.edit_id,
      (edit_id) => {
        const message = messageInfo.history.find((x) => x.id === edit_id)
        console.log({ message }, edit_id)
        if (message && message.message) {
          setMessage(message.message)
        }
      },
    ),
  )

  const handlerSend = () => {
    const messageTest = message()
    if (messageTest) {
      const reply =
        !!messageInfo.message.reply_id &&
        messageInfo.history.find((x) => x.id === messageInfo.message.reply_id)

      messageSend({
        dialog: params().dialog,
        message: {
          message: messageTest,
          reply: reply
            ? {
                id: reply.id,
              }
            : undefined,
        },
      })
    }
  }

  const setTyping = leading(
    throttle,
    () => {
      messageTyping({ dialog: params().dialog })
    },
    3000,
  )

  const onInput: JSX.InputEventHandler<HTMLTextAreaElement, InputEvent> = (
    event,
  ) => {
    setTyping()
    setMessage(event.target.value)
  }

  const handlerRemoveReply = () => {
    setter([MESSAGE_INFO_ATOM, params().dialog], "message", (message) => {
      message.reply_id = undefined
      message.edit_id = undefined

      return message
    })
  }

  const handlerRemoveEdit = () => {
    setter([MESSAGE_INFO_ATOM, params().dialog], "message", (message) => {
      message.reply_id = undefined
      message.edit_id = undefined

      return message
    })
    setMessage("")
  }

  return (
    <FixedLayout
      position={"bottom"}
      style={{
        "z-index": 3,
      }}
      background={"section_bg_color"}
    >
      <Show
        keyed
        when={
          !!messageInfo.message.reply_id &&
          messageInfo.history.find((x) => x.id === messageInfo.message.reply_id)
        }
      >
        {(message) => (
          <Cell>
            <Cell.Container>
              <span
                style={{
                  height: "100%",
                  width: "3px",
                  background: "var(--accent_color)",
                  "border-radius": "3px",
                  "margin-right": "8px",
                }}
              />
              <Cell.Content>
                <SubTitle color={"accent"}>В ответ</SubTitle>
                <Title>{message.message}</Title>
              </Cell.Content>
              <Cell.After onClick={handlerRemoveReply}>
                <IconX color={"var(--accent_color)"} />
              </Cell.After>
            </Cell.Container>
          </Cell>
        )}
      </Show>
      <Show
        keyed
        when={
          !!messageInfo.message.edit_id &&
          messageInfo.history.find((x) => x.id === messageInfo.message.edit_id)
        }
      >
        {(message) => (
          <Cell>
            <Cell.Container>
              <span
                style={{
                  height: "100%",
                  width: "3px",
                  background: "var(--accent_color)",
                  "border-radius": "3px",
                  "margin-right": "8px",
                }}
              />
              <Cell.Content>
                <SubTitle color={"accent"}>Редактирование</SubTitle>
                <Title>{message.message}</Title>
              </Cell.Content>
              <Cell.After onClick={handlerRemoveEdit}>
                <IconX color={"var(--accent_color)"} />
              </Cell.After>
            </Cell.Container>
          </Cell>
        )}
      </Show>
      <WriteBar>
        <WriteBar.Icon>
          <IconPaperclip color={"var(--separator_primary)"} />
        </WriteBar.Icon>
        <WriteBar.Field>
          <WriteBar.Field.Textarea value={message()} onInput={onInput} />
        </WriteBar.Field>
        <Show when={message().length}>
          <WriteBar.Icon onClick={handlerSend}>
            <IconSend color={"var(--accent_color)"} />
          </WriteBar.Icon>
        </Show>
        {/* <WriteBar.Icon>
          <IconGiftFilled color={"var(--separator_primary)"} />
        </WriteBar.Icon> */}
      </WriteBar>
    </FixedLayout>
  )
}

export default Footer
