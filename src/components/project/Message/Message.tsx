import style from "./Message.module.css"
import { Badge, Group, System, Typing } from "./addons"

import { Button, Link, Title, type TypeFlex } from "@ui/index"
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
  createMemo,
  splitProps,
} from "solid-js"
import { DynamicProps } from "solid-js/web"
import { createVisibilityObserver } from "@solid-primitives/intersection-observer"
import { textParserUrl } from "@minsize/utils"
import { Socket } from "engine/api/module"

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
  isEmoji?: boolean
  keyboard?: Socket["message.send"]["event"]["message"]["keyboard"]
  keyboardEvents: Record<
    NonNullable<
      Socket["message.send"]["event"]["message"]["keyboard"]
    >[0][0]["event"],
    () => void
  >

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
    "isEmoji",
    "onRead",
    "keyboard",
    "keyboardEvents",
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

  const message = createMemo(() => textParserUrl(local.text || ""))

  return (
    <Flex
      ref={ref! as unknown as DynamicProps<"div">}
      class={style.Message}
      classList={{
        [style[`Message--${local.type}`]]: !!local.type,
        [style[`Message__type--forward`]]: !!local.forward,
        [style[`Message--only_attach`]]: !!!local.text && !!local.attach,
        [style[`Message--attach`]]: !!local.attach,
        [style[`Message--is_emoji`]]: !!local.isEmoji,

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
                <span class={style.Message__forward_content}>
                  <span class={style.Message__forward_text}>
                    {forward.message}
                  </span>
                </span>
              </Flex>
            )}
          </Show>
          {/* {local.text} */}
          <For each={message()}>
            {(parse, index) => (
              <Show
                data-index={index()}
                when={parse.type === "url"}
                fallback={parse.value}
              >
                <Link
                  color={local.type === "in" ? "accent" : "accentColor"}
                  target={"_blank"}
                  href={"https://" + parse.value.replace(/^(https?:\/\/)/i, "")}
                >
                  {parse.value.replace(/^(https?:\/\/)/i, "")}
                </Link>
              </Show>
            )}
          </For>
          {/* <Show keyed when={local.forward}>
            {(forward) => (
              <Flex
                class={style.Message__forward}
                classList={{
                  [style[`Message__forward--bottom`]]: true,
                  [style[`Message__forward--image`]]: true,
                }}
                height={"100%"}
                justifyContent={"start"}
              >
                <span class={style.Message__forward_content}>
                  <span class={style.Message__forward_text}>YouTube</span>
                  <img
                    src={"https://i.ytimg.com/vi/1kw7AHKhPbI/maxresdefault.jpg"}
                  />
                </span>
              </Flex>
            )}
          </Show> */}
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
        <Show keyed when={local.keyboard}>
          {(keyboards) => (
            <Button.Group>
              <For each={keyboards}>
                {(keyboard) => (
                  <Button.Group.Container>
                    <For each={keyboard}>
                      {(button) => (
                        <Button
                          onClick={() =>
                            local.keyboardEvents?.[button.event]?.()
                          }
                        >
                          <Button.Container>
                            <Title>{button.text}</Title>
                          </Button.Container>
                        </Button>
                      )}
                    </For>
                  </Button.Group.Container>
                )}
              </For>
            </Button.Group>
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
