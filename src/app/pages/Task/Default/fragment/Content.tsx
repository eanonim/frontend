import { Avatar, Cell, Group, SubTitle, Title } from "components"

import { type JSX, type Component, For, Show } from "solid-js"
import loc, { getLocale } from "engine/languages"
import { useAtom } from "engine/modules/smart-data"
import { TASK_ATOM } from "engine/state"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const [task] = useAtom(TASK_ATOM, {
    lang: getLocale(),
    group: "main",
  })

  return (
    <Group>
      <Group.Container>
        <Cell.List style={{ "overflow-y": "scroll", height: "100%" }}>
          <For each={Object.values(task)?.[0]?.tasks}>
            {(item, index) => (
              <Show keyed when={item?.[0]}>
                {(task) => (
                  <Cell data-index={index()} separator>
                    <Cell.Before>
                      <Avatar mode={"app"} src={task.image} size={"48px"} />
                    </Cell.Before>
                    <Cell.Container>
                      <Cell.Content>
                        <Title>{task.title || "Unknown"}</Title>
                        <SubTitle>{task.description}</SubTitle>
                      </Cell.Content>
                    </Cell.Container>
                  </Cell>
                )}
              </Show>
            )}
          </For>
        </Cell.List>
      </Group.Container>
    </Group>
  )
}

export default Content
