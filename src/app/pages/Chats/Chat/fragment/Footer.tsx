import { FixedLayout, Separator, WriteBar } from "components"
import { IconChecks, Logo, LogoElumTeam } from "source"

import { type JSX, type Component } from "solid-js"
import { bridgeRequestViewport } from "@apiteam/twa-bridge/solid"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  return (
    <FixedLayout
      position={"bottom"}
      style={{
        "z-index": 3,
      }}
    >
      <WriteBar>
        <WriteBar.Icon>test</WriteBar.Icon>
        <WriteBar.Field>
          <WriteBar.Field.Textarea />
        </WriteBar.Field>
        <WriteBar.Icon>test</WriteBar.Icon>
      </WriteBar>
    </FixedLayout>
  )
}

export default Footer
