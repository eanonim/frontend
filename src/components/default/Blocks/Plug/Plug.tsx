import { styles, generateTypography } from "./styles"

import { type HTMLAttributes } from "@ui/Types"
import useStyle from "@ui/default/utils/useStyle"
import Flex from "@ui/default/Blocks/Flex/Flex"
import TextContext from "@ui/default/Templates/Text/context"

import { Action, Container, Icon } from "./addons"

import { type Component, splitProps, mergeProps } from "solid-js"
import { type DynamicProps } from "solid-js/web"

interface Plug extends Omit<HTMLAttributes<DynamicProps<"div">>, "title"> {
  /**
   * Определяет, должен ли элемент отображаться в полноэкранном режиме.
   */
  full?: boolean
}

type ComponentPlug = Component<Plug> & {
  Container: typeof Container
  Action: typeof Action
  Icon: typeof Icon
}

const Plug: ComponentPlug = (props) => {
  const style = useStyle(styles, props.platform)
  const merged = mergeProps({ mode: "bottom" }, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "full",
  ])

  return (
    <TextContext.Provider
      value={generateTypography({
        title: {
          class: style["Plug__title"],
        },
        subTitle: {
          class: style["Plug__subtitle"],
        },
      })}
    >
      <Flex
        component={"div"}
        class={style.Plug}
        classList={{
          [`${local.class}`]: !!local.class,
          ...local.classList,

          [style[`Plug--full`]]: local.full,
        }}
        direction={"column"}
        justifyContent={"center"}
        {...others}
      >
        {local.children}
      </Flex>
    </TextContext.Provider>
  )
}

Plug.Container = Container
Plug.Action = Action
Plug.Icon = Icon

export default Plug
