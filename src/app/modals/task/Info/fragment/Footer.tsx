import { Button, Title, TonConnectInit } from "@component/index"
import { CustomAccount } from "@component/project/TonConnectInit/elements/TonConnectUIElement/TonConnectUIElement"
import { TonConnectUI } from "@tonconnect/ui"
import {
  paymentCrypto,
  productGet,
  taskCheck,
  taskExecute,
  taskIntegration,
  taskList,
} from "engine/api"
import handlerError from "engine/api/handlerError"
import loc, { getLocale } from "engine/languages"
import { useAtom } from "engine/modules/smart-data"
import { TASK_ATOM } from "engine/state"
import { modals, useParams } from "router"
import { routerParams } from "router/routerStruct"
import {
  type JSX,
  type Component,
  createMemo,
  Show,
  Switch,
  Match,
} from "solid-js"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()
  const params = useParams<routerParams[modals.MODAL_TASK]>({
    modalId: modals.MODAL_TASK,
  })

  const [tasks] = useAtom(TASK_ATOM, {
    lang: getLocale(),
    group: params().group,
  })

  const task = createMemo(() => {
    for (const items of tasks?.tasks || []) {
      for (const task of items) {
        if (task.id === params().task_id) {
          return task
        }
      }
    }
  })

  const handlerTransaction = async (
    connect: TonConnectUI | undefined,
    account: CustomAccount | null,
  ) => {
    const wallet = account?.friendly_address
    if (!connect?.account || !wallet) {
      connect?.openModal()
      return
    }
    const regexp = Array.from(
      (task()?.type || "")?.matchAll(/transaction_([A-z]+)_([0-9.]+)/gm),
    )

    const [currency, _amount] = [regexp?.[0]?.[1] as any, regexp?.[0]?.[2]]

    if (!currency || !_amount) {
      return
    }

    const amount = Number(_amount) * 1_000_000_000

    const group = currency === "ton" ? "ton" : "jetton"
    const { response, error } = await productGet({
      lang: getLocale(),
      group: group,
      currency: currency.toUpperCase(),
    })

    if (error) {
      handlerError(error)
      return
    }

    let product = response[group].product?.find(
      (x) => x.item_id === `${currency}_${_amount}`,
    )

    if (!product) {
      product = response[group].product?.find((x) => x.price === amount)
    }

    if (product) {
      const { response, error } = await paymentCrypto({
        product: product.item_id,
        currency,
        wallet,
      })

      if (error) {
        handlerError(error)
        return
      }

      connect.sendTransaction(
        {
          validUntil: Math.floor(Date.now() / 1000) + 600,
          messages: [response],
        },
        {
          modals: "all",
          notifications: "all",
        },
      )
    }
  }

  const handlerComplete = () => {
    const item = task()
    if (!item) return

    if (
      [
        "link",
        "sub",
        "boost",
        "wallet",
        "wallet_okx",
        "app",
        "integration",
      ].indexOf(item.action) !== -1
    ) {
      taskCheck({
        lang: getLocale(),
        group: params().group,
        task: item.id,
        action: item.action,
      })
    } else {
      // const actions: { [key: string]: () => void } = {
      //   invited_friends: () => pushPage({ pageId: pages.INVITE }),
      //   game_spin_roulette: () => pushPage({ pageId: pages.ROULETTE }),
      //   game_king_buy: () => pushPage({ pageId: pages.RATING }),
      //   rating_order_buy: () =>
      //     pushModal({
      //       modalId: modals.STORE_MONEY,
      //       params: { group: "currency" },
      //     }),
      //   ticket_getting: () =>
      //     pushModal({
      //       modalId: modals.STORE_MONEY,
      //       params: { group: "ticket" },
      //     }),
      // }
      // const action = actions[item.type]
      // if (!!action) action()
    }

    // if (item.action === "ads") {
    //   pushPage({
    //     pageId: pages.ADS,
    //     params: { type: "tasks", item: "free_rating_for_ads" },
    //   })
    //   return
    // }

    if (item.order) {
      handlerExecute()
    }
  }

  const handlerExecute = async () => {
    const item = task()
    if (!item) return

    if (item.action === "integration" && !item.order) {
      await taskIntegration({ task: item.id })
    }

    // // Обновляем список заданий
    // await taskList({
    //   lang: getLocale(),
    //   group: params().group,
    // })

    taskExecute({
      lang: getLocale(),
      group: params().group,
      order: item.order,
    })
  }

  const handlerWallet = (connect: TonConnectUI | undefined) => {
    if (!connect?.account) {
      connect?.openModal()
      return
    }

    handlerComplete()
  }

  return (
    <Show keyed when={task()}>
      {(task) => (
        <Switch>
          {/* Кнопки для Ton Connect */}
          <Match
            when={task.action === "wallet" || task.action === "transaction"}
          >
            <Button.Group>
              <Button.Group.Container>
                <Button stretched size={"large"} mode={"outline"}>
                  <Button.Container>
                    <Title>{lang(`task_type.${task.action}.check`)}</Title>
                  </Button.Container>
                </Button>
                <TonConnectInit
                  language={"en"}
                  fallback={
                    <Button stretched size={"large"} loading>
                      <Button.Container>
                        <Title>
                          {lang(`task_type.${task.action}.complete`)}
                        </Title>
                      </Button.Container>
                    </Button>
                  }
                >
                  {(connect, account, wallet) => (
                    <Button
                      stretched
                      size={"large"}
                      onClick={() => {
                        if (task.action === "wallet") {
                          handlerWallet(connect)
                        } else if (task.action === "transaction") {
                          handlerTransaction(connect, account)
                        }
                      }}
                    >
                      <Button.Container>
                        <Title>
                          {lang(`task_type.${task.action}.complete`)}
                        </Title>
                      </Button.Container>
                    </Button>
                  )}
                </TonConnectInit>
              </Button.Group.Container>
            </Button.Group>
          </Match>

          {/* Если задание выполнено */}
          <Match when={task.status === "CLOSE"}>
            <Button.Group>
              <Button.Group.Container>
                <Button
                  stretched
                  size={"large"}
                  mode={"transparent"}
                  appearance={"secondary"}
                >
                  <Button.Container>
                    <Title>{lang("task_completed")}</Title>
                  </Button.Container>
                </Button>
              </Button.Group.Container>
            </Button.Group>
          </Match>

          {/* Стандартные кнопки */}
          <Match when={true}>
            <Button.Group>
              <Button.Group.Container>
                <Button stretched size={"large"} mode={"outline"}>
                  <Button.Container>
                    <Title>{lang(`task_type.${task.action}.check`)}</Title>
                  </Button.Container>
                </Button>
                <Button stretched size={"large"}>
                  <Button.Container>
                    <Title>{lang(`task_type.${task.action}.complete`)}</Title>
                  </Button.Container>
                </Button>
              </Button.Group.Container>
            </Button.Group>
          </Match>
        </Switch>
      )}
    </Show>
  )
}

export default Footer
