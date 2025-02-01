import { Background, Flex, Message } from "components"
import loc from "engine/languages"

import { type JSX, type Component } from "solid-js"
import { timeAgoOnlyDate } from "engine"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()

  return (
    <Flex
      style={{
        height: "100%",
        overflow: "hidden",
        "margin-top": "auto",
      }}
    >
      <Background fixed type={2} quality={2} />
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
              text: lang("font_size.templates.1"),
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
  )
}

export default Content
