import {
  Background,
  Button,
  Flex,
  Message,
  Plug,
  SubTitle,
  Title,
} from "components"
import { chatInviteAccept, chatInviteReject } from "engine/api"
import { Socket } from "engine/api/module"
import { Chats } from "engine/class/useChat"
import loc from "engine/languages"
import { useAtom } from "engine/modules/smart-data"
import { SETTINGS_ATOM } from "engine/state"
import { type Message as TMessage } from "engine/class/useChat"
import { modals, pages, pushModal, useParams } from "router"

import {
  type JSX,
  type Component,
  Show,
  createEffect,
  on,
  onMount,
  Switch,
  Match,
} from "solid-js"
import { createStore } from "solid-js/store"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const params = useParams<{ dialog: string }>({ pageId: pages.CHAT })
  const [settings] = useAtom(SETTINGS_ATOM)

  const chat = Chats.getById(params().dialog)

  const [store, setStore] = createStore({
    isBottom: true,
    isSmooth: false,
  })

  let isOpenModal = false
  let timer: NodeJS.Timeout
  let ref: HTMLDivElement

  onMount(() => {
    if (ref!) {
      requestAnimationFrame(() => {
        ref.scrollTo({
          top: ref.scrollHeight,
          behavior: "instant",
        })
      })
    }
  })

  createEffect(
    on(
      () => chat?.lastMessageId,
      (next, prev) => {
        if (next === prev && next !== undefined) return
        let isScroll = store.isBottom
        let isSmooth = (next || 0) - 1 === prev || (next || 0) + 1 === prev

        if (prev) {
          const message = chat?.getMessageById(next)
          if (message) {
            if (message.target === "my") {
              isSmooth = store.isSmooth
              isScroll = true
            }
          }
        }

        if (isScroll && ref!) {
          requestAnimationFrame(() => {
            ref.scrollTo({
              top: ref.scrollHeight,
              behavior: isSmooth ? "smooth" : "instant",
            })
          })
        }
      },
    ),
  )

  const handlerContextMenu = (
    type: "start" | "end" | "any",
    message_id: number,
  ) => {
    isOpenModal = false
    const fn = () => {
      isOpenModal = true
      pushModal({
        modalId: modals.MESSAGE_CONTROL,
        params: {
          dialog: params().dialog,
          message_id: message_id,
        },
      })
    }
    if (type === "start") {
      timer = setTimeout(fn, 500)
    } else if (type === "end") {
      clearTimeout(timer)
    } else {
      fn()
    }
  }

  const keyboardEvents: Record<
    NonNullable<
      Socket["message.send"]["event"]["message"]["keyboard"]
    >[0][0]["event"],
    (message: TMessage) => void
  > = {
    "chat.inviteAccept": async (message) => {
      const msg = chat?.getMessageById(message.id)
      msg?.setter("isDeleted", true)
      chat?.setter("isFavorites", true)
      const { response, error } = await chatInviteAccept({
        dialog: params().dialog,
      })
    },
    "chat.inviteReject": async (message) => {
      const msg = chat?.getMessageById(message.id)
      msg?.setter("isDeleted", true)
      chat?.setter("isFavorites", false)
      const { response, error } = await chatInviteReject({
        dialog: params().dialog,
      })
    },
  }

  return (
    <Show keyed when={chat}>
      {(chat) => (
        <>
          <Background
            fixed
            type={settings.backgroundId}
            quality={2}
            color={settings.backgroundColor}
          />
          <Flex
            style={{
              overflow: "hidden",
              "margin-top": "auto",
            }}
            // height={"100%"}
          >
            <Message.Group
              ref={ref!}
              onScroll={(e) => {
                const isBottom = Math.abs(e.target.scrollTop) <= 40

                const isSmooth = Math.abs(e.target.scrollTop) <= 600

                // const isBottom =
                //   e.target.scrollTop >=
                //   e.target.scrollHeight - e.target.clientHeight - 40

                // const isSmooth =
                //   e.target.scrollTop >=
                //   e.target.scrollHeight - e.target.clientHeight - 600

                setStore({
                  isBottom,
                  isSmooth,
                })
              }}
              dialogs={chat.getHistory()}
              onNext={chat.uploadChatHistory}
              hasMore={!chat.isFullLoad}
            >
              {(message, index) => (
                <Show keyed when={message && !message.isDeleted}>
                  <Switch
                    fallback={
                      <Message
                        chat_id={chat.id}
                        data-index={index()}
                        data-message_id={message.id}
                        onTouchStart={() =>
                          !message.isLoading &&
                          handlerContextMenu("start", message.id)
                        }
                        onTouchEnd={(e) => {
                          if (isOpenModal) {
                            e.preventDefault()
                          }
                          handlerContextMenu("end", message.id)
                        }}
                        onTouchMove={() =>
                          handlerContextMenu("end", message.id)
                        }
                        onMouseMove={() =>
                          handlerContextMenu("end", message.id)
                        }
                        onMouseDown={() =>
                          !message.isLoading &&
                          handlerContextMenu("start", message.id)
                        }
                        onMouseUp={() => handlerContextMenu("end", message.id)}
                        onContextMenu={() =>
                          handlerContextMenu("any", message.id)
                        }
                        reply={chat.getMessageById(message.replyId)}
                        attach={message.attach}
                        type={message.target === "my" ? "out" : "in"}
                        text={message.text}
                        time={message.time}
                        isEmoji={false}
                        isRead={chat.checkRead(message.id)}
                        isNotRead={!chat.checkRead(message.id)}
                        isLoading={message.isLoading}
                        isEdit={message.isEdit}
                        onRead={() => message.setter("isRead", true)}
                      />
                    }
                  >
                    <Match keyed when={message.type === "invite" && chat.user}>
                      {(user) => (
                        <Message.System>
                          <Switch>
                            <Match when={message.target === "my"}>
                              <Plug size={"x-small"}>
                                <Plug.Container>
                                  <SubTitle size={"small"}>
                                    {lang("system.invite.sender")}
                                  </SubTitle>
                                </Plug.Container>
                              </Plug>
                            </Match>
                            <Match when={message.target === "you"}>
                              <Plug size={"small"}>
                                <Plug.Container>
                                  <Title>
                                    {lang(
                                      "system.invite.title",
                                      user.first_name,
                                    )}
                                  </Title>
                                  <SubTitle>
                                    {lang("system.invite.subtitle")}
                                  </SubTitle>
                                </Plug.Container>
                                <Plug.Action stretched>
                                  <Message.Keyboard each={message.keyboard}>
                                    {(button) => (
                                      <Button
                                        stretched
                                        onClick={() =>
                                          keyboardEvents[button.event]?.(
                                            message,
                                          )
                                        }
                                      >
                                        <Button.Container>
                                          <Title>
                                            {lang(button.text) || button.text}
                                          </Title>
                                        </Button.Container>
                                      </Button>
                                    )}
                                  </Message.Keyboard>
                                </Plug.Action>
                              </Plug>
                            </Match>
                          </Switch>
                        </Message.System>
                      )}
                    </Match>
                  </Switch>
                </Show>
              )}
            </Message.Group>
          </Flex>
        </>
      )}
    </Show>
  )
}

export default Content
