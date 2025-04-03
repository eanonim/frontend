import { View, Path } from "components"
import { panels, useRouterPanel } from "router"

import { type JSX, type Component } from "solid-js"

import Action from "app/action"

interface Task extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Task: Component<Task> = (props) => {
  const activePanel = useRouterPanel(props.nav)

  return (
    <View {...props} activePanel={activePanel()}>
      <Path nav={panels.TASK} component={Action} />
    </View>
  )
}

export default Task
