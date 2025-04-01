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

import { backPage, pages, pushPage, useParams } from "router"
import { Socket } from "engine/api/module"
import { useAtom } from "engine/modules/smart-data"
import { CHAT_LIST_ATOM } from "engine/state"
import { timeAgo } from "engine"
import { clamp } from "@minsize/utils"
import { HOST_CDN } from "root/configs"
import { Chats } from "engine/class/useChat"

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
            <Snackbar onClose={handlerOpen}>
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
                              {message.text || message.attach?.type}
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
