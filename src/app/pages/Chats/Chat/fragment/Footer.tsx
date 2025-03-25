import {
  Button,
  Cell,
  FixedLayout,
  Separator,
  SubTitle,
  Title,
  WriteBar,
  Image,
  Flex,
} from "components"
import {
  IconCameraPlus,
  IconPaperclip,
  IconPlus,
  IconSend,
  IconX,
} from "source"

import {
  type JSX,
  type Component,
  createSignal,
  Show,
  createEffect,
  on,
  For,
} from "solid-js"
import { pages, useParams } from "router"
import { messageEdit, messageSend, messageTyping } from "engine/api"
import { leading, throttle } from "@solid-primitives/scheduled"
import { setter, useAtom } from "engine/modules/smart-data"
import { MESSAGE_INFO_ATOM } from "engine/state/message_info"
import { produce } from "solid-js/store"
import { messageMaxSize } from "root/configs"
import loc from "engine/languages"
import { Chats } from "engine/class/useChat"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const isTouchSupport = window && "ontouchstart" in window

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()
  const params = useParams<{ dialog: string }>({ pageId: pages.CHAT })

  const chat = Chats.getById(params().dialog)

  let ref: HTMLTextAreaElement

  const [message, setMessage] = createSignal("")

  createEffect(
    on(
      () => chat?.message?.editId,
      (edit_id) => {
        const message = chat?.getMessageById(edit_id)
        if (message && message.text) {
          setMessage(message.text)
          ref!?.focus()
        }
      },
    ),
  )

  const handlerSend = () => {
    try {
      const dialog = params().dialog
      ref!?.focus()
      const messageText = message().trim()

      if (chat?.message?.editId) {
        messageEdit({
          dialog: dialog,
          message: {
            id: chat?.message?.editId,
            message: messageText.slice(0, messageMaxSize),
          },
        })
        handlerRemoveEdit()
        return
      }

      if (messageText) {
        let last_index = 0
        while (messageText.length > last_index) {
          const messageChunk = messageText.slice(
            last_index,
            messageMaxSize + last_index,
          )
          last_index += messageChunk.length

          if (messageChunk) {
            messageSend({
              dialog: params().dialog,
              message: {
                message: messageChunk.trim(),
                reply_id: chat?.message?.replyId,
              },
            })
          } else {
            last_index = messageText.length
          }
        }
      }
    } finally {
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

  const handlerAddAttach = () => {
    setter(
      [MESSAGE_INFO_ATOM, params().dialog],
      "message",
      produce((message) => {
        message.is_add_attach = !message.is_add_attach

        return message
      }),
    )
  }

  const handlerRemoveReply = () => {
    setter(
      [MESSAGE_INFO_ATOM, params().dialog],
      "message",
      produce((message) => {
        message.reply_id = undefined
        message.edit_id = undefined

        return message
      }),
    )
  }

  const handlerRemoveEdit = () => {
    setter(
      [MESSAGE_INFO_ATOM, params().dialog],
      "message",
      produce((message) => {
        message.reply_id = undefined
        message.edit_id = undefined

        return message
      }),
    )
    setMessage("")
  }

  return (
    <FixedLayout
      position={"bottom"}
      style={{
        "z-index": 3,
      }}
      width={"100%"}
      background={"section_bg_color"}
      isMargin={false}
    >
      <Show when={chat?.message?.isAddAttach}>
        <Separator />
        <Button.Group>
          <Button.Group.Container justifyContent={"start"}>
            <For each={[1, 2]}>
              {(image, index) => (
                <Image.Preview data-index={index()}>
                  <Image
                    src={
                      "https://c1.35photo.pro/photos_temp/sizes/339/1697287_500n.jpg"
                    }
                  />
                </Image.Preview>
              )}
            </For>
            <Image.Preview>
              <IconPlus color={"var(--accent_color)"} />
            </Image.Preview>
          </Button.Group.Container>
        </Button.Group>
      </Show>
      <Show keyed when={chat?.getMessageById(chat.message?.replyId)}>
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
                <Title>{message.text}</Title>
              </Cell.Content>
              <Cell.After onClick={handlerRemoveReply}>
                <IconX color={"var(--accent_color)"} />
              </Cell.After>
            </Cell.Container>
          </Cell>
        )}
      </Show>
      <Show keyed when={chat?.getMessageById(chat.message?.editId)}>
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
                <Title>{message.text}</Title>
              </Cell.Content>
              <Cell.After onClick={handlerRemoveEdit}>
                <IconX color={"var(--accent_color)"} />
              </Cell.After>
            </Cell.Container>
          </Cell>
        )}
      </Show>
      <WriteBar>
        <WriteBar.Icon onClick={handlerAddAttach}>
          <IconPaperclip color={"var(--separator_primary)"} />
        </WriteBar.Icon>
        <WriteBar.Field>
          <WriteBar.Field.Textarea
            placeholder={lang("message")}
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
        <WriteBar.Icon
          onClick={handlerSend}
          style={{
            transform: message().length ? "scale(1.5)" : "scale(1)",
            "-webkit-transform": message().length ? "scale(1.5)" : "scale(1)",
            transition: "0.3s",
          }}
        >
          <IconSend
            style={{
              transform: message().length ? "scale(0.8)" : "scale(1)",
              "-webkit-transform": message().length ? "scale(0.8)" : "scale(1)",
              transition: "0.3s",
            }}
            color={
              message().length ? "var(--accent_color)" : "var(--text_secondary)"
            }
            width={36}
            height={36}
          />
        </WriteBar.Icon>
        {/* <WriteBar.Icon onClick={handlerSend}>
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
        </WriteBar.Icon> */}
      </WriteBar>
    </FixedLayout>
  )
}

export default Footer
