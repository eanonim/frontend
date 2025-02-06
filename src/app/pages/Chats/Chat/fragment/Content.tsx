import { timeAgo } from "@minsize/utils"
import { Background, FixedLayout, Flex, Message, Title } from "components"
import { globalSignal } from "elum-state/solid"
import {
  findUniqueDayIndices,
  groupObjectsByDay,
  timeAgoOnlyDate,
} from "engine"
import { useAtom } from "engine/modules/smart-data"
import { SETTINGS_ATOM } from "engine/state"

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
  const [settings] = useAtom(SETTINGS_ATOM)
  let ref: HTMLDivElement

  const [store, setStore] = createStore({
    messages: [
      {
        forward: {
          text: `Давид! Как ты? У меня тут выдался свободный вечер, и я подумала, что было бы здорово с кем-нибудь поболтать. Как у тебя настроение? Какие планы на вечер? Может быть, что-нибудь интересное смотришь или читаешь? Я вот сейчас как раз дочитываю очень захватывающий роман, и мне не терпится поделиться впечатлениями, когда закончу. А ты чем занят?`,
          time: new Date(),
        },
        text: "Привет мир",
        type: "in",
        time: new Date(Date.now() - 86_400_000 * 611),
      },
      {
        forward: {
          text: `Давид! Как ты? У меня тут выдался свободный вечер, и я подумала, что было бы здорово с кем-нибудь поболтать. Как у тебя настроение? Какие планы на вечер? Может быть, что-нибудь интересное смотришь или читаешь? Я вот сейчас как раз дочитываю очень захватывающий роман, и мне не терпится поделиться впечатлениями, когда закончу. А ты чем занят?`,
          time: new Date(),
        },
        text: "Привет мир",
        type: "in",
        time: new Date(Date.now() - 86_400_000 * 4),
      },
      {
        forward: {
          text: `Давид! Как ты? У меня тут выдался свободный вечер, и я подумала, что было бы здорово с кем-нибудь поболтать. Как у тебя настроение? Какие планы на вечер? Может быть, что-нибудь интересное смотришь или читаешь? Я вот сейчас как раз дочитываю очень захватывающий роман, и мне не терпится поделиться впечатлениями, когда закончу. А ты чем занят?`,
          time: new Date(),
        },
        text: "Привет мир",
        type: "in",
        time: new Date(Date.now() - 86_400_000 * 3),
      },
      {
        forward: {
          text: `Давид! Как ты? У меня тут выдался свободный вечер, и я подумала, что было бы здорово с кем-нибудь поболтать. Как у тебя настроение? Какие планы на вечер? Может быть, что-нибудь интересное смотришь или читаешь? Я вот сейчас как раз дочитываю очень захватывающий роман, и мне не терпится поделиться впечатлениями, когда закончу. А ты чем занят?`,
          time: new Date(),
        },
        text: "Привет мир",
        type: "in",
        time: new Date(Date.now() - 86_400_000 * 3),
      },
      {
        forward: {
          text: `Давид! Как ты? У меня тут выдался свободный вечер, и я подумала, что было бы здорово с кем-нибудь поболтать. Как у тебя настроение? Какие планы на вечер? Может быть, что-нибудь интересное смотришь или читаешь? Я вот сейчас как раз дочитываю очень захватывающий роман, и мне не терпится поделиться впечатлениями, когда закончу. А ты чем занят?`,
          time: new Date(),
        },
        text: "Привет мир",
        type: "in",
        time: new Date(Date.now() - 86_400_000 * 2),
      },
      {
        forward: {
          text: `Давид! Как ты? У меня тут выдался свободный вечер, и я подумала, что было бы здорово с кем-нибудь поболтать. Как у тебя настроение? Какие планы на вечер? Может быть, что-нибудь интересное смотришь или читаешь? Я вот сейчас как раз дочитываю очень захватывающий роман, и мне не терпится поделиться впечатлениями, когда закончу. А ты чем занят?`,
          time: new Date(),
        },
        text: "Привет мир",
        type: "in",
        time: new Date(Date.now() - 86_400_000 * 2),
      },
      {
        forward: {
          text: `Давид! Как ты? У меня тут выдался свободный вечер, и я подумала, что было бы здорово с кем-нибудь поболтать. Как у тебя настроение? Какие планы на вечер? Может быть, что-нибудь интересное смотришь или читаешь? Я вот сейчас как раз дочитываю очень захватывающий роман, и мне не терпится поделиться впечатлениями, когда закончу. А ты чем занят?`,
          time: new Date(),
        },
        text: "Привет мир",
        type: "in",
        time: new Date(Date.now() - 86_400_000 * 2),
      },
      {
        text: `Привет.`,

        type: "out",
        time: new Date(Date.now() - 86_400_000),
      },
      {
        text: `Привет.`,

        type: "out",
        time: new Date(Date.now() - 86_400_000),
      },
      {
        text: `Привет.`,

        type: "out",
        time: new Date(Date.now() - 86_400_000),
      },
      {
        text: `Привет.`,

        type: "out",
        time: new Date(Date.now() - 16_400_000),
      },
      {
        text: `Привет.`,

        type: "out",
        time: new Date(Date.now()),
      },
      {
        text: `Привет.`,

        type: "out",
        time: new Date(Date.now()),
      },
    ],
  })

  onMount(() => {
    if (ref!) {
      ref.scrollTop = ref.scrollHeight
    }
  })

  const getMessages = createMemo(
    () => groupObjectsByDay(store.messages),
    store.messages,
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
                {timeAgoOnlyDate(getMessages()[index()]?.[0]?.time?.getTime())}
              </Message.System>
              <For each={messages}>
                {(message, index) => (
                  <Message
                    data-index={index()}
                    forward={message.forward}
                    type={message.type as any}
                    text={message.text}
                    time={message.time}
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
