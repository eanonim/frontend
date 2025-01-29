import { Background, Gap, Group, IconBackground, Ratio } from "components"

import { chunks } from "@minsize/utils"

import { type JSX, type Component, For } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  return (
    <Group>
      <Group.Container>
        <Gap count={"6px"} direction={"column"} style={{ padding: "6px" }}>
          <For each={chunks(3, Array(30))}>
            {(chunk, chunkIndex) => (
              <Gap data-index={chunkIndex()} count={"6px"}>
                <For each={chunk}>
                  {(background, index) => (
                    <IconBackground
                      data-index={index()}
                      border-radius={"8px"}
                      color={"var(--bg_color)"}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Background
                        color={"#3F3F3F"}
                        type={chunkIndex() + index() + 2}
                      />
                    </IconBackground>
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
