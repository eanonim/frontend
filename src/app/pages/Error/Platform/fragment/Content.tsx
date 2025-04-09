import { Plug, SubTitle, Title } from "components"

import { type JSX, type Component } from "solid-js"
import loc from "engine/languages"
import { QRCodeSVG } from "solid-qr-code"
import { URL_APP } from "root/configs"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()

  return (
    <Plug full>
      <Plug.Container>
        <Plug.Icon>
          <QRCodeSVG
            backgroundAlpha={1}
            backgroundColor={"transparent"}
            foregroundColor={"var(--text_primary)"}
            foregroundAlpha={1}
            level={"high"}
            value={URL_APP}
            width={window.innerWidth / 1.5}
            height={window.innerWidth / 1.5}
          />
        </Plug.Icon>
      </Plug.Container>
      <SubTitle>{lang("not_supported.subtitle")}</SubTitle>
    </Plug>
  )
}

export default Content
