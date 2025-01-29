import { Background, Flex, Message } from "components"

import { type JSX, type Component, onMount, For } from "solid-js"
import { createStore } from "solid-js/store"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
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
        time: new Date(),
      },
      {
        text: `Хм, "Тень горы", кажется, слышал про такую. Запишу себе в список, спасибо! А день мой прошел довольно типично для последнего времени: много работы, немного встреч и немного программирования. Кстати, закончил интересный проект, над которым работал последние пару недель, - небольшая программа для автоматизации рутинных задач. Может, как-нибудь покажу тебе, если интересно. А вообще, что ты думаешь о последних новостях про искусственный интеллект? Я тут пару статей прочел, и мне кажется, что это очень перспективное направление.`,

        type: "out",
        time: new Date(),
      },
    ],
  })

  onMount(() => {
    if (ref!) {
      ref.scrollTop = ref.scrollHeight
    }
  })

  return (
    <Flex
      style={{
        height: "100%",
        overflow: "hidden",
        "margin-top": "auto",
      }}
    >
      <Background fixed type={"1"} />

      <Message.Group ref={ref!}>
        <For each={store.messages}>
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
      </Message.Group>
    </Flex>
  )
}

export default Content
