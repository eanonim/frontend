import style from "./Message.module.css"
import { Badge, Group, SystemDate, Typing, System, Keyboard } from "./addons"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"
import formatTime from "engine/utils/formatTime"
import Gap from "@ui/default/Templates/Gap/Gap"
import Image from "@ui/default/Blocks/Image/Image"
import Gallery from "@ui/project/Gallery/Gallery"
import Link from "@ui/default/Blocks/Link/Link"

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
import { HOST_CDN } from "root/configs"
import { getter } from "elum-state/solid"
import { AUTH_TOKEN_ATOM } from "engine/state"
import { Attach, Message as TMessage } from "engine/class/useChat"
import loc from "engine/languages"

interface Message<T extends ValidComponent = "div"> extends TypeFlex<T> {
  text?: string
  time?: Date
  chat_id?: string

  type: "in" | "out"

  reply?: TMessage
  attach?: Attach

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
  isDeleted?: boolean

  onRead: () => void
}

type ComponentMessage = Component<Message> & {
  Badge: typeof Badge
  Group: typeof Group
  SystemDate: typeof SystemDate
  System: typeof System
  Keyboard: typeof Keyboard
  Typing: typeof Typing
}

const Message: ComponentMessage = (props) => {
  const [lang] = loc()
  const [local, others] = splitProps(props, [
    "class",
    "classList",
    "text",
    "time",
    "type",
    "reply",
    "attach",
    "isRead",
    "isNotRead",
    "isNew",
    "isLoading",
    "isEdit",
    "textEdit",
    "isEmoji",
    "onRead",
    "chat_id",
    "isDeleted",
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
        [style[`Message__type--forward`]]: !!local.reply,
        [style[`Message--only_attach`]]: !!!local.text && !!local.attach,
        [style[`Message--attach`]]: !!local.attach,
        [style[`Message--is_emoji`]]: !!local.isEmoji,
        [style[`Message--deleted`]]: !!local.isDeleted,

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
            <Gallery
              only={!!!local.text && !!local.attach}
              images={attach.items.map((x, index) => ({
                index,
                id: x.id,
                isLoading: x.isLoading || false,
                src:
                  x.srcBlob ||
                  `https://${HOST_CDN}/v1/image/${local.chat_id}/${x.id}?size=1000`,
              }))}
            />
            // <span
            //   class={style.Message__images}
            //   classList={{
            //     [style[`Message__images--${attach.items.length}`]]: true,
            //   }}
            // >
            //   <For each={attach.items}>
            //     {(image) => (
            //       <Image
            //         class={style.Message__image}
            //         src={`https://${HOST_CDN}/v1/image/${local.chat_id}/${image.id}?size=100`}
            //       />
            //     )}
            //   </For>
            // </span>
          )}
        </Show>
        <div class={style.Message__text}>
          <Show keyed when={local.reply}>
            {(reply) => (
              <Flex
                class={style.Message__forward}
                height={"100%"}
                justifyContent={"start"}
              >
                {/* <span class={style.Message__forward_separator} /> */}
                <span class={style.Message__forward_content}>
                  <span class={style.Message__forward_text}>
                    {reply.text ||
                      lang(`attach_type.${reply.attach?.type || "unknown"}`) ||
                      lang(`attach_type.unknown`)}
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
                <Show
                  when={
                    local.type === "out" &&
                    (local.isRead ||
                      local.isNotRead ||
                      local.isLoading ||
                      local.isNew)
                  }
                >
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
Message.Keyboard = Keyboard
Message.SystemDate = SystemDate
Message.System = System
Message.Typing = Typing

export default Message
