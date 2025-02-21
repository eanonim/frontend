import { Panel } from "components"

import { Content, Footer } from "./fragment"

import { type JSX, type Component } from "solid-js"

interface Backgrounds extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Backgrounds: Component<Backgrounds> = (props) => {
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
          "min-height": "calc(100% + 1px)",
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
