import {
  type TextProps,
  Background,
  Cell,
  Flex,
  Gap,
  Group,
  Link,
  SubTitle,
  Title,
} from "components"

import { chunks } from "@minsize/utils"

import {
  type JSX,
  type Component,
  For,
  Show,
  createMemo,
  createEffect,
} from "solid-js"
import { pages, pushPage } from "router"
import { SETTINGS_ATOM, STORE_BACKGROUND_ATOM, USER_ATOM } from "engine/state"
import { useAtom } from "engine/modules/smart-data"
import { isPremium } from "engine"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const textProps: TextProps = {
  iOS: {
    color: "accent",
    size: "medium",
    weight: "500",
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
  const [storeBackground] = useAtom(STORE_BACKGROUND_ATOM)
  const [settings] = useAtom(SETTINGS_ATOM)
  const [user] = useAtom(USER_ATOM)
  const handlerOpen = (type: number) => {
    const premium = storeBackground[type]?.is_premium ?? true

    if (premium && !isPremium(user.premium)) return
    pushPage({ pageId: pages.BACKGROUND_EDIT, params: { backgroundId: type } })
  }

  const userPremium = createMemo(() => isPremium(user.premium))

  return (
    <Group>
      <Group.Container>
        <Cell.List>
          <Cell onClick={() => handlerOpen(0)}>
            <Cell.Container>
              <Cell.Content>
                <Title color={"accent"}>Задать цвет</Title>
              </Cell.Content>
            </Cell.Container>
          </Cell>
        </Cell.List>
      </Group.Container>
      <Group.Container>
        <Gap count={"6px"} direction={"column"} style={{ padding: "6px" }}>
          <For
            each={chunks(
              3,
              (
                Object.values(storeBackground) as {
                  key: "backgroundId"
                  value: number
                  is_premium: boolean
                }[]
              ).sort((a, b) => a.value - b.value),
            )}
          >
            {(chunk, chunkIndex) => (
              <Gap data-index={chunkIndex()} count={"6px"}>
                <For each={chunk}>
                  {(background, index) => (
                    <Background.Preview
                      onClick={() => handlerOpen(background.value)}
                      data-index={index()}
                      selected={background.value === settings.backgroundId}
                    >
                      <Background
                        color={"#3F3F3F"}
                        type={background.value}
                        quality={0.5}
                        onContext={(context) => {
                          if (background.is_premium && !userPremium()) {
                            context.fillStyle = "rgba(0,0,0,0.6)"
                            context.fillRect(
                              0,
                              0,
                              window.innerWidth,
                              window.innerHeight,
                            )
                          }
                        }}
                      />

                      <Show when={background.is_premium && !userPremium()}>
                        <Background.Overlay>
                          <Flex height={"100%"}>
                            <SubTitle align={"center"}>
                              Только по <Link>подписке</Link>
                            </SubTitle>
                          </Flex>
                        </Background.Overlay>
                      </Show>
                    </Background.Preview>
                  )}
                </For>
              </Gap>
            )}
          </For>
        </Gap>
      </Group.Container>
    </Group>
  )
}

export default Content
