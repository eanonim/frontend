import style from "./GroupList.module.css"
import { type JSX, type Component, mergeProps, splitProps } from "solid-js"

interface GroupList extends JSX.HTMLAttributes<HTMLDivElement> {}

const GroupList: Component<GroupList> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <div
      class={style.GroupList}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      {local.children}
    </div>
  )
}

export default GroupList
