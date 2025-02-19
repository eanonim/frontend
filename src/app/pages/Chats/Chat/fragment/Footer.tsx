import { FixedLayout, WriteBar } from "components"
import { IconGiftFilled, IconPaperclip, IconSend } from "source"

import { type JSX, type Component, createSignal } from "solid-js"
import { pages, useParams } from "router"
import { messageSend, messageTyping } from "engine/api"
import { leading, throttle } from "@solid-primitives/scheduled"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const params = useParams<{ dialog: string }>({ pageId: pages.CHAT })

  const [message, setMessage] = createSignal("")

  const handlerSend = () => {
    const messageTest = message()
    if (messageTest) {
      messageSend({
        dialog: params().dialog,
        message: {
          message: messageTest,
        },
      })
    }
  }

  const setTyping = leading(
    throttle,
    () => {
      messageTyping({ dialog: params().dialog })
    },
    3000,
  )

  const onInput: JSX.InputEventHandler<HTMLTextAreaElement, InputEvent> = (
    event,
  ) => {
    setTyping()
    setMessage(event.target.value)
  }

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
          <WriteBar.Field.Textarea value={message()} onInput={onInput} />
        </WriteBar.Field>
        <WriteBar.Icon onClick={handlerSend}>
          <IconSend color={"var(--accent_color)"} />
        </WriteBar.Icon>
        {/* <WriteBar.Icon>
          <IconGiftFilled color={"var(--separator_primary)"} />
        </WriteBar.Icon> */}
      </WriteBar>
    </FixedLayout>
  )
}

export default Footer
