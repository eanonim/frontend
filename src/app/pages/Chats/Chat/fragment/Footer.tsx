import {
  Button,
  Cell,
  FixedLayout,
  Separator,
  SubTitle,
  Title,
  WriteBar,
  Image,
  Plug,
} from "components"
import { IconPaperclip, IconPlus, IconSend, IconX } from "source"

import {
  type JSX,
  type Component,
  createSignal,
  Show,
  createEffect,
  on,
  For,
} from "solid-js"
import { modals, pages, pushModal, useParams } from "router"
import {
  imageUpload,
  messageEdit,
  messageSend,
  messageTyping,
} from "engine/api"
import { leading, throttle } from "@solid-primitives/scheduled"
import { HOST_CDN, messageMaxSize } from "root/configs"
import loc from "engine/languages"
import { Attach, Chats } from "engine/class/useChat"
import { createBlob, createImage, isPremium } from "engine"
import { AUTH_TOKEN_ATOM, USER_ATOM } from "engine/state"
import { getter } from "elum-state/solid"
import { unlink } from "@minsize/utils"
import { useAtom } from "engine/modules/smart-data"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const isTouchSupport = window && "ontouchstart" in window

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()
  const params = useParams<{ dialog: string }>({ pageId: pages.CHAT })

  const [user] = useAtom(USER_ATOM)
  const chat = Chats.getById(params().dialog)

  let ref: HTMLTextAreaElement

  const [message, setMessage] = createSignal("")

  createEffect(
    on(
      () => chat?.message?.editId,
      (edit_id) => {
        const message = chat?.getMessageById(edit_id)
        if (message && message.text) {
          // if (message.attach) {
          //   chat?.setMessage("attach", items)
          //   chat?.setMessage("isAddAttach", true)
          // }
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

      const msg = chat?.getMessageById(chat?.message?.editId)
      if (chat?.message?.editId && msg) {
        messageEdit({
          dialog: dialog,
          message: {
            id: chat.message.editId,
            message: messageText.slice(0, messageMaxSize),
            attach: unlink(msg.attach),
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
              attachBlob: unlink(chat?.message?.attach),
            })
            chat?.setMessage("attach", undefined)
          } else {
            last_index = messageText.length
          }
        }
      } else if (chat?.message?.attach) {
        messageSend({
          dialog: params().dialog,
          message: {
            reply_id: chat?.message?.replyId,
          },
          attachBlob: unlink(chat?.message?.attach),
        })
      }
    } finally {
      chat?.setMessage("attach", undefined)
      chat?.setMessage("isAddAttach", undefined)
      handlerRemoveReply()
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
    chat?.setMessage("isAddAttach", !chat.message?.isAddAttach)
  }

  const handlerRemoveReply = () => {
    chat?.setMessage("replyId", undefined)
  }

  const handlerRemoveEdit = () => {
    chat?.setMessage("editId", undefined)
    chat?.setMessage("isAddAttach", undefined)
    setMessage("")
  }

  const addImage = async () => {
    if (!isPremium(user.premium)) {
      pushModal({ modalId: modals.MODAL_PREMIUM })
      return
    }

    const items: { id: number; blob: Blob }[] = unlink(
      chat?.message?.attach || [],
    )
    const element = document.createElement("input")
    element.type = "file"
    element.multiple = true
    element.accept = "image/*"

    element.click()
    element.onchange = async (e) => {
      const data = e.target as HTMLInputElement

      for (const file of data.files || []) {
        if (items.length >= 3) return
        const image = await createImage(file)
        if (image) {
          items.push({ id: items.length, blob: image })
          // const form = new FormData()
          // form.append("data", image)
          // form.append("group", chat?.id || "")
          // const { response, error } = await imageUpload(form)
          // if (response) {
          //   items.type = "photo"
          //   items.items.push({
          //     id: response.id,
          //   })
          // }
        }
      }

      chat?.setMessage("attach", items)
    }
  }

  const deleteImage = (id: number) => {
    const items: { id: number; blob: Blob }[] = unlink(
      chat?.message?.attach || [],
    )

    const index = items.findIndex((x) => x.id === id)
    if (index !== -1) {
      items.splice(index, 1)
    }

    chat?.setMessage("attach", items)
  }

  const isSendMessage = () => !!message().length || !!chat?.message?.attach

  return (
    <FixedLayout
      position={"bottom"}
      style={{
        "z-index": 3,
      }}
      width={"100%"}
      background={"section_bg_color"}
      isMargin={false}
      safe={!!chat?.isDeleted}
    >
      <Show
        when={!chat?.isDeleted}
        fallback={
          <Plug size={"small"}>
            <Plug.Container>
              <SubTitle>{lang("chat_deleted.subtitle")}</SubTitle>
            </Plug.Container>
          </Plug>
        }
      >
        <Show keyed when={chat?.getMessageById(chat.message?.replyId)}>
          {(message) => (
            <>
              <Separator />
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
                    <SubTitle color={"accent"}>{lang("in_response")}</SubTitle>
                    <Title>
                      {message.text ||
                        lang(
                          `attach_type.${message?.attach?.type || "unknown"}`,
                        ) ||
                        lang(`attach_type.unknown`)}
                    </Title>
                  </Cell.Content>
                  <Cell.After onClick={handlerRemoveReply}>
                    <IconX color={"var(--accent_color)"} />
                  </Cell.After>
                </Cell.Container>
              </Cell>
            </>
          )}
        </Show>
        <Show keyed when={chat?.getMessageById(chat.message?.editId)}>
          {(message) => (
            <>
              <Separator />
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
                    <SubTitle color={"accent"}>{lang("editing")}</SubTitle>
                    <Title>{message.text}</Title>
                  </Cell.Content>
                  <Cell.After onClick={handlerRemoveEdit}>
                    <IconX color={"var(--accent_color)"} />
                  </Cell.After>
                </Cell.Container>
              </Cell>
            </>
          )}
        </Show>

        <Show when={chat?.message?.isAddAttach}>
          <Separator />
          <Button.Group>
            <Button.Group.Container justifyContent={"start"}>
              <For each={chat?.message?.attach}>
                {(image, index) => (
                  <Image.Preview
                    data-index={index()}
                    onClick={() => deleteImage(image.id)}
                  >
                    <Image
                      src={createBlob(image.blob)}
                      //src={`https://${HOST_CDN}/v1/image/${chat?.id}/${image.id}?size=100`}
                    />
                  </Image.Preview>
                )}
              </For>
              <Show when={(chat?.message?.attach || []).length < 3}>
                <Image.Preview onClick={addImage}>
                  <IconPlus color={"var(--accent_color)"} />
                </Image.Preview>
              </Show>
            </Button.Group.Container>
          </Button.Group>
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
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !isTouchSupport
                ) {
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
              transform: isSendMessage() ? "scale(1.5)" : "scale(1)",
              "-webkit-transform": isSendMessage() ? "scale(1.5)" : "scale(1)",
              transition: "0.3s",
            }}
          >
            <IconSend
              style={{
                transform: isSendMessage() ? "scale(0.8)" : "scale(1)",
                "-webkit-transform": isSendMessage()
                  ? "scale(0.8)"
                  : "scale(1)",
                transition: "0.3s",
              }}
              color={
                isSendMessage()
                  ? "var(--accent_color)"
                  : "var(--text_secondary)"
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
      </Show>
    </FixedLayout>
  )
}

export default Footer
