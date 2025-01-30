import { FixedLayout, WriteBar } from "components"
import { IconGiftFilled, IconPaperclip } from "source"

import { type JSX, type Component } from "solid-js"

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
        <WriteBar.Icon>
          <IconPaperclip color={"var(--separator_primary)"} />
        </WriteBar.Icon>
        <WriteBar.Field>
          <WriteBar.Field.Textarea />
        </WriteBar.Field>
        <WriteBar.Icon>
          <IconGiftFilled color={"var(--separator_primary)"} />
        </WriteBar.Icon>
      </WriteBar>
    </FixedLayout>
  )
}

export default Footer
