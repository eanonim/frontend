import { Badge, Button, Flex, Group, Title } from "components"
import loc from "engine/languages"

import { type JSX, type Component } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()

  return (
    <Flex height={"100%"} alignItems={"start"}>
      <Group>
        <Group.Container>
          <Button.Group>
            <Button.Group.Container>
              <Button stretched appearance={"secondary"}>
                <Button.Icon style={{ opacity: 0 }}>
                  <Badge size={"small"} type={"text"}>
                    <Badge.Container>
                      <Title>5/5</Title>
                    </Badge.Container>
                  </Badge>
                </Button.Icon>
                <Button.Container>
                  <Title>{lang("change_themes")}</Title>
                </Button.Container>
                <Button.Icon>
                  <Badge size={"small"} type={"text"}>
                    <Badge.Container>
                      <Title>5/5</Title>
                    </Badge.Container>
                  </Badge>
                </Button.Icon>
              </Button>
            </Button.Group.Container>
          </Button.Group>
        </Group.Container>
      </Group>
    </Flex>
  )
}

export default Content
