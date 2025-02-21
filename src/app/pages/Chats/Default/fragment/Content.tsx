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
import { timeAgo } from "@minsize/utils"
import { pages, pushPage } from "router"
import { useAtom } from "engine/modules/smart-data"
import { CHAT_LIST_ATOM } from "engine/state"
import loc from "engine/languages"

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
                    {/* <SubTitle {...textProps} nowrap>
                      {timeAgo(chat.last_message.time.getTime())}
                    </SubTitle> */}
                  </Gap>

                  <Gap justifyContent={"space-between"} count={"6px"}>
                    <Flex
                      width={"100%"}
                      direction={"column"}
                      alignItems={"start"}
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      <SubTitle
                        style={{
                          transform: chat.typing
                            ? "translateY(-100%)"
                            : "translateY(0%)",
                          "-webkit-transform": chat.typing
                            ? "translateY(-100%)"
                            : "translateY(0%)",
                          transition: "0.3s",
                        }}
                        nowrap
                        overflow
                      >
                        сообщение
                      </SubTitle>

                      <SubTitle
                        style={{
                          position: "absolute",
                          transform: !chat.typing
                            ? "translateY(100%)"
                            : "translateY(0%)",
                          "-webkit-transform": !chat.typing
                            ? "translateY(100%)"
                            : "translateY(0%)",
                          transition: "0.3s",
                        }}
                      >
                        <Message.Typing text={lang("prints") || "prints"} />
                      </SubTitle>
                    </Flex>

                    {/* <Message.Badge
                          isNew={
                            chat.id === chat.last_message.id &&
                            !chat.last_message.check
                          }
                          isRead={chat.last_message.check}
                          isNotRead={
                            chat.id !== chat.last_message.id &&
                            !chat.last_message.check
                          }
                        /> */}
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
