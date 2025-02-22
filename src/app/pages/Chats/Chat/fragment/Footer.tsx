import { Cell, FixedLayout, SubTitle, Title, WriteBar } from "components"
import { IconGiftFilled, IconPaperclip, IconSend, IconX } from "source"

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

const isTouchSupport = window && "ontouchstart" in window

const Footer: Component<Footer> = (props) => {
  const params = useParams<{ dialog: string }>({ pageId: pages.CHAT })
  const [messageInfo] = useAtom(MESSAGE_INFO_ATOM, () => ({
    dialog: params().dialog,
  }))

  let ref: HTMLTextAreaElement

  const [message, setMessage] = createSignal("")

  createEffect(
    on(
      () => messageInfo.message.edit_id,
      (edit_id) => {
        const message = edit_id && messageInfo.history.get(edit_id)
        if (message && message.message) {
          setMessage(message.message)
        }
      },
    ),
  )

  const handlerSend = () => {
    ref!?.focus()
    const messageTest = message()
    if (messageTest) {
      messageSend({
        dialog: params().dialog,
        message: {
          message: messageTest.trim(),
          reply_id: messageInfo.message.reply_id,
        },
      })

      setMessage("")
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
    setMessage(event.target.value)
    setTyping()
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
          messageInfo.history.get(messageInfo.message.reply_id)
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
          messageInfo.history.get(messageInfo.message.edit_id)
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
          <WriteBar.Field.Textarea
            maxHeight={window.innerHeight / 3 + "px"}
            ref={ref!}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !isTouchSupport) {
                event.preventDefault()
                handlerSend()
              }
            }}
            value={message()}
            onInput={onInput}
          />
        </WriteBar.Field>
        <WriteBar.Icon onClick={handlerSend}>
          <IconSend
            style={{
              "z-index": 1,
              transform: message().length ? "scale(1.2)" : "scale(0)",
              "-webkit-transform": message().length ? "scale(1.2)" : "scale(0)",
              transition: "0.3s",
            }}
            color={"var(--accent_color)"}
            width={36}
            height={36}
          />

          <span
            style={{
              position: "absolute",
              transform: !message().length ? "scale(1)" : "scale(0)",
              "-webkit-transform": !message().length ? "scale(1)" : "scale(0)",
              transition: "0.3s",
            }}
          >
            <IconGiftFilled color={"var(--separator_primary)"} />
          </span>
        </WriteBar.Icon>
      </WriteBar>
    </FixedLayout>
  )
}

export default Footer
