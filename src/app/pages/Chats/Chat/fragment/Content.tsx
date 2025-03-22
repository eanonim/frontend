import { Background, Flex, Message } from "components"
import {
  chatInviteAccept,
  chatInviteReject,
  messageList,
  messageRead,
} from "engine/api"
import { Socket } from "engine/api/module"
import { useAtom, useAtomSystem } from "engine/modules/smart-data"
import { SETTINGS_ATOM, type Message as TMessage } from "engine/state"
import { MESSAGE_INFO_ATOM } from "engine/state/message_info"
import { messageListCount } from "root/configs"
import { modals, pages, pushModal, useParams } from "router"

import {
  type JSX,
  type Component,
  Show,
  createEffect,
  on,
  onMount,
} from "solid-js"
import { createStore } from "solid-js/store"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const params = useParams<{ dialog: string }>({ pageId: pages.CHAT })
  const [settings] = useAtom(SETTINGS_ATOM)
  const [messageInfo] = useAtom(MESSAGE_INFO_ATOM, () => ({
    dialog: params().dialog,
  }))
  const [messageInfoSystem] = useAtomSystem(MESSAGE_INFO_ATOM, {
    key: () => params().dialog,
  })

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
      () => messageInfo.last_message_id,
      (next, prev) => {
        if (next === prev && next !== undefined) return
        let isScroll = store.isBottom
        let isSmooth = (next || 0) - 1 === prev || (next || 0) + 1 === prev

        if (prev) {
          const message = messageInfo.history.get(next || 0)
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

  const onNext = async () => {
    await messageList({
      dialog: params().dialog,
      offset: messageInfo.last_offset,
      count: messageListCount,
    })
    return true
  }

  const onRead = (message: TMessage) => {
    if (
      message.target !== "my" &&
      message.id >= (messageInfo.last_read_message_id || 0)
    ) {
      messageRead({
        dialog: params().dialog,
        message_id: message.id,
      })
    }
  }

  const keyboardEvents: Record<
    NonNullable<
      Socket["message.send"]["event"]["message"]["keyboard"]
    >[0][0]["event"],
    () => void
  > = {
    "chat.inviteAccept": () => chatInviteAccept({ dialog: params().dialog }),
    "chat.inviteReject": () => chatInviteReject({ dialog: params().dialog }),
  }

  return (
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
          dialogs={messageInfo.dialogs}
          onNext={onNext}
          hasMore={!!!messageInfoSystem.fullLoad}
        >
          {(message, index) => (
            <Show when={message && !message.deleted}>
              <Message
                keyboardEvents={keyboardEvents}
                data-index={index()}
                data-message_id={message.id}
                onTouchStart={() =>
                  !message.loading && handlerContextMenu("start", message.id)
                }
                onTouchEnd={(e) => {
                  if (isOpenModal) {
                    e.preventDefault()
                  }
                  handlerContextMenu("end", message.id)
                }}
                onTouchMove={() => handlerContextMenu("end", message.id)}
                onMouseMove={() => handlerContextMenu("end", message.id)}
                onMouseDown={() =>
                  !message.loading && handlerContextMenu("start", message.id)
                }
                onMouseUp={() => handlerContextMenu("end", message.id)}
                onContextMenu={() => handlerContextMenu("any", message.id)}
                forward={message.reply}
                attach={message.attach}
                type={message.target === "my" ? "out" : "in"}
                text={message.message}
                time={message.time}
                isEmoji={message.is_emoji}
                isRead={message.id <= (messageInfo.last_read_message_id || 0)}
                isNotRead={
                  !(message.id <= (messageInfo.last_read_message_id || 0))
                }
                isLoading={message.loading}
                isEdit={message.edit}
                onRead={() => onRead(message)}
                keyboard={message.keyboard}
              />
            </Show>
          )}
        </Message.Group>
      </Flex>
    </>
  )
}

export default Content
