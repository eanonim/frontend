import { type JSX, type Component, onMount } from "solid-js"

import { ModalPanel } from "components"
import { Content, Footer, Header } from "./fragment"

import { backPage } from "router"

interface Emoji extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Emoji: Component<Emoji> = (props) => {
  const handlerBack = () => {
    backPage(1)
  }

  return (
    <ModalPanel {...props} mode={"panel"} onClick={handlerBack}>
      <Header />
      <Content />
      <Footer />
    </ModalPanel>
  )
}

export default Emoji
