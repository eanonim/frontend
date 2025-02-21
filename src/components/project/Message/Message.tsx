import style from "./Message.module.css"
import { Badge, Group, System, Typing } from "./addons"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"
import formatTime from "engine/utils/formatTime"
import Gap from "@ui/default/Templates/Gap/Gap"

import { type Component, Show, type ValidComponent, splitProps } from "solid-js"
import { IconMessageEnd } from "source"

interface Message<T extends ValidComponent = "div"> extends TypeFlex<T> {
  text?: string
  time?: Date

  type: "in" | "out"

  forward?: {
    message?: string
    time?: Date
  }

  /** Отображает бейдж как прочитанный */
  isRead?: boolean
  /** Отображает бейдж как НЕ прочитанный */
  isNotRead?: boolean
  /** Отображает бейдж как новый */
  isNew?: boolean
  /** Отображать спинер */
  loading?: boolean
}

type ComponentMessage = Component<Message> & {
  Badge: typeof Badge
  Group: typeof Group
  System: typeof System
  Typing: typeof Typing
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
    "loading",
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
      {...others}
    >
      <span class={style.Message__in}>
        <Show keyed when={local.forward}>
          {(forward) => (
            <Flex
              class={style.Message__forward}
              height={"100%"}
              justifyContent={"start"}
            >
              {/* <span class={style.Message__forward_separator} /> */}
              <span class={style.Message__forward_text}>{forward.message}</span>
            </Flex>
          )}
        </Show>
        {local.text}
        <Show keyed when={local.time}>
          {(time) => (
            <Gap class={style.Message__time} count={"2px"}>
              <span class={style.Message__time_text}>
                {formatTime(new Date(time))}
              </span>
              <Show when={local.type === "out"}>
                <Badge
                  class={style.Message__time_badge}
                  isRead={local.isRead}
                  isNew={local.isNew}
                  isNotRead={local.isNotRead}
                  loading={local.loading}
                  color={"inherit"}
                  size={"inherit"}
                />
              </Show>
            </Gap>
          )}
        </Show>
      </span>
      {/* <span class={style.Message__end}>
        <IconMessageEnd />
      </span> */}
    </Flex>
  )
}

Message.Badge = Badge
Message.Group = Group
Message.System = System
Message.Typing = Typing

export default Message
