import { timeAgo } from "@minsize/utils"
import { leading, throttle } from "@solid-primitives/scheduled"
import { Background, FixedLayout, Flex, Message, Title } from "components"
import { globalSignal } from "elum-state/solid"
import {
  findUniqueDayIndices,
  groupObjectsByDay,
  timeAgoOnlyDate,
} from "engine"
import { messageTyping } from "engine/api"
import { useAtom } from "engine/modules/smart-data"
import { SETTINGS_ATOM, USER_ATOM } from "engine/state"
import { MESSAGE_INFO_ATOM } from "engine/state/message_info"
import { pages, useParams } from "router"

import {
  type JSX,
  type Component,
  onMount,
  For,
  createMemo,
  Show,
} from "solid-js"
import { createStore } from "solid-js/store"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const params = useParams<{ dialog: string }>({ pageId: pages.CHAT })
  const [user] = useAtom(USER_ATOM)
  const [settings] = useAtom(SETTINGS_ATOM)
  const [messageInfo] = useAtom(MESSAGE_INFO_ATOM, () => ({
    dialog: params().dialog,
  }))

  let ref: HTMLDivElement
  onMount(() => {
    if (ref!) {
      ref.scrollTop = ref.scrollHeight
    }
  })

  const getMessages = createMemo(
    () => groupObjectsByDay(messageInfo),
    messageInfo,
  )

  return (
    <Flex
      style={{
        height: "100%",
        overflow: "hidden",
        "margin-top": "auto",
      }}
    >
      <Background
        fixed
        type={settings.backgroundId}
        quality={2}
        color={settings.backgroundColor}
      />

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
                    data-index={index()}
                    forward={message.reply}
                    type={message.author === user.id ? "in" : "out"}
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
  )
}

export default Content
