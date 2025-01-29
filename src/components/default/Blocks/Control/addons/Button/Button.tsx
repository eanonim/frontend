import { generateTypography } from "@ui/default/Blocks/Button/styles"

import style from "./Button.module.css"

import Events from "@component/default/Templates/Events/Events"
import TextContext from "@ui/default/Templates/Text/context"

import {
  type JSX,
  type Component,
  mergeProps,
  splitProps,
  useContext,
} from "solid-js"
import { type DynamicProps } from "solid-js/web"
import ControlContext from "../../context"

interface Button extends JSX.HTMLAttributes<DynamicProps<"button">> {}

const Button: Component<Button> = (props) => {
  const context = useContext(ControlContext)

  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <TextContext.Provider
      value={generateTypography({
        title: {
          class: style[`Button__title`],
        },
        subTitle: {
          class: style[`Button__subtitle`],
        },
      })}
    >
      <Events
        component={"button"}
        class={style.Button}
        classList={{
          [style.Button__safeBottom]: context?.safeBottom,

          [`${local.class}`]: !!local.class,
          ...local.classList,
        }}
        {...others}
      >
        {local.children}
      </Events>
    </TextContext.Provider>
  )
}

export default Button
