import { Panel, usePlatform } from "components"

import { Content, Footer, Header } from "./fragment"

import { type JSX, type Component, onMount } from "solid-js"
import { setHeaderColor } from "engine"

interface Default extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Default: Component<Default> = (props) => {
  onMount(() => {
    setHeaderColor({ type: "bg_color" })
  })

  const platform = usePlatform()

  return (
    <Panel
      {...props}
      onScroll={(e) => {
        e.target.scrollTop = 1
      }}
    >
      <div
        style={{
          position: "relative",
          "min-height": platform() === "iOS" ? "calc(100% + 1px)" : "100%",
          display: "flex",
          "flex-direction": "column",
        }}
      >
        <Header />
        <Content />
        <Footer />
      </div>
    </Panel>
  )
}

export default Default
