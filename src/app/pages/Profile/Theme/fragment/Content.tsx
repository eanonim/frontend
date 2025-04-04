import {
  BadgePremium,
  Cell,
  Group,
  HTMLAttributes,
  IconCheck,
  Title,
} from "components"

import {
  type JSX,
  type Component,
  For,
  Switch,
  Match,
  splitProps,
  Show,
} from "solid-js"
import { SETTINGS_ATOM, STORE_THEME_COLOR_ATOM } from "engine/state"
import { useAtom } from "engine/modules/smart-data"
import { Socket } from "engine/api/module"
import loc from "engine/languages"
import { setTheme, setThemeColor } from "engine/state/settings"
import { DynamicProps } from "solid-js/web"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const [settings] = useAtom(SETTINGS_ATOM)
  const [themeColor] = useAtom(STORE_THEME_COLOR_ATOM)

  const handlerSet = (theme: Socket["store.list"]["response"]["theme"]) => {
    setTheme(theme)
  }

  const handlerSetColor = (
    themeColor: Socket["store.list"]["response"]["themeColor"],
  ) => {
    setThemeColor(themeColor)
  }

  return (
    <Group.List>
      <Group>
        <Group.Container>
          <Cell.List>
            <For
              each={
                Object.keys(
                  lang("theme") as any,
                ) as Socket["store.list"]["response"]["theme"][]
              }
            >
              {(theme, index) => (
                <Element
                  data-index={index()}
                  onClick={() => handlerSet(theme)}
                  when={settings.theme === theme}
                  locale={lang(`theme.${theme}`)}
                />
              )}
            </For>
          </Cell.List>
        </Group.Container>
      </Group>
      <Group>
        <Group.Container>
          <Cell.List>
            <For
              each={
                Object.keys(
                  lang("themeColor") as any,
                ) as Socket["store.list"]["response"]["themeColor"][]
              }
            >
              {(theme, index) => (
                <Element
                  data-index={index()}
                  onClick={() => handlerSetColor(theme)}
                  when={settings.themeColor === theme}
                  locale={lang(`themeColor.${theme}` as any)}
                  isPremium={themeColor[theme]?.is_premium}
                />
              )}
            </For>
          </Cell.List>
        </Group.Container>
      </Group>
    </Group.List>
  )
}

interface Element extends HTMLAttributes<DynamicProps<"article">> {
  when: boolean
  locale?: string
  isPremium?: boolean
}
const Element: Component<Element> = (props) => {
  const [lang] = loc()
  const [local, others] = splitProps(props, ["when", "locale", "isPremium"])
  return (
    <Cell separator {...props}>
      <Cell.Before>
        <Switch
          fallback={
            <span
              style={{
                width: "20px",
                height: "20px",
                display: "block",
              }}
            />
          }
        >
          <Match when={local.when}>
            <IconCheck color={"var(--accent_color)"} width={20} height={20} />
          </Match>
        </Switch>
      </Cell.Before>
      <Cell.Container>
        <Cell.Content>
          <Title>{local.locale}</Title>
        </Cell.Content>
        <Show when={local.isPremium}>
          <Cell.After>
            <BadgePremium text={lang("premium")} />
          </Cell.After>
        </Show>
      </Cell.Container>
    </Cell>
  )
}

export default Content
