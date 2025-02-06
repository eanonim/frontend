import { Control, FixedLayout, Range, Separator, Title } from "components"
import { IconLetterCase } from "source"
import loc from "engine/languages"

import { type JSX, type Component, createSignal } from "solid-js"
import { backPage } from "router"
import { setFontSize, SETTINGS_ATOM } from "engine/state/settings"
import { getter } from "engine/modules/smart-data"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()

  const [value, setValue] = createSignal(getter(SETTINGS_ATOM).font_size)
  const handlerCancel = () => {
    backPage()
    setValue(getter(SETTINGS_ATOM).font_size)
    document.body.style.setProperty("--message_font_size", `${value()}pt`)
    document.body.style.setProperty("--message_line_height", `${value() + 4}pt`)
  }

  const handlerAccept = () => {
    backPage()
    setFontSize(value())
  }

  const onInput = (value: number) => {
    setValue(value)
    document.body.style.setProperty("--message_font_size", `${value}pt`)
    document.body.style.setProperty("--message_line_height", `${value + 4}pt`)
  }

  return (
    <FixedLayout position={"bottom"} background={"section_bg_color"}>
      <Separator />
      <Range>
        <Range.Icon>
          <IconLetterCase
            width={28}
            height={28}
            color={"var(--text_primary)"}
            style={{
              transform: "scale(0.7)",
              "-webkit-transform": "scale(0.7)",
            }}
          />
        </Range.Icon>
        <Range.Input onRange={onInput} min={10} max={16} value={value()} />
        <Range.Icon>
          <IconLetterCase
            width={28}
            height={28}
            color={"var(--text_primary)"}
          />
        </Range.Icon>
      </Range>
      <Separator />
      <Control safeBottom>
        <Control.Button onClick={handlerCancel}>
          <Title>{lang("cancel")}</Title>
        </Control.Button>
        <Separator type={"vertical"} />
        <Control.Button onClick={handlerAccept}>
          <Title>{lang("apply")}</Title>
        </Control.Button>
      </Control>
    </FixedLayout>
  )
}

export default Footer
