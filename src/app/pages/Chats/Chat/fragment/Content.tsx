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
                    onClick={() =>
                      pushModal({
                        modalId: modals.MESSAGE_CONTROL,
                        params: {
                          dialog: params().dialog,
                          message_id: message.id,
                        },
                      })
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
  )
}

export default Content
