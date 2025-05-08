import { Mutex } from "@minsize/mutex"
import {
  Account,
  ConnectedWallet,
  TonConnectUI,
  toUserFriendlyAddress,
} from "@tonconnect/ui"
import { atom, globalSignal } from "elum-state/solid"
import { Locale } from "engine/languages"
import { HOST } from "root/configs"

import {
  onMount,
  JSX,
  Component,
  mergeProps,
  splitProps,
  createSignal,
  Accessor,
  Show,
  createEffect,
} from "solid-js"

const colors = {
  icon: {
    primary: "var(--accent_text_color)",
    secondary: "var(--hint_color)",
  },
  text: {
    primary: "var(--text_color)",
    secondary: "var(--hint_color)",
  },
  background: {
    primary: "var(--section_bg_color)",
    tint: "var(--secondary_bg_color)",
  },
}

interface TonConnectUIElement
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> {
  language: Locale
  children: (
    tonConnectUI: TonConnectUI | undefined,
    account: CustomAccount | null,
    walletInfo: Accessor<ConnectedWallet | null>,
  ) => JSX.Element
  fallback: JSX.Element
}

export type CustomAccount = Account & {
  friendly_address: string
}

const TON_ATOM = atom<{
  ton: TonConnectUI | undefined
  account: CustomAccount | null
  wallet: ConnectedWallet | null
}>({
  key: "ton_atom",
  default: {
    ton: undefined,
    account: null,
    wallet: null,
  },
})

const mutex = Mutex({ globalLimit: 1 })

const TonConnectUIElement: Component<TonConnectUIElement> = (props) => {
  const [tonConnectUI, setTonConnectUI] = globalSignal(TON_ATOM)
  // const [tonConnectUI, setTonConnectUI] = createStoreCache<{
  //   ton: TonConnectUI | undefined
  // }>({ ton: undefined }, "tonConnectUI_1")
  const [isLoading, setLoading] = createSignal(true)

  const merged = mergeProps(
    {
      language: "en",
      streched: false,
    },
    props,
  )

  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "streched",
    "language",
    "fallback",
  ])

  createEffect(() => {
    console.log({ f: { ...tonConnectUI() } })
  })

  const handlerInit = async () => {
    const relase = await mutex.wait()
    try {
      const _language =
        local.language === "en" || local.language === "ru"
          ? local.language
          : "en"

      const updateWalletInfo = (tonConnect: TonConnectUI) => {
        setTonConnectUI((e) => ({
          ...e,
          ...{
            wallet: (tonConnect as any).walletInfo,
            account: tonConnect.account
              ? {
                  ...tonConnect.account,
                  friendly_address: toUserFriendlyAddress(
                    tonConnect.account.address,
                  ),
                }
              : null,
          },
        }))
      }

      const initializeTonConnect = async () => {
        if (!tonConnectUI().ton) {
          const tonConnect = new TonConnectUI({
            // manifestUrl: HOST + "/v1/manifest.get",
            manifestUrl: "/manifest.json",
            language: _language,
            uiPreferences: {
              theme: "SYSTEM",
              // colorsSet: {
              //   DARK: colors,
              //   LIGHT: colors,
              // },
            },
          })

          const handleTonConnectStateChange = () => {
            setTonConnectUI((e) => ({
              ...e,
              ...{
                account: tonConnect.account
                  ? {
                      ...tonConnect.account,
                      friendly_address: toUserFriendlyAddress(
                        tonConnect.account.address,
                      ),
                    }
                  : null,
              },
            }))
          }

          tonConnect.onModalStateChange(handleTonConnectStateChange)
          tonConnect.onStatusChange((e) => {
            updateWalletInfo(tonConnect)
            if (!e) {
              setTonConnectUI((e) => ({
                ...e,
                ...{
                  wallet: null,
                  account: null,
                },
              }))
            }
          })

          setTonConnectUI((e) => ({ ...e, ...{ ton: tonConnect } }))
        }
      }

      initializeTonConnect()
      ;(async () => {
        await tonConnectUI()?.ton?.getWallets()
        setLoading(false)
      })()

      const ton = tonConnectUI()?.ton
      if (ton?.account) {
        updateWalletInfo(ton)
      }
    } finally {
      relase()
    }
  }

  onMount(() => {
    handlerInit()
  })

  return (
    <>
      <Show when={isLoading()}>{local.fallback}</Show>
      <Show when={!isLoading()}>
        {local.children(
          tonConnectUI()?.ton,
          tonConnectUI()?.account,
          () => tonConnectUI().wallet,
        )}
      </Show>
    </>
  )
}

export default TonConnectUIElement
