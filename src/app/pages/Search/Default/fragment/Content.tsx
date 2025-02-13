import {
  Badge,
  Button,
  Flex,
  Gap,
  Grid,
  Group,
  SegmentedControl,
  Separator,
  Tag,
  Title,
} from "components"
import loc from "engine/languages"

import { type JSX, type Component, For } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()

  const elements = [
    [
      { text: "Мужской", key: "1" },
      { text: "Женский", key: "2" },
    ],
    [
      { text: "18-24", key: "3" },
      { text: "25-31", key: "4" },
      { text: "32-38", key: "5" },
      { text: "39-45", key: "6" },
      { text: "46+", key: "7" },
    ],
  ]

  return (
    <Flex height={"100%"} justifyContent={"start"} direction={"column"}>
      <Group>
        <Group.Header mode={"primary"}>Вы</Group.Header>
        <For each={elements}>
          {(items, index) => (
            <Group.Container>
              <SegmentedControl
                data-index={index()}
                onSelected={() => {}}
                selected={items[0].key}
              >
                <For each={items}>
                  {(item, itemIndex) => (
                    <SegmentedControl.Button
                      data-index={itemIndex()}
                      stretched
                      key={item.key}
                    >
                      <SegmentedControl.Button.Container>
                        <Title>{item.text}</Title>
                      </SegmentedControl.Button.Container>
                    </SegmentedControl.Button>
                  )}
                </For>
              </SegmentedControl>
            </Group.Container>
          )}
        </For>
      </Group>

      <Separator size={"indent"} />
      <Group>
        <Group.Header mode={"primary"}>Собеседник</Group.Header>
        <For each={elements}>
          {(items, index) => (
            <Group.Container>
              <SegmentedControl
                data-index={index()}
                onSelected={() => {}}
                selected={items[0].key}
              >
                <For each={items}>
                  {(item, itemIndex) => (
                    <SegmentedControl.Button
                      data-index={itemIndex()}
                      stretched
                      key={item.key}
                    >
                      <SegmentedControl.Button.Container>
                        <Title>{item.text}</Title>
                      </SegmentedControl.Button.Container>
                    </SegmentedControl.Button>
                  )}
                </For>
              </SegmentedControl>
            </Group.Container>
          )}
        </For>
      </Group>
      <Group>
        <Group.Header mode={"primary"}>Темы</Group.Header>
        <Group.Container>
          <Tag.Group>
            <Tag selected>
              <Title>Знакомства</Title>
            </Tag>
            <Tag selected>
              <Title>Спорт</Title>
            </Tag>
            <Tag>
              <Title>Мемы</Title>
            </Tag>
            <Tag>
              <Title>Поддержка</Title>
            </Tag>
          </Tag.Group>
          <Separator size={"indent"} />
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
