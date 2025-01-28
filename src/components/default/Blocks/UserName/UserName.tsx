import style from "./UserName.module.css"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"

import { type JSX, type Component, ValidComponent, splitProps } from "solid-js"

interface UserName<T extends ValidComponent = "span"> extends TypeFlex<T> {
  first_name: string
  last_name: string
  icon?: string
}

const UserName: Component<UserName> = (props) => {
  const [local, others] = splitProps(props, ["first_name", "last_name", "icon"])
  return (
    <Flex justifyContent={"start"} {...others}>
      {local.first_name} {local.last_name} {local.icon}
    </Flex>
  )
}

export default UserName
