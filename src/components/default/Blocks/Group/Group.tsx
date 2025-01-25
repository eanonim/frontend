import { styles } from "./styles"
import { Container } from "./addons"
import { Footer, Header } from "./Fonts"

import { type HTMLAttributes } from "@ui/Types"
import useStyle from "@ui/default/utils/useStyle"

import { type Component, mergeProps, splitProps } from "solid-js"

interface Group extends HTMLAttributes<HTMLElement> {}

interface ComponentGroup extends Component<Group> {
  Header: typeof Header
  Footer: typeof Footer
  Container: typeof Container
}

const Group: ComponentGroup = (props) => {
  const style = useStyle(styles, props.platform)
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "platform",
    "class",
    "classList",
    "children",
  ])

  return (
    <section
      class={style.Group}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      {local.children}
    </section>
  )
}

Group.Header = Header
Group.Footer = Footer
Group.Container = Container

export default Group
