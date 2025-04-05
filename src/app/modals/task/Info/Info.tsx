import { type JSX, type Component, onMount } from "solid-js"

import { ModalPanel } from "components"
import { Content, Footer } from "./fragment"

import { backPage } from "router"

interface Info extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Info: Component<Info> = (props) => {
  const handlerBack = () => {
    backPage(1)
  }

  return (
    <ModalPanel {...props} mode={"panel"} onClick={handlerBack}>
      <Content />
      <Footer />
    </ModalPanel>
  )
}

export default Info
