import {
  Badge,
  BannerProject,
  Button,
  Cell,
  Flex,
  Group,
  SegmentedControl,
  Separator,
  SubTitle,
  Tag,
  Title,
  usePlatform,
} from "components"
import { formatNumberWithDotsRegex } from "engine"
import { storeSet } from "engine/api"
import { SearchInteresting } from "engine/api/module"
import loc, { Locale } from "engine/languages"
import { useAtom } from "engine/modules/smart-data"
import {
  SEARCH_OPTIONS_ATOM,
  SETTINGS_ATOM,
  STORE_INTEREST_ATOM,
  USER_ATOM,
} from "engine/state"
import { maxInterest } from "root/configs"
import { modals, pushModal } from "router"

import {
  type JSX,
  type Component,
  For,
  Show,
  createMemo,
  createEffect,
} from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()

  const platform = usePlatform()

  const [user] = useAtom(USER_ATOM)
  const [settings, setSettings] = useAtom(SETTINGS_ATOM)
  const [searchOptions, setSearchOptions] = useAtom(SEARCH_OPTIONS_ATOM)
  const [storeInterest] = useAtom(STORE_INTEREST_ATOM)

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

  const handlerChangeLanguage = (key: Locale) => {
    setSearchOptions("language", key)
  }

  const openModal = () => {
    pushModal({ modalId: modals.INTERESTS_LIST })
  }

  const onCloseBanner = () => {
    setSettings("bannerStartup", false)
  }

  createEffect(() => {
    console.log({ settings })
  })

  return (
    <Flex
      style={{
        "overflow-x": "hidden",
        "overflow-y": "auto",
      }}
      height={"100%"}
      justifyContent={"start"}
      direction={"column"}
    >
      <Show when={settings.bannerStartup !== false}>
        <BannerProject
          onClose={onCloseBanner}
          title={"ANChat"}
          subtitle={"здесь начинается анонимное общение"}
          subtitle2={
            "Настраивай интересы, выбирай собеседника - и начинай диалог!"
          }
        />
      </Show>
      <Group.List>
        <Group>
          <Group.Container>
            <Cell>
              <Cell.Container>
                <Cell.Content>
                  <Title>{formatNumberWithDotsRegex(user.coin || 0)}</Title>
                  <SubTitle>{lang("your_coin_balance")}</SubTitle>
                </Cell.Content>
              </Cell.Container>
            </Cell>
          </Group.Container>
        </Group>
        <Group>
          <Group.Header mode={"primary"}>{lang("you")}</Group.Header>
          <For each={elements}>
            {(items, index) => (
              <Group.Container>
                <SegmentedControl
                  data-index={index()}
                  onSelected={(key) =>
                    handlerSelected("you", items[0].type, key)
                  }
                  selected={
                    items[0].type === "male"
                      ? searchOptions.you.male
                      : Object.values(searchOptions.you.age)
                          .map((x) => x)
                          .join("-")
                  }
                >
                  <For
                    each={items[0].type === "male" ? items.slice(0, 2) : items}
                  >
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

        <Show when={platform() === "iOS"}>
          <Separator size={"indent"} />
        </Show>
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
          <Group.Header mode={"primary"}>{lang("language")}</Group.Header>
          <Group.Container>
            <Tag.Group>
              <For
                each={
                  Object.entries(
                    lang(`languages`) as Record<Locale, string>,
                  ) as unknown as [Locale, string][]
                }
              >
                {([key, locale], index) => (
                  <Tag
                    mode={"square"}
                    onClick={() => handlerChangeLanguage(key)}
                    data-index={index()}
                    selected={searchOptions.language === key}
                  >
                    <Title>{locale}</Title>
                  </Tag>
                )}
              </For>
            </Tag.Group>
          </Group.Container>
        </Group>
        <Group>
          <Group.Header mode={"primary"}>{lang("interests")}</Group.Header>
          <Group.Container>
            <Show keyed when={Object.values(storeInterest)}>
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
                              searchOptions.interests[interest.value]
                                ?.isSelected
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
      </Group.List>
    </Flex>
  )
}

export default Content
