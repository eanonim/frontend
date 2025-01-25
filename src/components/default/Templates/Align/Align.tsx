import style from "./Align.module.css"
import { Before, Children, After } from "./addons"

import Flex from "@ui/default/Blocks/Flex/Flex"

import { type JSX, mergeProps, splitProps, ValidComponent } from "solid-js"
import { DynamicProps } from "solid-js/web"

interface Align<T extends ValidComponent>
  extends JSX.HTMLAttributes<DynamicProps<T>> {
  /**
   * Компонент, который будет использоваться для рендеринга Flexbox.
   * По умолчанию используется `span`.
   */
  component?: T
}

const Align = <T extends ValidComponent>(props: Align<T>): JSX.Element => {
  const merged = mergeProps({ component: "span" }, props) as Align<T>
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      direction={"row"}
      class={style.Align}
      classList={{
        ...local.classList,
        [`${local.class}`]: !!local.class,
      }}
      {...others}
    >
      {local.children}
    </Flex>
  )
}

Align.Before = Before
Align.Children = Children
Align.After = After

export default Align
