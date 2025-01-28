import style from "./Message.module.css"
import { Badge } from "./addons"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"
import formatTime from "engine/utils/formatTime"
import Gap from "@ui/default/Templates/Gap/Gap"

import { type Component, Show, type ValidComponent, splitProps } from "solid-js"

interface Message<T extends ValidComponent = "div"> extends TypeFlex<T> {
  text?: string
  time?: Date

  type: "in" | "out"

  forward?: {
    text?: string
    time?: Date
  }

  /** Отображает бейдж как прочитанный */
  isRead?: boolean
  /** Отображает бейдж как НЕ прочитанный */
  isNotRead?: boolean
  /** Отображает бейдж как новый */
  isNew?: boolean
}

type ComponentMessage = Component<Message> & {
  Badge: typeof Badge
}

const Message: ComponentMessage = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "classList",
    "text",
    "time",
    "type",
    "forward",
    "isRead",
    "isNotRead",
    "isNew",
  ])

  return (
    <Flex
      class={style.Message}
      classList={{
        [style[`Message--${local.type}`]]: !!local.type,
        [style[`Message__type--forward`]]: !!local.forward,

        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      width={"100%"}
      justifyContent={local.type === "in" ? "start" : "end"}
    >
      <span class={style.Message__in}>
        <Show keyed when={local.forward}>
          {(forward) => (
            <Flex class={style.Message__forward} height={"100%"}>
              <span class={style.Message__forward_separator} />
              <span class={style.Message__forward_text}>{forward.text}</span>
            </Flex>
          )}
        </Show>
        {local.text}
        <Show keyed when={local.time}>
          {(time) => (
            <Gap class={style.Message__time} count={"2px"}>
              {formatTime(time)}
              <Show when={local.type === "out"}>
                <Badge
                  isRead={local.isRead}
                  isNew={local.isNew}
                  isNotRead={local.isNotRead}
                  color={"inherit"}
                  size={12}
                />
              </Show>
            </Gap>
          )}
        </Show>
      </span>
    </Flex>
  )
}

Message.Badge = Badge

export default Message
