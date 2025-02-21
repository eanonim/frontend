import { Background, Flex, Message } from "components"
import { groupObjectsByDay, timeAgoOnlyDate } from "engine"
import { useAtom } from "engine/modules/smart-data"
import { SETTINGS_ATOM, USER_ATOM } from "engine/state"
import { MESSAGE_INFO_ATOM } from "engine/state/message_info"
import { modals, pages, pushModal, useParams } from "router"

import { type JSX, type Component, onMount, For, createMemo } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const params = useParams<{ dialog: string }>({ pageId: pages.CHAT })
  const [user] = useAtom(USER_ATOM)
  const [settings] = useAtom(SETTINGS_ATOM)
  const [messageInfo] = useAtom(MESSAGE_INFO_ATOM, () => ({
    dialog: params().dialog,
  }))
  let timer: NodeJS.Timeout

  let ref: HTMLDivElement
  onMount(() => {
    if (ref!) {
      ref.scrollTop = ref.scrollHeight
    }
  })

  const getMessages = createMemo(
    () => groupObjectsByDay(messageInfo.history),
    messageInfo.history,
  )

  const handlerContextMenu = (
    type: "start" | "end" | "any",
    message_id: number,
  ) => {
    const fn = () =>
      pushModal({
        modalId: modals.MESSAGE_CONTROL,
        params: {
          dialog: params().dialog,
          message_id: message_id,
        },
      })
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
        <Message.Group ref={ref!}>
          <For each={getMessages()}>
            {(messages, index) => (
              <Message.Group.List data-index={index()}>
                <Message.System key={index()}>
                  {timeAgoOnlyDate(
                    new Date(getMessages()[index()]?.[0]?.time)?.getTime(),
                  )}
                </Message.System>
                <For each={messages}>
                  {(message, index) => (
                    <Message
                      onTouchStart={() =>
                        handlerContextMenu("start", message.id)
                      }
                      onTouchEnd={() => handlerContextMenu("end", message.id)}
                      onMouseDown={() =>
                        handlerContextMenu("start", message.id)
                      }
                      onMouseUp={() => handlerContextMenu("end", message.id)}
                      onContextMenu={() =>
                        handlerContextMenu("any", message.id)
                      }
                      data-index={index()}
                      forward={message.reply}
                      type={message.author === user.id ? "out" : "in"}
                      text={message.message}
                      time={message.time}
                      isRead={message.readed}
                      isNotRead={!message.readed}
                    />
                  )}
                </For>
              </Message.Group.List>
            )}
          </For>
        </Message.Group>
      </Flex>
    </>
  )
}

export default Content
