import { Avatar, IconTask, Plug, SubTitle, Title } from "@component/index"
import { getLocale } from "engine/languages"
import { useAtom } from "engine/modules/smart-data"
import { TASK_ATOM } from "engine/state"
import { modals, useParams } from "router"
import { routerParams } from "router/routerStruct"
import { type JSX, type Component, createMemo, Show } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const params = useParams<routerParams[modals.MODAL_TASK]>({
    modalId: modals.MODAL_TASK,
  })

  const [tasks] = useAtom(TASK_ATOM, {
    lang: getLocale(),
    group: params().group,
  })

  const task = createMemo(() => {
    for (const items of tasks?.tasks || []) {
      for (const task of items) {
        if (task.id === params().task_id) {
          return task
        }
      }
    }
  })
  return (
    <Show keyed when={task()}>
      {(task) => (
        <Plug>
          <Plug.Icon>
            <IconTask
              size={"72px"}
              image={task.image}
              type={task.type}
              index={task.id}
            />
          </Plug.Icon>
          <Plug.Container>
            <Title>{task.title || "Unknown"}</Title>
            <SubTitle>{task.description || "Unknown"}</SubTitle>
          </Plug.Container>
        </Plug>
      )}
    </Show>
  )
}

export default Content
