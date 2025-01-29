import style from "./Control.module.css"
import { Button } from "./addons"

import { type TypeFlex } from "@ui/index"
import Flex from "@ui/default/Blocks/Flex/Flex"

import { type Component, ValidComponent, splitProps } from "solid-js"
import ControlContext from "./context"

interface Control<T extends ValidComponent = "span"> extends TypeFlex<T> {
  safeBottom?: boolean
}

type ComponentControl = Component<Control> & {
  Button: typeof Button
}

const Control: ComponentControl = (props) => {
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
