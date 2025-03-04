import style from "./UserName.module.css"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"

import { type JSX, type Component, ValidComponent, splitProps } from "solid-js"
import { emojis } from "root/configs"

interface UserName<T extends ValidComponent = "span"> extends TypeFlex<T> {
  first_name: string
  last_name: string
  emoji?: number
}

const UserName: Component<UserName> = (props) => {
  const [local, others] = splitProps(props, [
    "first_name",
    "last_name",
    "emoji",
  ])
  return (
    <Flex justifyContent={"start"} {...others}>
      {local.first_name} {local.last_name}{" "}
      {emojis[(local.emoji || -1) - 1]?.text}
    </Flex>
  )
}

export default UserName
