import { Cell, Group, Plug, SubTitle, Title } from "components"
import { IconCheck, Logo, LogoElumTeam } from "source"

import {
  type JSX,
  type Component,
  For,
  Switch,
  Match,
  createEffect,
} from "solid-js"
import loc, { locByCode, swap } from "engine/languages"
import { setter } from "engine/modules/smart-data"
import { SETTINGS_ATOM } from "engine/state"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [langByCode] = locByCode()
  const [lang, getLocale] = loc()

  return (
    <Group.List>
      <Group>
        <Group.Container>
          <Cell.List>
            <For each={Object.keys(lang("languages") as any) as "ru"[]}>
              {(locale, index) => (
                <Cell
                  data-index={index()}
                  separator
                  onClick={() => {
                    setter(SETTINGS_ATOM, "language", locale)
                    swap(locale)
                  }}
                >
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
                      <Match when={locale === getLocale()}>
                        <IconCheck
                          color={"var(--accent_color)"}
                          width={20}
                          height={20}
                        />
                      </Match>
                    </Switch>
                  </Cell.Before>
                  <Cell.Container>
                    <Cell.Content>
                      <Title>{lang(`languages.${locale}`)}</Title>
                      <SubTitle>
                        {langByCode(locale, `languages.${locale}`)}
                      </SubTitle>
                    </Cell.Content>
                  </Cell.Container>
                </Cell>
              )}
            </For>
          </Cell.List>
        </Group.Container>
      </Group>
    </Group.List>
  )
}

export default Content
