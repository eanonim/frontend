import {
  Avatar,
  Cell,
  FixedLayout,
  Separator,
  Title,
  UserName,
} from "components"

import { type JSX, type Component } from "solid-js"

interface Header extends JSX.HTMLAttributes<HTMLDivElement> {}

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
