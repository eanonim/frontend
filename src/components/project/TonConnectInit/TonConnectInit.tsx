import {
  Accessor,
  Component,
  Suspense,
  lazy,
  mergeProps,
  splitProps,
} from "solid-js"
import { JSX } from "solid-js/jsx-runtime"

import { type ConnectedWallet, type TonConnectUI } from "@tonconnect/ui"
import { type CustomAccount } from "./elements/TonConnectUIElement/TonConnectUIElement"
import { Locale } from "engine/languages"

const TonConnectUIElement = lazy(
  () => import("./elements/TonConnectUIElement/TonConnectUIElement"),
)
interface TonConnectInit
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> {
  language: Locale
  children: (
    tonConnectUI: TonConnectUI | undefined,
    account: CustomAccount | null,
    walletInfo: Accessor<ConnectedWallet | null>,
  ) => JSX.Element
  fallback: JSX.Element
}

const TonConnectInit: Component<TonConnectInit> = (props) => {
  const merged = mergeProps({}, props)

  const [local, others] = splitProps(merged, ["class", "classList", "fallback"])

  return (
    <Suspense fallback={local.fallback}>
      <TonConnectUIElement fallback={local.fallback} {...others} />
    </Suspense>
  )
}

export default TonConnectInit
