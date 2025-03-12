import style from "./UserName.module.css"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"

import {
  type JSX,
  type Component,
  ValidComponent,
  splitProps,
  Match,
  Switch,
} from "solid-js"
import { emojis } from "root/configs"

interface UserName<T extends ValidComponent = "span"> extends TypeFlex<T> {
  first_name: string
  last_name: string
  emoji?: number
  spoiler?: boolean
}

const UserName: Component<UserName> = (props) => {
  const [local, others] = splitProps(props, [
    "first_name",
    "last_name",
    "emoji",
    "spoiler",
  ])
  return (
    <Flex class={style.UserName} justifyContent={"start"} {...others}>
      <Switch
        fallback={
          <>
            {local.first_name} {local.last_name}{" "}
            {emojis[(local.emoji || -1) - 1]?.text}
          </>
        }
      >
        <Match when={local.spoiler}>
          <span class={style[`UserName--spoiler__first`]} />
          <span class={style[`UserName--spoiler__last`]} />
        </Match>
      </Switch>
    </Flex>
  )
}

export default UserName
