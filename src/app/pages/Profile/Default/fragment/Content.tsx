import {
  type TextProps,
  Cell,
  Group,
  IconBackground,
  IconChevron,
  Title,
} from "components"
import {
  IconCameraPlus,
  IconMoodEdit,
  IconUserEdit,
  Logo,
  LogoElumTeam,
} from "source"

import { type JSX, type Component, For, Switch, Match, Show } from "solid-js"
import { pages, pushPage } from "router"

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
  const elements: {
    icon: Component<JSX.SvgSVGAttributes<SVGSVGElement>>
    title: string
    isAccent?: boolean
    color?: string
    handler?: () => void
  }[][] = [
    [
      {
        icon: IconUserEdit,
        title: "Изменить имя",
        isAccent: true,
      },
      {
        icon: IconMoodEdit,
        title: "Сменить эмодзи-статус",
        isAccent: true,
      },
      {
        icon: IconCameraPlus,
        title: "Изменить фотографию",
        isAccent: true,
      },
    ],
    [
      {
        icon: IconUserEdit,
        title: "Цветовая схема",
        color: "#33A4DA",
      },
      {
        icon: IconMoodEdit,
        title: "Фон бесед",
        color: "#A2845E",
      },
      {
        icon: IconCameraPlus,
        title: "Размер текста",
        color: "#5CA19A",
        handler: () => pushPage({ pageId: pages.FONTSIZE }),
      },
    ],
    [
      {
        icon: IconUserEdit,
        title: "Сотрудничество",
        color: "#FEC319",
      },
      {
        icon: IconMoodEdit,
        title: "Политика конфиденциальности",
        color: "#33C6DA",
      },
      {
        icon: IconCameraPlus,
        title: "Помощь",
        color: "#FF0000",
      },
    ],
  ]

  return (
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
                          {cell.title}
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
  )
}

export default Content
