import { type JSX, type Component, onMount } from "solid-js"

import { ModalPanel } from "components"
import { Header as PremiumHeader } from "./fragment"
import { Content, Footer, Header } from "app/pages/Profile/Premium/fragment"

import { backPage } from "router"

interface Premium extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Premium: Component<Premium> = (props) => {
  const handlerBack = () => {
    backPage(1)
  }

  return (
    <ModalPanel {...props} mode={"panel"} onClick={handlerBack}>
      <PremiumHeader />
      <Header />
      <Content />
      <Footer />
    </ModalPanel>
  )
}

export default Premium
