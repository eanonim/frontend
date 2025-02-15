import { type JSX, type Component } from "solid-js"

import { ModalPanel } from "components"
import { Content, Footer, Header } from "./fragment"

import { backPage } from "router"

interface List extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const List: Component<List> = (props) => {
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

export default List
