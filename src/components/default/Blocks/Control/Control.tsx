import { styles } from "./styles"
import { Button } from "./addons"

import { type Platform, type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"
import useStyle from "@ui/default/utils/useStyle"

import { type Component, ValidComponent, splitProps } from "solid-js"
import ControlContext from "./context"

interface Control<T extends ValidComponent = "span"> extends TypeFlex<T> {
  safeBottom?: boolean

  platform?: Platform
}

type ComponentControl = Component<Control> & {
  Button: typeof Button
}

const Control: ComponentControl = (props) => {
  const style = useStyle(styles, props.platform)
  const [local, others] = splitProps(props, ["children", "safeBottom"])
  return (
    <Flex {...others} width={"100%"} class={style.Control}>
      <ControlContext.Provider value={{ safeBottom: local.safeBottom }}>
        {local.children}
      </ControlContext.Provider>
    </Flex>
  )
}

Control.Button = Button

export default Control
