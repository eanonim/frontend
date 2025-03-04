import { Button, TextProps, Title } from "components"
import loc from "engine/languages"
import { setter, useAtom } from "engine/modules/smart-data"
import { USER_ATOM } from "engine/state"
import { emojis } from "root/configs"

import { type JSX, type Component, For, createSignal } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const [user] = useAtom(USER_ATOM, {}, { key: "edit" })

  const handlerEmoji = (value: number) => {
    setter([USER_ATOM, "edit"], "emoji", value)
  }

  return (
    <span style={{ position: "relative" }}>
      <Button.Group>
        <Button.Group.Container wrap>
          <For each={emojis}>
            {(icon, index) => (
              <Button
                onClick={() => handlerEmoji(icon.id)}
                appearance={user.emoji === icon.id ? "accent" : "secondary"}
                data-index={index()}
                type={"icon"}
                size={"small"}
              >
                <Button.Container
                  style={{
                    width: "32px",
                    height: "32px",
                    "font-size": "22px",
                  }}
                >
                  {icon.text}
                </Button.Container>
              </Button>
            )}
          </For>
        </Button.Group.Container>
      </Button.Group>
    </span>
  )
}

export default Content
