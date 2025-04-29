import style from "./IconTask.module.css"

import Avatar from "@component/default/Blocks/Avatar/Avatar"
import Flex from "@component/default/Blocks/Flex/Flex"
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
}

const IconTask: Component<IconTask> = (props) => {
  return (
    <Switch>
      <Match when={!!props.image}>
        <Avatar mode={"app"} src={props.image} size={"48px"} />
      </Match>
      <Match when={true}>
        <Flex
          class={style.IconTask__color}
          classList={{
            [style[`IconTask__background--color_${props.index + 1}`]]: true,
          }}
        >
          <Switch>
            <Match when={props.type === "education_start_conversation"}>
              <IconMessageCircleCheck width={32} height={32} />
            </Match>
            <Match when={props.type === "daily_subscribe_channel"}>
              <IconUsersGroup width={32} height={32} />
            </Match>
            <Match when={props.type === "daily_invite_friend"}>
              <IconUserPlus width={32} height={32} />
            </Match>
            <Match when={props.type === "daily_send_photos"}>
              <IconPhotoShare width={32} height={32} />
            </Match>
            <Match when={props.type === "daily_watch_ad"}>
              <IconAd width={32} height={32} />
            </Match>
            <Match when={props.type === "education_edit_message"}>
              <IconEdit width={32} height={32} />
            </Match>
            <Match when={props.type === "education_delete_message"}>
              <IconTrash width={32} height={32} />
            </Match>
            <Match when={props.type === "education_change_wallpaper"}>
              <IconPhotoFilled width={32} height={32} />
            </Match>
          </Switch>
        </Flex>
      </Match>
    </Switch>
  )
}

export default IconTask
