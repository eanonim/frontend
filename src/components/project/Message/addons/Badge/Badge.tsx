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

interface Badge extends JSX.HTMLAttributes<HTMLElement> {
  /** Отображает бейдж как прочитанный */
  isRead?: boolean
  /** Отображает бейдж как НЕ прочитанный */
  isNotRead?: boolean
  /** Отображает бейдж как новый */
  isNew?: boolean
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
    "color",
    "size",
  ])

  return (
    <span {...others}>
      <Switch>
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
