import { type JSX, type Component } from "solid-js"

import { ModalPanel } from "components"

import { backPage } from "router"
import { Content } from "./fragment"

interface Control extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Control: Component<Control> = (props) => {
  const handlerBack = () => {
    backPage(1)
  }

  return (
    <ModalPanel {...props} mode={"card"} onClick={handlerBack}>
      <Content />
    </ModalPanel>
  )
}

export default Control
