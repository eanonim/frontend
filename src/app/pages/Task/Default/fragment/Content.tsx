import { Avatar, Cell, Gap, Group, IconTask, SubTitle, Title } from "components"

import { type JSX, type Component, For, Show } from "solid-js"
import loc, { getLocale } from "engine/languages"
import { useAtom } from "engine/modules/smart-data"
import { TASK_ATOM } from "engine/state"
import { modals, pushModal } from "router"
import { IconCoins } from "source"
import { formatNumber } from "@minsize/utils"
import { Socket } from "engine/api/module"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

/*TODO: Добавить надпись: Задание выполнено */
const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const [taskDaily] = useAtom(TASK_ATOM, {
    lang: getLocale(),
    group: "daily",
  })

  const [taskEducation] = useAtom(TASK_ATOM, {
    lang: getLocale(),
    group: "education",
  })

  const [taskPartners] = useAtom(TASK_ATOM, {
    lang: getLocale(),
    group: "partners",
  })

  const handlerOpen = (
    task_id: number,
    group: Socket["task.list"]["request"]["group"],
  ) => {
    pushModal({
      modalId: modals.MODAL_TASK,
      params: {
        task_id: task_id,
        group: group,
      },
    })
  }

  return (
    <For each={[taskDaily, taskEducation, taskPartners]}>
      {(group, index) => (
        <Show when={group.tasks}>
          <Group>
            <Group.Header mode={"primary"}>{group.title}</Group.Header>
            <Group.Container>
              <Cell.List style={{ "overflow-y": "scroll", height: "100%" }}>
                <For
                  each={Object.values(
                    (group?.tasks || []).sort(
                      (a, b) =>
                        (a?.[0].status === "CLOSE" ? 1 : 0) -
                        (b?.[0].status === "CLOSE" ? 1 : 0),
                    ),
                  )}
                >
                  {(item, index) => (
                    <Show
                      keyed
                      when={
                        item.find((x) => x.status === "OPEN") ||
                        item.findLast((x) => x.status === "CLOSE")
                      }
                    >
                      {(task) => (
                        <Cell
                          data-index={index()}
                          separator
                          onClick={() =>
                            handlerOpen(task.id, group.object_name || "daily")
                          }
                        >
                          <Cell.Before>
                            <IconTask
                              image={task.image}
                              type={task.type}
                              index={index()}
                            />
                          </Cell.Before>
                          <Cell.Container>
                            <Cell.Content>
                              <Title>{task.title || "Unknown"}</Title>
                              <SubTitle>
                                <Show
                                  when={task.status !== "CLOSE"}
                                  fallback={lang("task_completed")}
                                >
                                  <Gap
                                    count={"4px"}
                                    justifyContent={"start"}
                                    alignItems={"center"}
                                  >
                                    {formatNumber(task.item?.[0].count)}{" "}
                                    <IconCoins height={14} width={14} />
                                  </Gap>
                                </Show>
                              </SubTitle>
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
        </Show>
      )}
    </For>
  )
}

export default Content
