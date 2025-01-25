import style from "./Tabbar.module.css"
import { Button } from "./addons"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"

import {
  type JSX,
  type Component,
  type ValidComponent,
  mergeProps,
  splitProps,
} from "solid-js"

interface Tabbar<T extends ValidComponent = "div"> extends TypeFlex<T> {}

type ComponentTabbar = Component<Tabbar> & {
  Button: typeof Button
}

const Tabbar: ComponentTabbar = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <Flex
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
