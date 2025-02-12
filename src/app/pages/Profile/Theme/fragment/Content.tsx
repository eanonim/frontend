import { Cell, Group, HTMLAttributes, IconCheck, Title } from "components"

import {
  type JSX,
  type Component,
  For,
  Switch,
  Match,
  splitProps,
  createEffect,
} from "solid-js"
import { SETTINGS_ATOM, STORE_OPTIONS_ATOM, USER_ATOM } from "engine/state"
import { useAtom } from "engine/modules/smart-data"
import { Socket, StoreOptions } from "engine/api/module"
import loc from "engine/languages"
import { setTheme, setThemeColor } from "engine/state/settings"
import { DynamicProps } from "solid-js/web"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const [settings] = useAtom(SETTINGS_ATOM)
  const [options] = useAtom(STORE_OPTIONS_ATOM, {
    key: StoreOptions.themeColor,
  })
  const [user] = useAtom(USER_ATOM)

  const handlerSet = (theme: Socket["store.list"]["response"]["theme"]) => {
    setTheme(theme)
  }

  const handlerSetColor = (
    themeColor: Socket["store.list"]["response"]["themeColor"],
  ) => {
    const isPremium =
      options.find((x) => x.value === themeColor)?.is_premium ?? false
    if (isPremium !== user.premium) return

    setThemeColor(themeColor)
  }

  return (
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
              />
            )}
          </For>
        </Cell.List>
      </Group.Container>
    </Group>
  )
}

interface Element extends HTMLAttributes<DynamicProps<"article">> {
  when: boolean
  locale?: string
}
const Element: Component<Element> = (props) => {
  const [local, others] = splitProps(props, ["when", "locale"])
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
      </Cell.Container>
    </Cell>
  )
}

export default Content
