import {
  Cell,
  Gap,
  Group,
  IconBackground,
  IconCheck,
  SubTitle,
  Title,
} from "components"

import {
  type JSX,
  type Component,
  For,
  Switch,
  Match,
  createSignal,
  Show,
  createEffect,
} from "solid-js"
import loc, { getLocale } from "engine/languages"
import {
  IconBrush,
  IconCoins,
  IconFilterUp,
  IconMessage2Search,
  IconPhotoFilled,
  IconTelegramStar,
} from "source"
import { useAtom } from "engine/modules/smart-data"
import { PRODUCT_ATOM } from "engine/state"
import { Socket } from "engine/api/module"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const backgrounds = [
  "linear-gradient(180deg, #E96C23 0%, #FF6619 100%)",
  "linear-gradient(180deg, #DA6031 0%, #EF583E 100%)",
  "linear-gradient(180deg, #E65127 0%, #E0412F 100%)",
  "linear-gradient(180deg, #EC4C35 0%, #EA4B3B 100%)",
  "linear-gradient(180deg, #E54D34 0%, #DE3E30 100%)",
  "linear-gradient(180deg, #DC3D45 0%, #E5443A 100%)",
]

const icons: Record<string, Component<JSX.SvgSVGAttributes<SVGSVGElement>>> = {
  IconFilterUp,
  IconMessage2Search,
  IconCoins,
  IconPhotoFilled,
  IconBrush,
}

const Content: Component<Content> = (props) => {
  const [selected, setSelected] = createSignal("")
  const [lang] = loc()

  const [product] = useAtom(PRODUCT_ATOM, {
    lang: getLocale(),
    group: "premium",
    currency: "XTR",
  })

  createEffect(() => {
    if (!selected()) {
      setSelected(product.product?.[0]?.item_id || "")
    }
  })

  const handlerSelect = (value: string) => {
    setSelected(value)
  }

  return (
    <>
      <Group>
        <Group.Container>
          <Cell.List>
            <For each={product.product}>
              {(product, index) => (
                <Cell
                  onClick={() => handlerSelect(product.item_id)}
                  data-index={index()}
                  separator
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
                      <Match when={selected() === product.item_id}>
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
                      <Title>{product.title}</Title>
                      <SubTitle>
                        <Gap justifyContent={"start"} count={"2px"}>
                          <Show when={product.discount}>
                            <span style={{ "text-decoration": "line-through" }}>
                              {product.price + product.discount}
                            </span>{" "}
                          </Show>
                          <span>
                            {(product.price * [1, 2, 4, 12][index()]).toFixed(
                              0,
                            )}
                          </span>{" "}
                          <IconTelegramStar width={12} height={12} />
                          <span>в год</span>
                        </Gap>
                      </SubTitle>
                    </Cell.Content>
                    <Cell.After>
                      <SubTitle nowrap overflow>
                        <Gap justifyContent={"start"} count={"2px"}>
                          <span>
                            {(product.price / [12, 6, 3, 1][index()]).toFixed(
                              2,
                            )}
                          </span>{" "}
                          <IconTelegramStar width={12} height={12} />
                          <span>/месяц</span>
                        </Gap>
                      </SubTitle>
                    </Cell.After>
                  </Cell.Container>
                </Cell>
              )}
            </For>
          </Cell.List>
        </Group.Container>
      </Group>
      <Group>
        <Group.Header mode={"primary"}>
          {lang("benefits_of_subscription")}
        </Group.Header>
        <Group.Container>
          <Cell.List>
            <For each={Object.values(lang("premiums") || {})}>
              {(premium, index) => (
                <Cell data-index={index()} separator>
                  <Cell.Before
                    alignItems={"start"}
                    style={{
                      "margin-top": "4px",
                    }}
                  >
                    <IconBackground
                      padding={"4px"}
                      border-radius={"8px"}
                      color={"var(--accent_color)"}
                      style={{
                        background: backgrounds[index()],
                      }}
                    >
                      {icons[premium.icon_type]?.({
                        width: 20,
                        height: 20,
                        color: "white",
                      })}
                    </IconBackground>
                  </Cell.Before>
                  <Cell.Container>
                    <Cell.Content>
                      <Title>{premium.title}</Title>
                      <SubTitle>{premium.subtitle}</SubTitle>
                    </Cell.Content>
                  </Cell.Container>
                </Cell>
              )}
            </For>
          </Cell.List>
        </Group.Container>
      </Group>
    </>
  )
}

export default Content
