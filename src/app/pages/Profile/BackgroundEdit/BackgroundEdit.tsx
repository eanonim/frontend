import { Panel, usePlatform } from "components"

import { Content, Footer } from "./fragment"

import { type JSX, type Component } from "solid-js"

interface Backgrounds extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Backgrounds: Component<Backgrounds> = (props) => {
  const platform = usePlatform()

  return (
    <Panel
      safeTop={false}
      safeContentTop={false}
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
        <Content />
        <Footer />
      </div>
    </Panel>
  )
}

export default Backgrounds
