import style from "./IconTask.module.css"

import Avatar from "@component/default/Blocks/Avatar/Avatar"
import Flex from "@component/default/Blocks/Flex/Flex"
import { clamp } from "@minsize/utils"
import { type JSX, type Component, Switch, Match } from "solid-js"
import {
  IconAd,
  IconEdit,
  IconMessageCircleCheck,
  IconPhotoFilled,
  IconPhotoShare,
  IconTrash,
  IconUserPlus,
  IconUsersGroup,
} from "source"

interface IconTask extends JSX.HTMLAttributes<HTMLDivElement> {
  index: number
  image?: string
  type?: string
  size?: string
}

const IconTask: Component<IconTask> = (props) => {
  return (
    <Switch>
      <Match when={!!props.image}>
        <Avatar mode={"app"} src={props.image} size={props.size} />
      </Match>
      <Match when={true}>
        <Flex
          style={{
            width: props.size,
            height: props.size,
          }}
          class={style.IconTask__color}
          classList={{
            [style[
              `IconTask__background--color_${clamp(props.index % 22, 1, 22)}`
            ]]: true,
          }}
        >
          <Switch>
            <Match when={props.type === "education_start_conversation"}>
              <IconMessageCircleCheck width={"65%"} height={"65%"} />
            </Match>
            <Match when={props.type === "daily_subscribe_channel"}>
              <IconUsersGroup width={"65%"} height={"65%"} />
            </Match>
            <Match when={props.type === "daily_invite_friend"}>
              <IconUserPlus width={"65%"} height={"65%"} />
            </Match>
            <Match when={props.type === "daily_send_photos"}>
              <IconPhotoShare width={"65%"} height={"65%"} />
            </Match>
            <Match when={props.type === "daily_watch_ad"}>
              <IconAd width={"65%"} height={"65%"} />
            </Match>
            <Match when={props.type === "education_edit_message"}>
              <IconEdit width={"65%"} height={"65%"} />
            </Match>
            <Match when={props.type === "education_delete_message"}>
              <IconTrash width={"65%"} height={"65%"} />
            </Match>
            <Match when={props.type === "education_change_wallpaper"}>
              <IconPhotoFilled width={"65%"} height={"65%"} />
            </Match>
          </Switch>
        </Flex>
      </Match>
    </Switch>
  )
}

export default IconTask
