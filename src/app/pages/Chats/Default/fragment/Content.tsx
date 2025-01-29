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
} from "components"

import { type JSX, type Component, For, Show } from "solid-js"
import { timeAgo } from "@minsize/utils"
import { pages, pushPage } from "router"

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
  const history: {
    id: number
    first_name: string
    last_name: string
    icon?: string
    photo?: string
    last_message: {
      id: number
      check?: boolean
      message: string
      time: Date
    }
  }[] = [
    {
      id: 1,
      first_name: "Арман",
      last_name: "Байжанов",
      icon: "🖕",
      photo: "",
      last_message: {
        id: 5,
        message:
          "Ахахаха asff asf asasf as fasf asf asfasf asf asf asfasf asf asf asf",
        check: true,
        time: new Date(Date.now() - 86_400_000),
      },
    },
    {
      id: 2,
      first_name: "Алла",
      last_name: "Проценко",
      photo: "",
      last_message: {
        id: 2,
        message: "Агась",
        time: new Date(Date.now() - 86_400_000 * 30),
      },
    },
    {
      id: 3,
      first_name: "Евгений",
      last_name: "Таранов",
      photo: "",
      last_message: {
        id: 5,
        message: "да",
        time: new Date(Date.now() - 86_400_000 * 366),
      },
    },
  ]

  const handlerChat = () => {
    pushPage({ pageId: pages.CHAT })
  }

  return (
    <Cell.List>
      <For each={history}>
        {(chat, index) => (
          <Swipe
            onClick={handlerChat}
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
            <Cell data-index={index()} separator={history.length > index() + 1}>
              <Cell.Before>
                <Avatar src={chat.photo} size={"48px"} />
              </Cell.Before>
              <Cell.Container>
                <Cell.Content>
                  <Gap justifyContent={"space-between"} count={"6px"}>
                    <Title nowrap overflow>
                      <UserName
                        first_name={chat.first_name}
                        last_name={chat.last_name}
                        icon={chat.icon}
                      />
                    </Title>
                    <SubTitle {...textProps} nowrap>
                      {timeAgo(chat.last_message.time.getTime())}
                    </SubTitle>
                  </Gap>

                  <Show keyed when={chat.last_message.message}>
                    {(message) => (
                      <Gap justifyContent={"space-between"} count={"6px"}>
                        <SubTitle nowrap overflow>
                          {message}
                        </SubTitle>

                        <Message.Badge
                          isNew={
                            chat.id === chat.last_message.id &&
                            !chat.last_message.check
                          }
                          isRead={chat.last_message.check}
                          isNotRead={
                            chat.id !== chat.last_message.id &&
                            !chat.last_message.check
                          }
                        />
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
