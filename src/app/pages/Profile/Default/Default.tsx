import { Panel } from "components"

import { Content, Footer, Header } from "./fragment"

import { type JSX, type Component } from "solid-js"
import { useHeaderColor } from "engine"

interface Default extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Default: Component<Default> = (props) => {
  useHeaderColor({ iOS: "bg_color", android: "section_bg_color" })

  return (
    <Panel {...props} safeContentTop={false} safeTop={false}>
      <Header />
      <Content />
      <Footer />
    </Panel>
  )
}

export default Default
