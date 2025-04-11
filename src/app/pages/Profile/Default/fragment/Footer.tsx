import { type TextProps, Plug, SubTitle } from "components"

import { version } from "root/package.json"

import { type JSX, type Component } from "solid-js"
import { LogoElumTeam } from "source"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const textProps: TextProps = {
  iOS: {
    color: "secondary",
    size: "x-small",
    weight: "400",
  },
  android: "iOS",
  macOS: "iOS",
  windows: "iOS",
  others: "iOS",
}

const Footer: Component<Footer> = (props) => {
  return (
    <Plug>
      <Plug.Container>
        {/* <Plug.Icon>
          <LogoElumTeam height={28} />
        </Plug.Icon> */}
        <SubTitle {...textProps}>
          {version} ({import.meta.env.APP_VERSION})
        </SubTitle>
      </Plug.Container>
    </Plug>
  )
}

export default Footer
