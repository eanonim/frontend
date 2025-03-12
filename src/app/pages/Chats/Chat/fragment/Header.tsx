import {
  Avatar,
  Cell,
  FixedLayout,
  Message,
  Separator,
  SubTitle,
  Title,
  UserName,
} from "components"
import loc from "engine/languages"
import { useAtom } from "engine/modules/smart-data"
import { CHAT_LIST_ATOM, MESSAGE_INFO_ATOM } from "engine/state"
import { pages, useParams } from "router"

import { type JSX, type Component, createEffect, on, Show } from "solid-js"

interface Header extends JSX.HTMLAttributes<HTMLDivElement> {}

const Header: Component<Header> = (props) => {
  const [lang] = loc()

  const params = useParams<{ dialog: string }>({ pageId: pages.CHAT })
  const [messageInfo] = useAtom(MESSAGE_INFO_ATOM, () => ({
    dialog: params().dialog,
  }))
  const [chatList] = useAtom(CHAT_LIST_ATOM)

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
        <Cell.Before style={{ opacity: 0 }}>
          <span style={{ width: "36px" }} />
        </Cell.Before>
        <Cell.Container>
          <Cell.Content
            style={{
              transform: !messageInfo.message.typing
                ? "translateY(25%)"
                : "translateY(0%)",
              "-webkit-transform": !messageInfo.message.typing
                ? "translateY(25%)"
                : "translateY(0%)",
              transition: "0.3s",
            }}
          >
            <Title nowrap overflow>
              <Show keyed when={chatList.history[params()?.dialog || ""]}>
                {(chat) => (
                  <UserName
                    justifyContent={"center"}
                    first_name={chat.user.first_name || "undefined"}
                    last_name={chat.user.last_name || "undefined"}
                    emoji={chat.user.emoji}
                  />
                )}
              </Show>
            </Title>
            <SubTitle
              style={{
                transform: !messageInfo.message.typing
                  ? "translateY(100%)"
                  : "translateY(0%)",
                "-webkit-transform": !messageInfo.message.typing
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
