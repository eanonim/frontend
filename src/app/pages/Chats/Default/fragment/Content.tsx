import {
  type TextProps,
  Avatar,
  Cell,
  Gap,
  Swipe,
  Message,
  SubTitle,
  Title,
  UserName,
  Flex,
} from "components"

import {
  type JSX,
  type Component,
  For,
  Show,
  createMemo,
  onMount,
  createEffect,
  Index,
} from "solid-js"
import { pages, pushPage } from "router"
import loc from "engine/languages"
import { timeAgo } from "engine"
import { Chat, Chats } from "engine/class/useChat"
import { createStore } from "solid-js/store"
interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

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

const getStyle = (type: "first" | "last", typing: boolean) => {
  if (type === "first") {
    return {
      transform: typing ? "translateY(-100%)" : "translateY(0%)",
      "-webkit-transform": typing ? "translateY(-100%)" : "translateY(0%)",
      transition: "0.3s",
    }
  }
  return {
    transform: typing ? "translateY(0%)" : "translateY(100%)",
    "-webkit-transform": typing ? "translateY(0%)" : "translateY(100%)",
    transition: "0.3s",
  }
}

const Content: Component<Content> = (props) => {
  const [lang] = loc()

  const handlerChat = (dialog: string) => {
    pushPage({ pageId: pages.CHAT, params: { dialog: dialog } })
  }

  const getHistory = createMemo(() => Object.values(Chats.get()))

  onMount(() => {
    if (getHistory.length === 0) {
      Chats.loadChats()
    }
  })

  return (
    <Cell.List style={{ "overflow-y": "scroll" }}>
      <For each={getHistory()}>
        {(chat, index) => (
          <Swipe
            data-index={index()}
            onClick={() => handlerChat(chat.id)}
            after={
              <span
                style={{
                  display: "block",
                  height: "100%",
                  width: "100px",
                  background: "var(--red_color)",
                }}
              />
            }
          >
            <Cell separator={getHistory().length > index() + 1}>
              <Cell.Before>
                <Avatar src={"chat.photo"} size={"48px"} />
              </Cell.Before>
              <Cell.Container>
                <Cell.Content>
                  <Gap justifyContent={"space-between"} count={"6px"}>
                    <Title nowrap overflow>
                      <UserName
                        first_name={chat.user.first_name}
                        last_name={chat.user.last_name}
                        emoji={chat.user.emoji}
                        spoiler={!chat.user.first_name && !chat.user.last_name}
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
                    {(lastMessage) => (
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
                          <SubTitle
                            style={getStyle("first", !!chat.isTyping)}
                            nowrap
                            overflow
                          >
                            {lastMessage?.text || lastMessage?.attach?.type}
                          </SubTitle>

                          <SubTitle
                            style={{
                              position: "absolute",
                              ...getStyle("last", !!chat.isTyping),
                            }}
                          >
                            <Message.Typing text={lang("prints") || "prints"} />
                          </SubTitle>
                        </Flex>

                        <Show
                          when={lastMessage?.text || lastMessage?.attach?.type}
                        >
                          <Message.Badge
                            // isNew={chat.message_target !== "you" && !chat.readed}
                            isRead={
                              lastMessage?.target === "my" && lastMessage.isRead
                            }
                            isNotRead={
                              lastMessage?.target === "my" &&
                              !lastMessage.isRead
                            }
                            isLoading={chat.isLoading}
                          />
                        </Show>
                      </Gap>
                    )}
                  </Show>
                </Cell.Content>
              </Cell.Container>
            </Cell>
          </Swipe>
        )}
      </For>
    </Cell.List>
  )
}

export default Content
