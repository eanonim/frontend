import { Control, FixedLayout, Range, Separator, Title } from "components"
import { IconLetterCase } from "source"

import { type JSX, type Component, createSignal } from "solid-js"
import { backPage } from "router"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const [value, setValue] = createSignal(14)
  const handlerCancel = () => {}

  const handlerAccept = () => {
    backPage()
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
        <Range.Input onRange={onInput} min={10} max={18} value={value()} />
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
          <Title>Отмена</Title>
        </Control.Button>
        <Separator type={"vertical"} />
        <Control.Button onClick={handlerAccept}>
          <Title>Применить</Title>
        </Control.Button>
      </Control>
    </FixedLayout>
  )
}

export default Footer
