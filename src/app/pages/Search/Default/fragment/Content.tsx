import {
  Badge,
  Button,
  Flex,
  Group,
  SegmentedControl,
  Separator,
  Tag,
  Title,
} from "components"
import loc from "engine/languages"
import { useAtom } from "engine/modules/smart-data"
import { SEARCH_OPTIONS_ATOM } from "engine/state"

import { type JSX, type Component, For, Show } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const [searchOptions] = useAtom(SEARCH_OPTIONS_ATOM)

  const elements = [
    [
      { text: "Мужской", key: "man", type: "male" },
      { text: "Женский", key: "woman", type: "male" },
    ],
    [
      { text: "18-24", key: "18-24", type: "age" },
      { text: "25-31", key: "25-31", type: "age" },
      { text: "32-38", key: "32-38", type: "age" },
      { text: "39-45", key: "39-45", type: "age" },
      { text: "46+", key: "46+", type: "age" },
    ],
  ]

  const handlerSelectedYou = (
    type: (typeof elements)[0][0]["type"],
    key: string,
  ) => {}

  return (
    <Flex height={"100%"} justifyContent={"start"} direction={"column"}>
      <Group>
        <Group.Header mode={"primary"}>Вы</Group.Header>
        <For each={elements}>
          {(items, index) => (
            <Group.Container>
              <SegmentedControl
                data-index={index()}
                onSelected={(key) => handlerSelectedYou(items[0].type, key)}
                selected={
                  items[0].type === "male"
                    ? searchOptions.you.male
                    : Object.values(searchOptions.you.age)
                        .map((x) => x)
                        .join("-")
                }
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
                selected={
                  items[0].type === "male"
                    ? searchOptions.companion.male
                    : Object.values(searchOptions.companion.age)
                        .map((x) => x)
                        .join("-")
                }
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
          <Show keyed when={searchOptions.themes}>
            {(themes) => (
              <Tag.Group>
                <For each={themes}>
                  {(theme, index) => (
                    <Tag data-index={index()} selected>
                      <Title>{lang(`searchThemes.${theme}`)}</Title>
                    </Tag>
                  )}
                </For>
              </Tag.Group>
            )}
          </Show>
          <Separator size={"indent"} />
          <Button.Group>
            <Button.Group.Container>
              <Button stretched appearance={"secondary"}>
                <Button.Icon style={{ opacity: 0 }}>
                  <Badge size={"small"} type={"text"}>
                    <Badge.Container>
                      <Title>{searchOptions.themes.length ?? 0}/5</Title>
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
