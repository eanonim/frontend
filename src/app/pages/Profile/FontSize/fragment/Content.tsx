import { Background, Flex, Message } from "components"
import loc from "engine/languages"

import { type JSX, type Component } from "solid-js"
import { timeAgoOnlyDate } from "engine"
import { useAtom } from "engine/modules/smart-data"
import { SETTINGS_ATOM } from "engine/state"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const [settings] = useAtom(SETTINGS_ATOM)

  return (
    <>
      <Background
        fixed
        type={settings.backgroundId}
        color={settings.backgroundColor}
        quality={2}
      />
      <Flex
        style={{
          height: "100%",
          overflow: "hidden",
          "margin-top": "auto",
        }}
      >
        <Message.Group>
          <Message.Group.List>
            <Message.System key={0}>
              {timeAgoOnlyDate(new Date().getTime())}
            </Message.System>
            <Message
              type={"out"}
              text={lang("font_size.templates.1")}
              time={new Date()}
              isRead={true}
            />
            <Message
              forward={{
                message: lang("font_size.templates.1"),
              }}
              type={"in"}
              text={lang("font_size.templates.2")}
              time={new Date()}
              isRead={true}
            />
            <Message
              type={"out"}
              text={lang("font_size.templates.3")}
              time={new Date()}
              isRead={true}
            />
          </Message.Group.List>
        </Message.Group>
      </Flex>
    </>
  )
}

export default Content
