import { Background, Flex, Gap, Group, Link, SubTitle } from "components"

import { chunks } from "@minsize/utils"

import { type JSX, type Component, For, Show } from "solid-js"
import { pages, pushPage } from "router"
import { globalSignal } from "elum-state/solid"
import { SETTINGS_ATOM } from "engine/state"
import { useAtom } from "engine/modules/smart-data"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const backgrounds = chunks(
  3,
  Array.from(Array(30)).map((x, index) => index + 2),
)

const Content: Component<Content> = (props) => {
  const [settings] = useAtom(SETTINGS_ATOM)

  const handlerOpen = (type: number) => {
    pushPage({ pageId: pages.BACKGROUND_EDIT, params: { backgroundId: type } })
  }

  return (
    <Group>
      <Group.Container>
        <Gap count={"6px"} direction={"column"} style={{ padding: "6px" }}>
          <For each={backgrounds}>
            {(chunk, chunkIndex) => (
              <Gap data-index={chunkIndex()} count={"6px"}>
                <For each={chunk}>
                  {(backgroundId, index) => (
                    <Background.Preview
                      onClick={() => handlerOpen(backgroundId)}
                      data-index={index()}
                      selected={backgroundId === settings.backgroundId}
                    >
                      <Background
                        color={"#3F3F3F"}
                        type={backgroundId}
                        quality={0.5}
                        onContext={(context) => {
                          if (backgroundId >= 11) {
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

                      <Show when={backgroundId >= 11}>
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
