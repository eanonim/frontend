import { type JSX, type Component } from "solid-js"

import { ModalPanel } from "components"

import { backPage } from "router"
import { Content, Footer } from "./fragment"

interface Leave extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Leave: Component<Leave> = (props) => {
  const handlerBack = () => {
    backPage(1)
  }

  return (
    <ModalPanel {...props} mode={"card"} onClick={handlerBack}>
      <Content />
      <Footer />
    </ModalPanel>
  )
}

export default Leave
