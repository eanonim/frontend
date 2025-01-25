import {
  type Component,
  type JSX,
  Match,
  mergeProps,
  Show as SolidShow,
  splitProps,
  Switch,
  ValidComponent,
} from "solid-js"
import { Dynamic, DynamicProps } from "solid-js/web"

interface Show<T extends ValidComponent>
  extends JSX.HTMLAttributes<DynamicProps<T>> {
  when?: JSX.Element | null | false
  keyed?: false
  fallback?: JSX.Element
  children?: JSX.Element
  component?: T
  native?: boolean
}

const Show = <T extends ValidComponent>(props: Show<T>) => {
  const merged = mergeProps(
    {
      component: "div",
      when: undefined,
      native: false,
    },
    props,
  )

  const [local, others] = splitProps(merged, [
    "native",
    "when",
    "keyed",
    "fallback",
    "children",
  ])

  return (
    <Switch
      fallback={
        <SolidShow
          keyed={local.keyed}
          fallback={local.fallback}
          children={local.children}
          when={local.when}
        />
      }
    >
      <Match when={!local.native}>
        <SolidShow
          fallback={local.fallback}
          keyed={true}
          when={local.when === undefined ? local.children : local.when}
        >
          {local.when === undefined
            ? (element) => <Dynamic {...others}>{element}</Dynamic>
            : local.children}
        </SolidShow>
      </Match>
    </Switch>
  )
}

export default Show
