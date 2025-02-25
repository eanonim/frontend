import style from "./Message.module.css"
import { Badge, Group, System, Typing } from "./addons"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"
import formatTime from "engine/utils/formatTime"
import Gap from "@ui/default/Templates/Gap/Gap"
import Image from "@ui/default/Blocks/Image/Image"

import {
  type Component,
  For,
  Show,
  type ValidComponent,
  createEffect,
  onCleanup,
  onMount,
  splitProps,
} from "solid-js"
import { IconMessageEnd } from "source"
import { DynamicProps } from "solid-js/web"
import { createVisibilityObserver } from "@solid-primitives/intersection-observer"

interface Message<T extends ValidComponent = "div"> extends TypeFlex<T> {
  text?: string
  time?: Date

  type: "in" | "out"

  forward?: {
    message?: string
    time?: Date
  }
  attach?: {
    type: "photo" | "audio"
    items: { name: string; data: string }[]
  }

  /** Отображает бейдж как прочитанный */
  isRead?: boolean
  /** Отображает бейдж как НЕ прочитанный */
  isNotRead?: boolean
  /** Отображает бейдж как новый */
  isNew?: boolean
  /** Отображать спинер */
  isLoading?: boolean
  /** Отображать изменение */
  isEdit?: boolean
  textEdit?: string

  onRead: () => void
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
    "attach",
    "isRead",
    "isNotRead",
    "isNew",
    "isLoading",
    "isEdit",
    "textEdit",
    "onRead",
  ])

  let ref: HTMLDivElement

  const useVisibilityObserver = local.isNotRead
    ? createVisibilityObserver({
        initialValue: false,
      })
    : undefined

  const visibleObserver = useVisibilityObserver?.(() => ref!)

  createEffect(() => {
    if (visibleObserver?.()) {
      local.onRead()
    }
  })

  return (
    <Flex
      ref={ref! as unknown as DynamicProps<"div">}
      class={style.Message}
      classList={{
        [style[`Message--${local.type}`]]: !!local.type,
        [style[`Message__type--forward`]]: !!local.forward,
        [style[`Message--only_attach`]]: !!!local.text,

        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      width={"100%"}
      justifyContent={local.type === "in" ? "start" : "end"}
      {...others}
    >
      <span class={style.Message__in}>
        <Show keyed when={local.attach}>
          {(attach) => (
            <span
              class={style.Message__images}
              classList={{
                [style[`Message__images--${attach.items.length}`]]: true,
              }}
            >
              <For each={attach.items}>
                {(item) => (
                  <Image class={style.Message__image} src={item.data} />
                )}
              </For>
            </span>
          )}
        </Show>
        <div class={style.Message__text}>
          <Show keyed when={local.forward}>
            {(forward) => (
              <Flex
                class={style.Message__forward}
                height={"100%"}
                justifyContent={"start"}
              >
                {/* <span class={style.Message__forward_separator} /> */}
                <span class={style.Message__forward_text}>
                  {forward.message}
                </span>
              </Flex>
            )}
          </Show>
          {local.text}
          <Show keyed when={local.time}>
            {(time) => (
              <Gap class={style.Message__time} count={"2px"}>
                <span class={style.Message__time_text}>
                  <Show when={local.isEdit}>{local.textEdit} </Show>
                  {formatTime(new Date(time))}
                </span>
                <Show when={local.type === "out"}>
                  <Badge
                    class={style.Message__time_badge}
                    isRead={local.isRead}
                    isNew={local.isNew}
                    isNotRead={local.isNotRead}
                    isLoading={local.isLoading}
                    color={"inherit"}
                    size={"inherit"}
                  />
                </Show>
              </Gap>
            )}
          </Show>
        </div>
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
