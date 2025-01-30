import { Background, Flex, Message, Plug } from "components"
import { Logo, LogoElumTeam } from "source"

import { type JSX, type Component } from "solid-js"
import { timeAgoOnlyDate } from "engine"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
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
            text={"Он хочет, чтобы я повернулся направо? Или налево?"}
            time={new Date()}
            isRead={true}
          />
          <Message
            forward={{
              text: "Он хочет, чтобы я повернулся направо? Или налево?",
            }}
            type={"in"}
            text={"Голову направо и выразительно."}
            time={new Date()}
            isRead={true}
          />
          <Message
            type={"out"}
            text={"И это всё? Мне кажетcя, он сказал намного больше."}
            time={new Date()}
            isRead={true}
          />
        </Message.Group.List>
      </Message.Group>
    </Flex>
  )
}

export default Content
