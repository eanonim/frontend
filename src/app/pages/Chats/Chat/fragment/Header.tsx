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
import { MESSAGE_INFO_ATOM } from "engine/state"
import { pages, useParams } from "router"

import { type JSX, type Component, createEffect, on } from "solid-js"

interface Header extends JSX.HTMLAttributes<HTMLDivElement> {}

const Header: Component<Header> = (props) => {
  const [lang] = loc()

  const params = useParams<{ dialog: string }>({ pageId: pages.CHAT })
  const [messageInfo] = useAtom(MESSAGE_INFO_ATOM, () => ({
    dialog: params().dialog,
  }))

  return (
    <FixedLayout
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
              <UserName
                justifyContent={"center"}
                // first_name={params().dialog}
                last_name={"Test 2"}
                // icon={"icon"}
              />
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
