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
  IconInvite,
  IconLanguage,
  IconLetterCase,
  IconMoodEdit,
  IconPhotoFilled,
  IconUserEdit,
} from "source"

import { type JSX, type Component, For, Switch, Match, Show } from "solid-js"
import { modals, pages, pushModal, pushPage } from "router"
import { createImage, timeAgo, timeAgoOnlyDate } from "engine"
import { useAtom } from "engine/modules/smart-data"
import { USER_ATOM } from "engine/state"
import { imageUpload, userAvatarSet } from "engine/api"

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

  const setAvatar = async () => {
    const element = document.getElementById(
      "add_image_profile",
    ) as HTMLInputElement
    if (element) {
      element.type = "file"
      element.multiple = false
      element.accept = "image/*"
      element.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]

        if (!file) return

        const image = await createImage(file)
        if (image) {
          const form = new FormData()
          form.append("data", image)
          form.append("group", "user")
          const { response, error } = await imageUpload(form)
          if (response) {
            userAvatarSet({ id: response.id })
          }
        }
      }
      element.click()
    }
  }

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
      | "language"
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
        handler: () => setAvatar(),
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
      {
        icon: IconLanguage,
        title: "language",
        color: "#903ec4",
        handler: () => pushPage({ pageId: pages.LANGUAGE }),
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

  const goReferral = () => {
    pushPage({ pageId: pages.REFERRAL })
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
                <Title>{lang("premium")}</Title>
                <Show
                  keyed
                  when={
                    (user.premium || new Date()).getTime() > Date.now() &&
                    user.premium
                  }
                >
                  {(premium) => (
                    <SubTitle>
                      {lang("active_until", timeAgo(premium.getTime()))}
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
      <Group>
        <Group.Container>
          <Cell onClick={goReferral}>
            <Cell.Before>
              <IconInvite width={28} height={28} fill={"var(--accent_color)"} />
            </Cell.Before>
            <Cell.Container>
              <Cell.Content>
                <Title>{lang("referral.title")}</Title>
                <SubTitle>{lang("referral.subtitle")}</SubTitle>
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
      <input
        type={"file"}
        multiple
        id={"add_image_profile"}
        style={{
          opacity: 0,
          "max-height": "0px",
          "max-width": "0px",
          overflow: "hidden",
          display: "none",
        }}
      />
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
