import { Button, Cell, FixedLayout, TextProps, Title } from "components"
import loc from "engine/languages"
import { backPage } from "router"

import { type JSX, type Component } from "solid-js"
import { IconClose } from "source"

interface Header extends JSX.HTMLAttributes<HTMLDivElement> {}

const textProps: TextProps = {
  iOS: {
    color: "primary",
    size: "large",
    weight: "500",
  },
  android: "iOS",
  macOS: "iOS",
  windows: "iOS",
  others: "iOS",
}

const Header: Component<Header> = (props) => {
  const [lang] = loc()

  const handlerBack = () => {
    backPage()
  }

  return (
    <FixedLayout position={"top"}>
      <Cell>
        <Cell.Container>
          <Cell.Content>
            <Title {...textProps}>{lang("name")}</Title>
          </Cell.Content>
          <Cell.After>
            <Button
              onClick={handlerBack}
              type={"icon"}
              size={"small"}
              appearance={"secondary"}
              mode={"transparent"}
            >
              <Button.Container>
                <IconClose
                  width={24}
                  height={24}
                  fill={"var(--text_primary)"}
                />
              </Button.Container>
            </Button>
          </Cell.After>
        </Cell.Container>
      </Cell>
    </FixedLayout>
  )
}
export default Header
