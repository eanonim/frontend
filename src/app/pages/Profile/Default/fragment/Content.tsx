import { type TextProps, Cell, Group, Title } from "components"
import { Logo, LogoElumTeam } from "source"

import { type JSX, type Component } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const textProps: TextProps = {
  iOS: {
    color: "accent",
    size: "medium",
    weight: "400",
  },
  android: {
    color: "accent",
    size: "medium",
    weight: "500",
  },
  macOS: "iOS",
  windows: "iOS",
  others: "iOS",
}

const Content: Component<Content> = (props) => {
  return (
    <>
      <Group>
        <Group.Container>
          <Cell.List>
            <Cell separator>
              <Cell.Before>ICON</Cell.Before>
              <Cell.Container>
                <Cell.Content>
                  <Title {...textProps}>Изменить имя</Title>
                </Cell.Content>
              </Cell.Container>
            </Cell>

            <Cell separator>
              <Cell.Before>ICON</Cell.Before>
              <Cell.Container>
                <Cell.Content>
                  <Title {...textProps}>Сменить эмодзи-статус</Title>
                </Cell.Content>
              </Cell.Container>
            </Cell>

            <Cell separator>
              <Cell.Before>ICON</Cell.Before>
              <Cell.Container>
                <Cell.Content>
                  <Title {...textProps}>Изменить фотографию</Title>
                </Cell.Content>
              </Cell.Container>
            </Cell>
          </Cell.List>
        </Group.Container>
      </Group>
    </>
  )
}

export default Content
