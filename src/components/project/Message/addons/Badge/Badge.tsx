import style from "./Badge.module.css"

import IconCheck from "source/Check.svg"
import IconChecks from "source/Checks.svg"

import {
  type JSX,
  type Component,
  Switch,
  Match,
  splitProps,
  mergeProps,
} from "solid-js"
import Spinner from "@component/default/Blocks/Spinner/Spinner"

interface Badge extends JSX.HTMLAttributes<HTMLElement> {
  /** Отображает бейдж как прочитанный */
  isRead?: boolean
  /** Отображает бейдж как НЕ прочитанный */
  isNotRead?: boolean
  /** Отображает бейдж как новый */
  isNew?: boolean
  /** Отображать спинер */
  isLoading?: boolean
  /** Цвет иконки */
  color?: string
  /** Размеры */
  size?: number | "inherit"
}

const Badge: Component<Badge> = (props) => {
  const merged = mergeProps({ color: "var(--accent_color)", size: 16 }, props)
  const [local, others] = splitProps(merged, [
    "isRead",
    "isNotRead",
    "isNew",
    "isLoading",
    "color",
    "size",
  ])

  return (
    <span {...others}>
      <Switch>
        <Match when={local.isLoading}>
          <Spinner
            class={style.Badge__spinner}
            style={{
              width:
                typeof local.size === "number" ? local.size + "px" : local.size,
              height:
                typeof local.size === "number" ? local.size + "px" : local.size,
              color: local.color,
            }}
          />
        </Match>
        <Match when={local.isNew}>
          <span class={style.Badge__new} />
        </Match>
        <Match when={local.isRead}>
          <IconChecks
            width={local.size}
            height={local.size}
            color={local.color}
          />
        </Match>
        <Match when={local.isNotRead}>
          <IconCheck
            width={local.size}
            height={local.size}
            color={local.color}
          />
        </Match>
      </Switch>
    </span>
  )
}

export default Badge
