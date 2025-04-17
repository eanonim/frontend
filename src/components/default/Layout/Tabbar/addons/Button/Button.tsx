import { styles, generateTypography } from "./styles"

import { Events, type Platform, type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"
import GapContext from "@ui/default/Templates/Gap/context"
import TextContext from "@ui/default/Templates/Text/context"
import useStyle from "@ui/default/utils/useStyle"

import {
  type Component,
  type ValidComponent,
  mergeProps,
  splitProps,
} from "solid-js"

interface Button<T extends ValidComponent = "div"> extends TypeFlex<T> {
  platform?: Platform
  selected?: boolean
}

const Button: Component<Button> = (props) => {
  const style = useStyle(styles, props.platform)
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "selected",
    "onClick",
  ])

  return (
    <GapContext.Provider value={{ count: "2px" }}>
      <TextContext.Provider
        value={generateTypography({
          title: {
            class: style[`Button__title`],
          },
        })}
      >
        <Events
          onClick={local.onClick}
          class={style.Button}
          classList={{
            [style[`Button--selected`]]: !!local.selected,

            [`${local.class}`]: !!local.class,
            ...local.classList,
          }}
        >
          <Flex width={"100%"} {...others}>
            {local.children}
          </Flex>
        </Events>
      </TextContext.Provider>
    </GapContext.Provider>
  )
}

export default Button
