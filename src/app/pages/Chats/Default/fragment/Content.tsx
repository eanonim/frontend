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

import { type JSX, type Component, For, Show, createMemo } from "solid-js"
import { pages, pushPage } from "router"
import { useAtom } from "engine/modules/smart-data"
import { CHAT_LIST_ATOM } from "engine/state"
import loc from "engine/languages"
import { timeAgo } from "engine"

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
  const [chatList] = useAtom(CHAT_LIST_ATOM)

  const handlerChat = (dialog: string) => {
    pushPage({ pageId: pages.CHAT, params: { dialog: dialog } })
  }

  const getHistory = createMemo(() => Object.values(chatList.history))

  return (
    <Cell.List style={{ "overflow-y": "scroll" }}>
      <For each={getHistory()}>
        {(chat, index) => (
          <Swipe
            data-index={index()}
            onClick={() => handlerChat(chat.uuid)}
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
                        first_name={"chat.first_name"}
                        last_name={"chat.last_name"}
                        icon={"chat.icon"}
                      />
                    </Title>

                    <Show keyed when={chat.message_time}>
                      {(time) => (
                        <SubTitle {...textProps} nowrap>
                          {timeAgo(time.getTime())}
                        </SubTitle>
                      )}
                    </Show>
                  </Gap>

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
                        style={getStyle("first", !!chat.typing)}
                        nowrap
                        overflow
                      >
                        {chat.message || chat.message_attack_type}
                      </SubTitle>

                      <SubTitle
                        style={{
                          position: "absolute",
                          ...getStyle("last", !!chat.typing),
                        }}
                      >
                        <Message.Typing text={lang("prints") || "prints"} />
                      </SubTitle>
                    </Flex>

                    <Show when={chat.message || chat.message_attack_type}>
                      <Message.Badge
                        // isNew={chat.message_target !== "you" && !chat.readed}
                        isRead={chat.message_target === "my" && chat.readed}
                        isNotRead={chat.message_target === "my" && !chat.readed}
                      />
                    </Show>
                  </Gap>
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
