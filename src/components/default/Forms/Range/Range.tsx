import style from "./Range.module.css"
import { Input, Icon } from "./addons"

import { type TypeFlex } from "@ui/index"
import Gap from "@ui/default/Templates/Gap/Gap"

import { type ValidComponent, type Component, splitProps } from "solid-js"

interface Range<T extends ValidComponent = "span"> extends TypeFlex<T> {}

type ComponentRange = Component<Range> & {
  Input: typeof Input
  Icon: typeof Icon
}

const Range: ComponentRange = (props) => {
  const [local, others] = splitProps(props, ["class", "classList", "children"])

  return (
    <Gap
      class={style.Range}
      classList={{
        ...local.classList,
        [`${local.class}`]: !!local.class,
      }}
      width={"100%"}
      count={"12px"}
      {...others}
    >
      {local.children}
    </Gap>
  )
}

Range.Input = Input
Range.Icon = Icon

export default Range
