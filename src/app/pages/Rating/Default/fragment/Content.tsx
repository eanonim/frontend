import {
  type TextProps,
  Avatar,
  Cell,
  Gap,
  Swipe,
  Message,
  SubTitle,
  Title,
  UserName,
  Flex,
  Button,
  Plug,
  Group,
  Badge,
} from "components"

import {
  type JSX,
  type Component,
  For,
  Show,
  createMemo,
  onMount,
  createEffect,
  Index,
} from "solid-js"
import { pages, pushPage, swipeView, views } from "router"
import loc from "engine/languages"
import { timeAgo } from "engine"
import { Chat, Chats } from "engine/class/useChat"
import { createStore } from "solid-js/store"
import { HOST_CDN } from "root/configs"
import { IconTrash } from "source"
import { chatClose } from "engine/api"
import { useAtom } from "engine/modules/smart-data"
import { RATING_ATOM } from "engine/state"
import { formatNumber } from "@minsize/utils"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const [rating] = useAtom(RATING_ATOM)

  return (
    <Cell.List style={{ "overflow-y": "scroll", height: "100%" }}>
      <For each={rating.data}>
        {(item, index) => (
          <Cell data-index={index()} separator>
            <Cell.Container>
              <Cell.Before>
                <Avatar
                  src={`https://${HOST_CDN}/v1/image/user/${item.image}?size=100`}
                  size={"36px"}
                />
              </Cell.Before>
              <Cell.Content>
                <Title>
                  <UserName
                    first_name={item.first_name}
                    last_name={item.last_name}
                    emoji={item.emoji}
                    spoiler={!item.first_name && !item.last_name}
                  />
                </Title>
                <SubTitle>{formatNumber(item.coin)}</SubTitle>
              </Cell.Content>
              <Cell.After>
                <Badge size={"small"} appearance={"secondary"}>
                  <Badge.Container>
                    <SubTitle>{index() + 1}</SubTitle>
                  </Badge.Container>
                </Badge>
              </Cell.After>
            </Cell.Container>
          </Cell>
        )}
      </For>
    </Cell.List>
  )
}

export default Content
