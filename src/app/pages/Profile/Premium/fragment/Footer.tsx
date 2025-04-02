import { CustomAccount } from "@component/project/TonConnectInit/elements/TonConnectUIElement/TonConnectUIElement"
import { TonConnectUI } from "@tonconnect/ui"
import { Button, FixedLayout, Title, TonConnectInit } from "components"
import { paymentCrypto } from "engine/api"
import handlerError from "engine/api/handlerError"
import loc, { getLocale } from "engine/languages"
import { useAtom } from "engine/modules/smart-data"
import { PRODUCT_ATOM } from "engine/state"
import { pages, useParams } from "router"

import {
  type JSX,
  type Component,
  createSignal,
  For,
  Switch,
  Match,
} from "solid-js"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()
  const params = useParams<{
    product_id: string
    currency: "TON" | "XTR"
  }>({ pageId: pages.PREMIUM })

  const [products] = useAtom(PRODUCT_ATOM, () => ({
    lang: getLocale(),
    group: "premium" as "premium",
    currency: params().currency,
  }))

  const product = () =>
    products?.product?.find((x) => x.item_id === params().product_id)

  const handlerTransaction = async (
    connect: TonConnectUI | undefined,
    account: CustomAccount | null,
  ) => {
    // start(KEYS.TASK_CHECK(Number(params().task_id)), 200)
    const wallet = account?.friendly_address
    if (!connect?.account && !wallet) {
      connect?.openModal()
      // end(KEYS.TASK_CHECK(Number(params().task_id)))
      return
    }

    if (!!connect?.account && !!wallet) {
      const { response, error } = await paymentCrypto({
        product: product()?.item_id || "",
        currency: "TON",
        wallet,
      })

      if (response) {
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

      //  shopCrypto(
      //    { product: product?.item_id, currency:"TON", wallet },
      //    (response) => {
      //      // end(KEYS.TASK_CHECK(Number(params().task_id)))
      //      connect.sendTransaction(
      //        {
      //          validUntil: Math.floor(Date.now() / 1000) + 600,
      //          messages: [response],
      //        },
      //        {
      //          modals: "all",
      //          notifications: "all",
      //        },
      //      )
      //    },
      //    (error) => {
      //      handlerError(error)
      //     //  end(KEYS.TASK_CHECK(Number(params().task_id)), {
      //     //    custom: error,
      //     //  })
      //    },
      //  )

      // pushPage({ modalId: MODAL_WALLET_INFO })
      return
    }
  }

  return (
    <FixedLayout safe background={"section_bg_color"} position={"bottom"}>
      <Switch>
        <Match when={params().currency === "XTR"}>
          <Button.Group>
            <Button.Group.Container>
              <Button href={product()?.link} size={"large"} stretched>
                <Button.Container>
                  <Title>{lang("pay")}</Title>
                </Button.Container>
              </Button>
            </Button.Group.Container>
          </Button.Group>
        </Match>
        <Match when={params().currency === "TON"}>
          <TonConnectInit
            language={getLocale()}
            fallback={
              <Button.Group>
                <Button.Group.Container>
                  <Button size={"large"} stretched loading>
                    <Button.Container>
                      <Title>{lang("pay")}</Title>
                    </Button.Container>
                  </Button>
                </Button.Group.Container>
              </Button.Group>
            }
          >
            {(connect, account, wallet) => (
              <Button.Group
                onClick={() => handlerTransaction(connect, account)}
              >
                <Button.Group.Container>
                  <Button size={"large"} stretched>
                    <Button.Container>
                      <Title>{lang("pay")}</Title>
                    </Button.Container>
                  </Button>
                </Button.Group.Container>
              </Button.Group>
            )}
          </TonConnectInit>
        </Match>
      </Switch>
    </FixedLayout>
  )
}

export default Footer
