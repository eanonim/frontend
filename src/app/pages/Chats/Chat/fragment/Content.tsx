import { chunks, sleep, unlink } from "@minsize/utils"
import { Background, Flex, InfiniteScroll, Message } from "components"
import { timeAgoOnlyDate } from "engine"
import { messageList, messageRead } from "engine/api"
import { useAtom, useAtomSystem } from "engine/modules/smart-data"
import { SETTINGS_ATOM, USER_ATOM } from "engine/state"
import { MESSAGE_INFO_ATOM } from "engine/state/message_info"
import { messageListCount } from "root/configs"
import { modals, pages, pushModal, useParams } from "router"

import { type JSX, type Component, For, Show, createEffect, on } from "solid-js"
import { createStore } from "solid-js/store"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const params = useParams<{ dialog: string }>({ pageId: pages.CHAT })
  const [user] = useAtom(USER_ATOM)
  const [settings] = useAtom(SETTINGS_ATOM)
  const [messageInfo] = useAtom(MESSAGE_INFO_ATOM, () => ({
    dialog: params().dialog,
  }))
  const [messageInfoSystem] = useAtomSystem(MESSAGE_INFO_ATOM, {
    key: () => params().dialog,
  })

  const [store, setStore] = createStore({
    isBottom: true,
  })

  let timer: NodeJS.Timeout
  let ref: HTMLDivElement

  createEffect(
    on(
      () => messageInfo.last_message_id,
      (next, prev) => {
        if (next === prev) return
        let isScroll = store.isBottom
        let isSmooth = (next || 0) - 1 === prev || (next || 0) + 1 === prev

        const message = messageInfo.history.get(next || 0)
        if (message) {
          if (message.author === user.id) {
            isSmooth = true
            isScroll = true
          }
        }
        if (isScroll && ref!) {
          setTimeout(() => {
            ref.scrollTo({
              top: ref.scrollHeight,
              behavior: isSmooth ? "smooth" : "instant",
            })
          }, 1)
        }
      },
    ),
  )

  let isOpenModal = false

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
            const isBottom =
              e.target.scrollTop >=
              e.target.scrollHeight - e.target.clientHeight - 4

            if (isBottom) {
              e.target.scrollTop = e.target.scrollHeight
            }

            setStore("isBottom", isBottom)
          }}
        >
          <For each={messageInfo.dialogs}>
            {([time, messages], index) => (
              <Message.Group.List data-index={index()}>
                <Message.System key={index()}>
                  {timeAgoOnlyDate(new Date(time)?.getTime())}
                </Message.System>
                <InfiniteScroll
                  next={async () => {
                    await messageList({
                      dialog: params().dialog,
                      offset: messageInfo.last_offset + messageListCount,
                      count: messageListCount,
                    })
                    return true
                  }}
                  hasMore={
                    index() === messageInfo.dialogs.length - 1
                      ? !!!messageInfoSystem.fullLoad
                      : false
                  }
                  each={messages}
                >
                  {(message, index) => (
                    <Show when={message && !message.deleted}>
                      <Message
                        data-index={index()}
                        data-message_id={message.id}
                        onTouchStart={() =>
                          !message.loading &&
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
                          !message.loading &&
                          handlerContextMenu("start", message.id)
                        }
                        onMouseUp={() => handlerContextMenu("end", message.id)}
                        onContextMenu={() =>
                          handlerContextMenu("any", message.id)
                        }
                        forward={message.reply}
                        type={message.author === user.id ? "out" : "in"}
                        text={message.message}
                        time={message.time}
                        isRead={
                          message.id <= (messageInfo.last_read_message_id || 0)
                        }
                        isNotRead={
                          !(
                            message.id <=
                            (messageInfo.last_read_message_id || 0)
                          )
                        }
                        isLoading={message.loading}
                        isEdit={message.edit}
                        onRead={() => {
                          if (
                            user.id !== message.author &&
                            !(
                              message.id <=
                              (messageInfo.last_read_message_id || 0)
                            )
                          ) {
                            console.log("rsead", message.id)
                            messageRead({
                              dialog: params().dialog,
                              message_id: message.id,
                            })
                          }
                        }}
                      />
                    </Show>
                  )}
                </InfiniteScroll>
              </Message.Group.List>
            )}
          </For>
        </Message.Group>
      </Flex>
    </>
  )
}

export default Content
