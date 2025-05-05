import { Button, Cell, Gap, Group, Plug, SubTitle, Title } from "components"

import { type JSX, type Component, For, Show, Switch, Match } from "solid-js"
import loc, { getLocale } from "engine/languages"
import { IconCoins, IconStack2Filled } from "source"
import { useAtom } from "engine/modules/smart-data"
import { PRODUCT_ATOM } from "engine/state"
import { paymentCoin } from "engine/api"
import {
  formatTime,
  getFullDate,
  isLockTime,
  timeAgo,
  timeAgoOnlyDate,
} from "engine"

interface Header extends JSX.HTMLAttributes<HTMLDivElement> {}

const Header: Component<Header> = (props) => {
  const [lang] = loc()

  const [product] = useAtom(PRODUCT_ATOM, () => ({
    lang: getLocale(),
    group: "premium" as "premium",
    currency: "COIN" as "COIN",
  }))

  const products = () => product.product

  const handlerCoin = (product_id?: string) => {
    const product = () => products()?.find((x) => x.item_id === product_id)

    paymentCoin({
      product: product()?.item_id || "",
    })
  }

  return (
    <Group>
      <Group.Container>
        <Cell.List>
          <For each={products()}>
            {(product, index) => (
              <Cell data-index={index()} separator={false}>
                <Cell.Container>
                  <Cell.Content>
                    <Title>{product.title}</Title>
                    <SubTitle>
                      <Switch
                        fallback={lang(
                          "unavailable",
                          formatTime(
                            product.user_lock || new Date(),
                            "DD.MM.YYYY",
                          ),
                        )}
                      >
                        <Match when={!isLockTime(product.user_lock)}>
                          <Gap justifyContent={"start"} count={"2px"}>
                            <Show when={product.discount}>
                              <span
                                style={{ "text-decoration": "line-through" }}
                              >
                                {(
                                  product.price * [2, 4, 12][index()]
                                ).toLocaleString("ru-RU", {
                                  minimumFractionDigits: 2, // Минимум 2 знака после запятой
                                  maximumFractionDigits: 9, // Максимум 9 знаков после запятой (стандарт TON)
                                })}
                              </span>{" "}
                            </Show>
                            <span>
                              {(
                                (product.price - product.discount) *
                                [2, 4, 12][index()]
                              ).toLocaleString("ru-RU", {
                                minimumFractionDigits: 2, // Минимум 2 знака после запятой
                                maximumFractionDigits: 9, // Максимум 9 знаков после запятой (стандарт TON)
                              })}
                            </span>{" "}
                            <IconCoins
                              width={12}
                              height={12}
                              color={"var(--accent_color)"}
                            />
                            {/* <span>{lang("per_year")}</span> */}
                          </Gap>
                        </Match>
                      </Switch>
                    </SubTitle>
                  </Cell.Content>
                  <Cell.After>
                    <Switch
                      fallback={
                        <Button
                          onClick={() => handlerCoin(product.item_id)}
                          size={"small"}
                        >
                          <Button.Container>
                            <Title>{lang("pay")}</Title>
                          </Button.Container>
                        </Button>
                      }
                    >
                      <Match when={isLockTime(product.user_lock)}>
                        <SubTitle nowrap overflow>
                          {lang("purchased")}
                        </SubTitle>
                      </Match>
                    </Switch>
                  </Cell.After>
                </Cell.Container>
              </Cell>
            )}
          </For>
        </Cell.List>
      </Group.Container>
      <Group.Container>
        <Plug>
          <Plug.Icon>
            <IconStack2Filled
              width={72}
              height={72}
              color={"var(--accent_color)"}
            />
          </Plug.Icon>
          <Plug.Container>
            <Title>{lang("task.title")}</Title>
            <SubTitle>{lang("task.subtitle")}</SubTitle>
          </Plug.Container>
        </Plug>
      </Group.Container>
    </Group>
  )
}

export default Header
