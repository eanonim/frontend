import { type JSX, type Component, onMount } from "solid-js"

import { ModalPanel } from "components"
import { Content, Footer, Header } from "./fragment"

import { backPage } from "router"

interface Language extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Language: Component<Language> = (props) => {
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

export default Language
