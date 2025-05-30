import style from "./NewMessage.module.css"

import { type JSX, type Component, onMount, onCleanup, Show } from "solid-js"

import {
  Avatar,
  Button,
  Cell,
  Flex,
  Gap,
  Snackbar,
  SubTitle,
  TextProps,
  Title,
  UserName,
} from "components"

import {
  backPage,
  modals,
  pages,
  pushPage,
  swipeView,
  useParams,
  views,
} from "router"
import { Socket } from "engine/api/module"
import { useAtom } from "engine/modules/smart-data"
import { CHAT_LIST_ATOM } from "engine/state"
import { timeAgo } from "engine"
import { clamp } from "@minsize/utils"
import { HOST_CDN } from "root/configs"
import { Chats } from "engine/class/useChat"
import loc from "engine/languages"
import { clearView, pushModal } from "router/src"

interface NewMessage extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const textProps: TextProps = {
  iOS: {
    size: "x-small",
    weight: "400",
    color: "secondary",
  },
  android: "iOS",
  macOS: "iOS",
  windows: "iOS",
  others: "iOS",
}

const NewMessage: Component<NewMessage> = (props) => {
  const [lang] = loc()
  const params = useParams<{
    dialog: Socket["message.send"]["event"]["dialog"]
    message: Socket["message.send"]["event"]["message"]
  }>({
    popoutId: props.nav,
  })

  const chat = Chats.getById(params().dialog)

  const handleClose = () => {
    backPage(1)
  }

  const handlerOpen = () => {
    handleClose()
    pushPage({
      pageId: pages.CHAT,
      params: {
        dialog: params().dialog,
      },
      handler: async () => {
        const chat = Chats.getById(params().dialog)

        if (!!chat?.isOpenGallery) {
          chat.isOpenGallery()
          return false
        }

        if (chat?.isDeleted) {
          swipeView({ viewId: views.SEARCH, clear: true })
          clearView({ viewId: views.CHATS })
        }

        if (chat?.isFavorites || chat?.isDeleted) {
          return true
        }

        pushModal({
          modalId: modals.MODAL_LEAVE,
          params: {
            dialog: params().dialog,
          },
        })

        return true
      },
    })
  }

  onMount(() => {
    const message = params().message
    const closePopup = clamp(
      (message.message ? (message.message || "").length : 100) * (125 * 1.4),
      2500,
      10000,
    )

    if (closePopup) {
      const timer = setTimeout(handleClose, closePopup)

      onCleanup(() => {
        clearTimeout(timer)
      })
    }
  })

  return (
    <Show keyed when={params().message}>
      {(message) => (
        <Show keyed when={chat}>
          {(chat) => (
            <Snackbar class={style.NewMessage} onClose={handlerOpen}>
              <Cell>
                <Cell.Before>
                  <Avatar
                    src={`https://${HOST_CDN}/v1/image/user/${chat?.user.image}?size=100`}
                    size={"48px"}
                  />
                </Cell.Before>
                <Cell.Container>
                  <Cell.Content>
                    <Gap justifyContent={"space-between"} count={"6px"}>
                      <Title nowrap overflow>
                        <UserName
                          first_name={chat.user.first_name}
                          last_name={chat.user.last_name}
                          emoji={chat.user.emoji}
                          spoiler={
                            !chat.user.first_name && !chat.user.last_name
                          }
                        />
                      </Title>

                      <Show
                        keyed
                        when={chat.getMessageById(chat.lastMessageId)?.time}
                      >
                        {(time) => (
                          <SubTitle {...textProps} nowrap>
                            {timeAgo(time.getTime())}
                          </SubTitle>
                        )}
                      </Show>
                    </Gap>

                    <Show keyed when={chat.getMessageById(chat.lastMessageId)}>
                      {(message) => (
                        <Gap justifyContent={"space-between"} count={"6px"}>
                          <Flex
                            width={"100%"}
                            direction={"column"}
                            alignItems={"start"}
                            style={{
                              overflow: "hidden",
                              "min-height": "var(--font_height--small)",
                            }}
                          >
                            <SubTitle nowrap overflow>
                              {(message.isDeleted
                                ? lang("deleted")
                                : message?.text) ||
                                lang(
                                  `attach_type.${
                                    message?.attach?.type || "unknown"
                                  }`,
                                ) ||
                                lang(`attach_type.unknown`)}
                            </SubTitle>
                          </Flex>
                        </Gap>
                      )}
                    </Show>
                  </Cell.Content>
                </Cell.Container>
              </Cell>
            </Snackbar>
          )}
        </Show>
      )}
    </Show>
  )
}

export default NewMessage
