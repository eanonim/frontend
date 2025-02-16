import style from "./Tabbar.module.css"
import { Button } from "./addons"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"

import {
  type Component,
  type ValidComponent,
  mergeProps,
  splitProps,
  onMount,
  createEffect,
  onCleanup,
} from "solid-js"
import { type DynamicProps } from "solid-js/web"

interface Tabbar<T extends ValidComponent = "div"> extends TypeFlex<T> {}

type ComponentTabbar = Component<Tabbar> & {
  Button: typeof Button
}

const Tabbar: ComponentTabbar = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  let ref: HTMLDivElement

  onMount(() => {
    const height = ref!?.clientHeight
    if (height) {
      document.body.style.setProperty("--tabbar_height", `${height}px`)
    }
    onCleanup(() => {
      document.body.style.setProperty("--tabbar_height", `0px`)
    })
  })

  return (
    <Flex
      ref={ref! as unknown as DynamicProps<"div">}
      class={style.Tabbar}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      width={"100%"}
      {...others}
    >
      {local.children}
    </Flex>
  )
}
Tabbar.Button = Button

export default Tabbar
