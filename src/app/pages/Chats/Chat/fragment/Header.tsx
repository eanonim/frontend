import {
  type TextProps,
  Avatar,
  Cell,
  FixedLayout,
  Gap,
  IconCheck,
  Message,
  Separator,
  SubTitle,
  Title,
  UserName,
} from "components"
import { IconChecks, Logo, LogoElumTeam } from "source"

import { type JSX, type Component, For, Show, Switch, Match } from "solid-js"
import { timeAgo } from "@minsize/utils"

interface Header extends JSX.HTMLAttributes<HTMLDivElement> {}

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

const Header: Component<Header> = (props) => {
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
          <Cell.Content>
            <Title nowrap overflow>
              <UserName
                justifyContent={"center"}
                first_name={"Test"}
                last_name={"Test 2"}
                icon={"icon"}
              />
            </Title>
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
