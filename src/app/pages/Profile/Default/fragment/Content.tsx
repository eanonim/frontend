import {
  type TextProps,
  Button,
  Cell,
  Group,
  IconBackground,
  IconChevron,
  SubTitle,
  Title,
} from "components"
import loc from "engine/languages"

import {
  IconAlignBoxLeftTopFilled,
  IconBugFilled,
  IconCameraPlus,
  IconCarambolaFilled,
  IconCircleHalf,
  IconDiamondFilled,
  IconLetterCase,
  IconMoodEdit,
  IconPhotoFilled,
  IconUserEdit,
} from "source"

import { type JSX, type Component, For, Switch, Match, Show } from "solid-js"
import { modals, pages, pushModal, pushPage } from "router"
import { timeAgo, timeAgoOnlyDate } from "engine"
import { useAtom } from "engine/modules/smart-data"
import { USER_ATOM } from "engine/state"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const textProps: TextProps = {
  iOS: {
    color: "accent",
    size: "medium",
    weight: "500",
  },
  android: {
    color: "accent",
    size: "medium",
    weight: "500",
  },
  macOS: "iOS",
  windows: "iOS",
  others: "iOS",
}

const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const [user] = useAtom(USER_ATOM)

  const elements: {
    icon: Component<JSX.SvgSVGAttributes<SVGSVGElement>>
    title:
      | "change_name"
      | "change_emoji_status"
      | "change_photo"
      | "color_scheme"
      | "conversation_background"
      | "text_size"
      | "cooperation"
      | "privacy_policy"
      | "help"
    isAccent?: boolean
    color?: string
    handler?: () => void
  }[][] = [
    [
      {
        icon: IconUserEdit,
        title: "change_name",
        isAccent: true,
        handler: () => pushModal({ modalId: modals.USER_CHANGE_NAME }),
      },
      {
        icon: IconMoodEdit,
        title: "change_emoji_status",
        isAccent: true,
        handler: () => pushModal({ modalId: modals.USER_EMOJI }),
      },
      {
        icon: IconCameraPlus,
        title: "change_photo",
        isAccent: true,
      },
    ],
    [
      {
        icon: IconCircleHalf,
        title: "color_scheme",
        color: "#33A4DA",
        handler: () => pushPage({ pageId: pages.THEME }),
      },
      {
        icon: IconPhotoFilled,
        title: "conversation_background",
        color: "#A2845E",
        handler: () => pushPage({ pageId: pages.BACKGROUNDS }),
      },
      {
        icon: IconLetterCase,
        title: "text_size",
        color: "#5CA19A",
        handler: () => pushPage({ pageId: pages.FONTSIZE }),
      },
    ],
    [
      {
        icon: IconDiamondFilled,
        title: "cooperation",
        color: "#FEC319",
      },
      {
        icon: IconAlignBoxLeftTopFilled,
        title: "privacy_policy",
        color: "#33C6DA",
      },
      {
        icon: IconBugFilled,
        title: "help",
        color: "#FF0000",
      },
    ],
  ]

  const goPremium = () => {
    pushPage({ pageId: pages.PREMIUM })
  }

  return (
    <Group.List>
      <Group>
        <Group.Container>
          <Cell onClick={goPremium}>
            <Cell.Before>
              <IconCarambolaFilled
                width={28}
                height={28}
                fill={"var(--accent_color)"}
              />
            </Cell.Before>
            <Cell.Container>
              <Cell.Content>
                <Title>Premium</Title>
                <Show
                  keyed
                  when={
                    (user.premium || new Date()).getTime() > Date.now() &&
                    user.premium
                  }
                >
                  {(premium) => (
                    <SubTitle>
                      Активен до: {timeAgo(premium.getTime())}
                    </SubTitle>
                  )}
                </Show>
              </Cell.Content>
              <Cell.After>
                <IconChevron
                  type={"right"}
                  size={"20px"}
                  color={"var(--separator_secondary)"}
                />
              </Cell.After>
            </Cell.Container>
          </Cell>
        </Group.Container>
      </Group>
      <For each={elements}>
        {(group, index) => (
          <Group data-index={index()}>
            <Group.Container>
              <Cell.List>
                <For each={group}>
                  {(cell, index) => (
                    <Cell data-index={index()} separator onClick={cell.handler}>
                      <Cell.Before>
                        <Switch
                          fallback={
                            <cell.icon
                              width={28}
                              height={28}
                              color={cell.isAccent ? "var(--accent_color)" : ""}
                            />
                          }
                        >
                          <Match keyed when={cell.color}>
                            {(color) => (
                              <IconBackground
                                padding={"4px"}
                                border-radius={"8px"}
                                color={color}
                              >
                                <cell.icon
                                  width={20}
                                  height={20}
                                  color={"white"}
                                />
                              </IconBackground>
                            )}
                          </Match>
                        </Switch>
                      </Cell.Before>
                      <Cell.Container>
                        <Cell.Content>
                          <Title {...(cell.isAccent ? textProps : {})}>
                            {lang(cell.title)}
                          </Title>
                        </Cell.Content>
                        <Show when={!!cell.color}>
                          <Cell.After>
                            <IconChevron
                              type={"right"}
                              size={"20px"}
                              color={"var(--separator_secondary)"}
                            />
                          </Cell.After>
                        </Show>
                      </Cell.Container>
                    </Cell>
                  )}
                </For>
              </Cell.List>
            </Group.Container>
          </Group>
        )}
      </For>
    </Group.List>
  )
}

export default Content
