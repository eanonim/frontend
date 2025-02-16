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
import { SearchInteresting } from "engine/api/module"
import loc from "engine/languages"
import { useAtom } from "engine/modules/smart-data"
import { SEARCH_OPTIONS_ATOM, STORE_OPTIONS_ATOM } from "engine/state"
import { maxInterest } from "root/configs"
import { modals, pushModal } from "router"

import { type JSX, type Component, For, Show, createMemo } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const [searchOptions, setSearchOptions] = useAtom(SEARCH_OPTIONS_ATOM)
  const [storeOptions] = useAtom(STORE_OPTIONS_ATOM, {
    key: "interest" as "interest",
  })

  const interestsCount = createMemo(
    () =>
      Object.values(searchOptions.interests).filter((x) => x.isSelected)
        .length ?? 0,
    [searchOptions.interests],
  )

  const elements: (
    | {
        text: "man" | "woman" | "any"
        key: "man" | "woman" | "any"
        type: "male"
      }[]
    | {
        text: string
        key: string
        type: "age"
      }[]
  )[] = [
    [
      { text: "man", key: "man", type: "male" },
      { text: "woman", key: "woman", type: "male" },
      { text: "any", key: "any", type: "male" },
    ],
    [
      { text: "18-24", key: "18-24", type: "age" },
      { text: "25-31", key: "25-31", type: "age" },
      { text: "32-38", key: "32-38", type: "age" },
      { text: "39-45", key: "39-45", type: "age" },
      { text: "46+", key: "46-116", type: "age" },
    ],
  ]

  const handlerSelected = (
    from: "you" | "companion",
    type: (typeof elements)[0][0]["type"],
    key: (typeof elements)[0][0]["key"],
  ) => {
    const parts = key.split("-")

    setSearchOptions(from, (you) => {
      if (type === "age") {
        you.age = {
          from: Number(parts[0]),
          to: Number(parts[1]),
        }
      } else {
        you.male = key as any
      }
      return you
    })
  }

  const handlerChangeInteresting = (key: SearchInteresting) => {
    setSearchOptions("interests", key, "isSelected", (bool) => !bool)
  }

  const openModal = () => {
    pushModal({ modalId: modals.INTERESTS_LIST })
  }

  return (
    <Flex height={"100%"} justifyContent={"start"} direction={"column"}>
      <Group>
        <Group.Header mode={"primary"}>{lang("you")}</Group.Header>
        <For each={elements}>
          {(items, index) => (
            <Group.Container>
              <SegmentedControl
                data-index={index()}
                onSelected={(key) => handlerSelected("you", items[0].type, key)}
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
                        <Title>
                          {item.type === "male" ? lang(item.text) : item.text}
                        </Title>
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
        <Group.Header mode={"primary"}>{lang("companion")}</Group.Header>
        <For each={elements}>
          {(items, index) => (
            <Group.Container>
              <SegmentedControl
                data-index={index()}
                onSelected={(key) =>
                  handlerSelected("companion", items[0].type, key)
                }
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
                        <Title>
                          {item.type === "male" ? lang(item.text) : item.text}
                        </Title>
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
        <Group.Header mode={"primary"}>{lang("interests")}</Group.Header>
        <Group.Container>
          <Show
            keyed
            when={
              Object.values(storeOptions?.["interest"] || {}) as {
                key: "interest"
                value: SearchInteresting
                is_premium: boolean
              }[]
            }
          >
            {(interests) => (
              <Show when={Object.values(searchOptions.interests).length}>
                <Tag.Group>
                  <For each={interests}>
                    {(interest, index) => (
                      <Show when={searchOptions.interests[interest.value]}>
                        <Tag
                          onClick={() =>
                            handlerChangeInteresting(interest.value)
                          }
                          data-index={index()}
                          selected={
                            searchOptions.interests[interest.value]?.isSelected
                          }
                        >
                          <Title>
                            {lang(`searchInterests.${interest.value}`)}
                          </Title>
                        </Tag>
                      </Show>
                    )}
                  </For>
                </Tag.Group>
                <Separator size={"indent"} />
              </Show>
            )}
          </Show>

          <Button.Group>
            <Button.Group.Container>
              <Button onClick={openModal} stretched appearance={"secondary"}>
                <Button.Icon style={{ opacity: 0 }}>
                  <Badge size={"small"} type={"text"}>
                    <Badge.Container>
                      <Title>
                        {interestsCount()}/{maxInterest}
                      </Title>
                    </Badge.Container>
                  </Badge>
                </Button.Icon>
                <Button.Container>
                  <Title>{lang("change_interests")}</Title>
                </Button.Container>
                <Button.Icon>
                  <Badge size={"small"} type={"text"}>
                    <Badge.Container>
                      <Title>
                        {interestsCount()}/{maxInterest}
                      </Title>
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
