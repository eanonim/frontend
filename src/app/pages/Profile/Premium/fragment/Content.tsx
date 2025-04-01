import {
  Cell,
  Gap,
  Group,
  IconBackground,
  IconCheck,
  SegmentedControl,
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
  IconTON,
} from "source"
import { useAtom } from "engine/modules/smart-data"
import { PRODUCT_ATOM } from "engine/state"

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
  const [selectedPrice, setSelectedPrice] = createSignal<"XTR" | "TON">("XTR")
  const [selected, setSelected] = createSignal("")
  const [lang] = loc()

  const [product] = useAtom(PRODUCT_ATOM, () => ({
    lang: getLocale(),
    group: "premium" as "premium",
    currency: selectedPrice(),
  }))

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
                              {(selectedPrice() === "TON"
                                ? (product.price + product.discount) /
                                  1_000_000_000
                                : product.price + product.discount
                              ).toLocaleString("ru-RU", {
                                minimumFractionDigits: 2, // Минимум 2 знака после запятой
                                maximumFractionDigits: 9, // Максимум 9 знаков после запятой (стандарт TON)
                              })}
                            </span>{" "}
                          </Show>
                          <span>
                            {(selectedPrice() === "TON"
                              ? (product.price * [1, 2, 4, 12][index()]) /
                                1_000_000_000
                              : product.price * [1, 2, 4, 12][index()]
                            ).toLocaleString("ru-RU", {
                              minimumFractionDigits: 2, // Минимум 2 знака после запятой
                              maximumFractionDigits: 9, // Максимум 9 знаков после запятой (стандарт TON)
                            })}
                          </span>{" "}
                          <Switch>
                            <Match when={selectedPrice() === "TON"}>
                              <IconTON width={12} height={12} />
                            </Match>
                            <Match when={selectedPrice() === "XTR"}>
                              <IconTelegramStar width={12} height={12} />
                            </Match>
                          </Switch>
                          <span>{lang("per_year")}</span>
                        </Gap>
                      </SubTitle>
                    </Cell.Content>
                    <Cell.After>
                      <SubTitle nowrap overflow>
                        <Gap justifyContent={"start"} count={"2px"}>
                          <span>
                            {(selectedPrice() === "TON"
                              ? product.price /
                                [12, 6, 3, 1][index()] /
                                1_000_000_000
                              : product.price / [12, 6, 3, 1][index()]
                            ).toLocaleString("ru-RU", {
                              minimumFractionDigits: 0, // Минимум 2 знака после запятой
                              maximumFractionDigits: 3, // Максимум 9 знаков после запятой (стандарт TON)
                            })}
                          </span>{" "}
                          <Switch>
                            <Match when={selectedPrice() === "TON"}>
                              <IconTON width={12} height={12} />
                            </Match>
                            <Match when={selectedPrice() === "XTR"}>
                              <IconTelegramStar width={12} height={12} />
                            </Match>
                          </Switch>
                          <span>/{lang("month")}</span>
                        </Gap>
                      </SubTitle>
                    </Cell.After>
                  </Cell.Container>
                </Cell>
              )}
            </For>
          </Cell.List>
        </Group.Container>
        <Group.Container>
          <SegmentedControl
            selected={selectedPrice()}
            onSelected={(key) => setSelectedPrice(key as "XTR" | "TON")}
          >
            <For each={["XTR", "TON"]}>
              {(type, index) => (
                <SegmentedControl.Button
                  data-index={index()}
                  stretched
                  key={type}
                >
                  <SegmentedControl.Button.Container>
                    <Title>{lang(type as "XTR" | "TON")}</Title>
                  </SegmentedControl.Button.Container>
                </SegmentedControl.Button>
              )}
            </For>
          </SegmentedControl>
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
