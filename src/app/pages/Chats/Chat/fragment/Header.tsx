import {
  Avatar,
  Button,
  Cell,
  FixedLayout,
  Message,
  Separator,
  SubTitle,
  Title,
  UserName,
} from "components"
import { chatInviteMake } from "engine/api"
import { Chat } from "engine/class"
import { Chats } from "engine/class/useChat"
import loc from "engine/languages"
import { pages, useParams } from "router"

import { type JSX, type Component, Show } from "solid-js"
import { IconBugFilled } from "source"

interface Header extends JSX.HTMLAttributes<HTMLDivElement> {}

const Header: Component<Header> = (props) => {
  const [lang] = loc()

  const params = useParams<{ dialog: string }>({ pageId: pages.CHAT })

  const chat = Chats.getById(params().dialog)

  const handlerInviteMake = () => {
    chatInviteMake({ dialog: params().dialog })
  }

  return (
    <FixedLayout
      isMargin={false}
      position={"top"}
      style={{
        background: "var(--bg_color)",
        "z-index": 3,
      }}
    >
      <Cell>
        <Cell.Before>
          <Button onClick={handlerInviteMake} size={"small"} type={"icon"}>
            <Button.Container>
              <IconBugFilled />
            </Button.Container>
          </Button>
          {/* <span onClick={handlerInviteMake} style={{ width: "36px" }} /> */}
        </Cell.Before>
        <Cell.Container>
          <Cell.Content
            style={{
              transform: !chat.isTyping ? "translateY(25%)" : "translateY(0%)",
              "-webkit-transform": !chat.isTyping
                ? "translateY(25%)"
                : "translateY(0%)",
              transition: "0.3s",
            }}
          >
            <Title nowrap overflow>
              <Show keyed when={chat}>
                {(chat) => (
                  <UserName
                    justifyContent={"center"}
                    first_name={chat.user.first_name || "undefined"}
                    last_name={chat.user.last_name || "undefined"}
                    emoji={chat.user.emoji}
                    spoiler={!chat.user.first_name && !chat.user.last_name}
                  />
                )}
              </Show>
            </Title>
            <SubTitle
              style={{
                transform: !chat.isTyping
                  ? "translateY(100%)"
                  : "translateY(0%)",
                "-webkit-transform": !chat.isTyping
                  ? "translateY(100%)"
                  : "translateY(0%)",
                transition: "0.3s",
              }}
            >
              <Message.Typing text={lang("prints") || "prints"} />
            </SubTitle>
          </Cell.Content>
        </Cell.Container>
        <Cell.Before>
          <Avatar src={"chat.photo"} size={"36px"} />
        </Cell.Before>
      </Cell>
      <Separator />
    </FixedLayout>
  )
}

export default Header
